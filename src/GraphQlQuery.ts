namespace gql {
	export interface GraphQlQueryFactory {
		new (fnName: string | IAlias, argumentsMap?: IArgumentsMap): GraphQlQuery;
	}

	export interface IArgumentsMap {
		[index: string]: string|number|boolean|Object;
	}

	export interface IAlias {
		[index: string]: string | GraphQlQuery;
	}

	export interface IHead {
		fnName: IAlias;
		argumentsMap?: IArgumentsMap;
	}

	export interface IBody {
		attr: IAlias;
		argumentsMap?: IArgumentsMap;
	}

	export interface ISelection extends IArgumentsMap {
		_filter?: Object;
	}

	export class GraphQlQuery {
		private head: IHead;
		private body: (IBody|GraphQlQuery)[];
		private isContainer: boolean;

		constructor(fnName: string | IAlias, argumentsMap: IArgumentsMap = {}) {
			this.head = typeof fnName === 'string' ? {fnName: {[fnName]: fnName}} : {fnName};
			this.head.argumentsMap = argumentsMap;
			this.body = [];
			this.isContainer = false;
		}

		public select(...selects: (string | ISelection | GraphQlQuery)[]): GraphQlQuery {
			if (this.isContainer) {
				throw new Error('Can`t use selection on joined query.');
			}

			this.body = this.body.concat(selects.map((item) => {
				let selection: any = {};

				if (typeof item === 'string') {
					selection.attr = {[item]: item};
					selection.argumentsMap = {};
				} else if (item instanceof GraphQlQuery) {
					selection = item;
				} else if (typeof item === 'object') {
					selection.argumentsMap = <IArgumentsMap>item['_filter'] || {};
					delete item['_filter'];
					selection.attr = <IAlias>item;
				}

				return selection;
			}));
			return this;
		}

		public filter(argumentsMap: IArgumentsMap): GraphQlQuery {
			for (let key in argumentsMap) {
				if (argumentsMap.hasOwnProperty(key)) {
					this.head.argumentsMap[key] = argumentsMap[key];
				}
			}

			return this;
		}

		public join(...queries: GraphQlQuery[]): GraphQlQuery {
			const combined = new GraphQlQuery('');
			combined.isContainer = true;
			combined.body.push(this);
			combined.body = combined.body.concat(queries);

			return combined;
		}

		public toString() {
			return this.isContainer ? `{ ${this.buildBody()} }` : `{ ${this.buildHeader()}{${this.buildBody()}} }`;
		}

		private buildHeader(): string {
			return this.handleAlias(this.head.fnName) + this.handleArguments(this.head.argumentsMap);
		}

		private handleArguments(argumentsMap: IArgumentsMap): string {
			const hasArguments = Object.keys(argumentsMap).length > 0;
			let args = '';

			if (hasArguments) {
				args = Object.keys(argumentsMap)
					.map((key: string) => `${key}: ${JSON.stringify(argumentsMap[key])}`)
					.join(', ');
				args = `(${args})`;
			}

			return args;
		}

		private handleAlias(attr: IAlias): string {
			let alias = Object.keys(attr)[0];
			let value = this.prepareAsInnerQuery(attr[alias]);

			value = (alias !== value) ? `${alias}: ${value}` : value;
			return value;
		}

		private buildBody(): string {
			return this.body.map((item: IBody | GraphQlQuery) => {
				if (item instanceof GraphQlQuery) {
					return this.prepareAsInnerQuery(item);
				} else {
					return this.handleAlias(item['attr']) + this.handleArguments(item['argumentsMap']);
				}
			}).join(' ');
		}

		private prepareAsInnerQuery(query: string|GraphQlQuery): string {
			let ret = '';
			if (query instanceof GraphQlQuery) {
				ret = query.toString();
				ret = ret.substr(2, ret.length - 4);
			} else {
				ret = query;
			}
			return ret;
		}
	}
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	module.exports = gql.GraphQlQuery;
}