declare interface GraphQlQueryConstructor {
	new (fnNameS: any, aliasS_OR_Filter: any): GraphQlQuery;
}

class GraphQlQuery {
	private head;
	private alias;
	private body;

	constructor(private fnName: string, private alias_OR_filter?: string|Object) {
		this.head = [];

		if (typeof alias_OR_filter === 'string') {
			this.setAlias(alias_OR_filter);
		} else if (typeof alias_OR_filter === 'object') {
			this.filter(alias_OR_filter);
		} else if (undefined === alias_OR_filter && 2 == arguments.length) {
			throw new TypeError(`You have passed undefined as Second argument to 'GraphQlQuery'`);
		} else if (undefined !== alias_OR_filter) {
			throw new TypeError(`Second argument to 'GraphQlQuery' should be an alias name(String) or filter arguments(Object). was passed ${alias_OR_filter}`);
		}
	}

	public filter(filters: Object): GraphQlQuery {
		for (let props in filters) {
			this.head.push(`${props}:${(typeof filters[props] === 'string') ? JSON.stringify(filters[props]) : filters[props]}`);
		}
		return this;
	}

	public setAlias(alias: string): GraphQlQuery {
		this.alias = alias;
		return this;
	}

	public find(find: string|Array<string>): GraphQlQuery {
		if (!find) {
			throw new TypeError('find value can not be >>falsy<<');
		}
		this.body = this.parseFind((Array.isArray(find)) ? find : Array.prototype.slice.call(arguments));

		return this;
	}

	public toString(): string {
		if (undefined === this.body) {
			throw new ReferenceError(`return properties are not defined. use the 'find' function to defined them`);
		}

		return `${ (this.alias) ? (this.alias + ":") : "" } ${this.fnName } ${ (0 < this.head.length) ? "(" + this.head.join(",") + ")" : "" }  { ${ this.body } }`;
	}

	private parseFind(levelA: Array<any>): string {
		let propsA = levelA.map(function (currentValue, index) {

			let itemX = levelA[index];

			if (itemX instanceof GraphQlQuery) {
				return itemX.toString();
			} else if (!Array.isArray(itemX) && typeof itemX === 'object') {
				let propsA = Object.keys(itemX);
				if (1 !== propsA.length) {
					throw new RangeError(`Alias objects should only have one value. was passed: ${JSON.stringify(itemX)}`);
				}
				let propS = propsA[0];
				let item = itemX[propS];
				return `${propS} : ${item} `;
			} else if (typeof itemX === 'string') {
				return itemX;
			} else {
				throw new RangeError(`cannot handle Find value of ${itemX}`);
			}
		});

		return propsA.join(',');
	}
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	module.exports = GraphQlQuery;
}
