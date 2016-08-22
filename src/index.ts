class GraphQlQuery {
	private headA;
	private aliasS;
	private bodyS;

	constructor(private _fnNameS, private _aliasS_OR_Filter) {
		this.headA = [];

		if ("string" === typeof _aliasS_OR_Filter) {
			this.aliasS = _aliasS_OR_Filter;
		} else if ("object" === typeof _aliasS_OR_Filter) {
			this.filter(_aliasS_OR_Filter);
		} else if (undefined === _aliasS_OR_Filter && 2 == arguments.length) {
			throw new TypeError("You have passed undefined as Second argument to 'GraphQlQuery'");
		} else if (undefined !== _aliasS_OR_Filter) {
			throw new TypeError("Second argument to 'GraphQlQuery' should be an alias name(String) or filter arguments(Object). was passed " + _aliasS_OR_Filter);
		}
	}

	filter(filtersO: any) {
		for (let propS in filtersO) {
			this.headA.push(`${propS}:${("string" === typeof filtersO[propS]) ? JSON.stringify(filtersO[propS]) : filtersO[propS]}`);
		}
		return this;
	}

	setAlias(_aliasS: string) {
		this.aliasS = _aliasS;
		return this;
	}

	find(findA: any) {
		if (!findA) {
			throw new TypeError("find value can not be >>falsy<<");
		}
		this.bodyS = this.parceFind((Array.isArray(findA)) ? findA : Array.prototype.slice.call(arguments));
		
		return this;
	}

	parceFind(_levelA: Array<any>) {
		let propsA = _levelA.map(function (currentValue, index) {

			let itemX = _levelA[index];

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

	toString() {
		if (undefined === this.bodyS) {
			throw new ReferenceError("return properties are not defined. use the 'find' function to defined them");
		}

		return `${ (this.aliasS) ? (this.aliasS + ":") : "" } ${this._fnNameS } ${ (0 < this.headA.length) ? "(" + this.headA.join(",") + ")" : "" }  { ${ this.bodyS } }`;
	}
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	module.exports = GraphQlQuery;
}
