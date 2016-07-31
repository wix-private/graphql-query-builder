"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

(function () {
	'use strict';

	//=====================================================
	//============================ parce properties to find
	//=====================================================

	function parceFind(_levelA) {
		//+++++++++++++++++++++++++++++++++++ work over Array
		//++++++++++++++++++++++++++++++++++++++++++++++++++++

		var propsA = _levelA.map(function (currentValue, index) {

			var itemX = _levelA[index];

			if (itemX instanceof Query) {
				return itemX.toString();
			} else if (!Array.isArray(itemX) && "object" === (typeof itemX === "undefined" ? "undefined" : _typeof(itemX))) {
				var _propsA = Object.keys(itemX);
				if (1 !== _propsA.length) {
					throw new RangeError("Alias objects should only have one value. was passed: " + JSON.stringify(itemX));
				}
				var propS = _propsA[0];
				var item = itemX[propS];
				return propS + " : " + item + " ";
			} else if ("string" === typeof itemX) {
				return itemX;
			} else {
				throw new RangeError("cannot handle Find value of " + itemX);
			}
		});

		return propsA.join(",");
	}

	//=====================================================
	//========================================= Query Class
	//=====================================================

	function Query(_fnNameS, _aliasS_OR_Filter) {
		var _this = this;

		this.fnNameS = _fnNameS;
		this.headA = [];

		this.filter = function (filtersO) {
			for (var propS in filtersO) {
				_this.headA.push(propS + ":" + ("string" === typeof filtersO[propS] ? JSON.stringify(filtersO[propS]) : filtersO[propS]));
			}
			return _this;
		};

		if ("string" === typeof _aliasS_OR_Filter) {
			this.aliasS = _aliasS_OR_Filter;
		} else if ("object" === (typeof _aliasS_OR_Filter === "undefined" ? "undefined" : _typeof(_aliasS_OR_Filter))) {
			this.filter(_aliasS_OR_Filter);
		} else if (undefined === _aliasS_OR_Filter && 2 == arguments.length) {
			throw new TypeError("You have passed undefined as Second argument to 'Query'");
		} else if (undefined !== _aliasS_OR_Filter) {
			throw new TypeError("Second argument to 'Query' should be an alias name(String) or filter arguments(Object). was passed " + _aliasS_OR_Filter);
		}

		this.setAlias = function (_aliasS) {
			_this.aliasS = _aliasS;
			return _this;
		};

		this.find = function (findA) {
			// THIS NEED TO BE A "FUNCTION" to scope 'arguments'
			if (!findA) {
				throw new TypeError("find value can not be >>falsy<<");
			}
			// if its a string.. it may have other values
			// else it sould be an Object or Array of maped values
			this.bodyS = parceFind(Array.isArray(findA) ? findA : Array.from(arguments));
			return this;
		};
	};

	//=====================================================
	//===================================== Query prototype
	//=====================================================

	Query.prototype = {

		toString: function toString() {
			if (undefined === this.bodyS) {
				throw new ReferenceError("return properties are not defined. use the 'find' function to defined them");
			}

			return (this.aliasS ? this.aliasS + ":" : "") + " " + this.fnNameS + " " + (0 < this.headA.length ? "(" + this.headA.join(",") + ")" : "") + "  { " + this.bodyS + " }";
		}
	};

	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
		module.exports = Query;
	} else {
		window.Query = Query;
	}
})();
//# sourceMappingURL=index.js.map
