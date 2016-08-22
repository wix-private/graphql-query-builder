class GraphQlQuery {
	private headA;
	private aliasS;
	private bodyS;

	constructor(private fnNameS, private aliasS_OR_Filter) {
		this.headA = [];

		if ("string" === typeof aliasS_OR_Filter) {
			this.aliasS = aliasS_OR_Filter;
		} else if ("object" === typeof aliasS_OR_Filter) {
			this.filter(aliasS_OR_Filter);
		} else if (undefined === aliasS_OR_Filter && 2 == arguments.length) {
			throw new TypeError("You have passed undefined as Second argument to 'GraphQlQuery'");
		} else if (undefined !== aliasS_OR_Filter) {
			throw new TypeError("Second argument to 'GraphQlQuery' should be an alias name(String) or filter arguments(Object). was passed " + aliasS_OR_Filter);
		}
	}

	public filter(filtersO: any): GraphQlQuery {
		for (let propS in filtersO) {
			this.headA.push(`${propS}:${("string" === typeof filtersO[propS]) ? JSON.stringify(filtersO[propS]) : filtersO[propS]}`);
		}
		return this;
	}

	public setAlias(aliasS: string): GraphQlQuery {
		this.aliasS = aliasS;
		return this;
	}

	public find(findA: any): GraphQlQuery {
		if (!findA) {
			throw new TypeError("find value can not be >>falsy<<");
		}
		this.bodyS = this.parseFind((Array.isArray(findA)) ? findA : Array.prototype.slice.call(arguments));

		return this;
	}

	public parseFind(levelA: Array<any>): string {
		let propsA = levelA.map(function (currentValue, index) {

			let itemX = levelA[index];

			if (itemX instanceof GraphQlQuery) {
				return itemX.toString();
			} else if (!Array.isArray(itemX) && "object" === typeof itemX) {
				let propsA = Object.keys(itemX);
				if (1 !== propsA.length) {
					throw new RangeError("Alias objects should only have one value. was passed: " + JSON.stringify(itemX));
				}
				let propS = propsA[0];
				let item = itemX[propS];
				return `${propS} : ${item} `;
			} else if ("string" === typeof itemX) {
				return itemX;
			} else {
				throw new RangeError("cannot handle Find value of " + itemX);
			}
		});

		return propsA.join(",");
	}

	public toString(): string {
		if (undefined === this.bodyS) {
			throw new ReferenceError("return properties are not defined. use the 'find' function to defined them");
		}

		return `${ (this.aliasS) ? (this.aliasS + ":") : "" } ${this.fnNameS } ${ (0 < this.headA.length) ? "(" + this.headA.join(",") + ")" : "" }  { ${ this.bodyS } }`;
	}
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	module.exports = GraphQlQuery;
}
