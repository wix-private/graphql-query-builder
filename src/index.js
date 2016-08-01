var Query = (function () {
    function Query(_fnNameS, _aliasS_OR_Filter) {
        this._fnNameS = _fnNameS;
        this._aliasS_OR_Filter = _aliasS_OR_Filter;
        this.headA = [];
        if ("string" === typeof _aliasS_OR_Filter) {
            this.aliasS = _aliasS_OR_Filter;
        }
        else if ("object" === typeof _aliasS_OR_Filter) {
            this.filter(_aliasS_OR_Filter);
        }
        else if (undefined === _aliasS_OR_Filter && 2 == arguments.length) {
            throw new TypeError("You have passed undefined as Second argument to 'Query'");
        }
        else if (undefined !== _aliasS_OR_Filter) {
            throw new TypeError("Second argument to 'Query' should be an alias name(String) or filter arguments(Object). was passed " + _aliasS_OR_Filter);
        }
    }
    Query.prototype.filter = function (filtersO) {
        for (var propS in filtersO) {
            this.headA.push(propS + ":" + (("string" === typeof filtersO[propS]) ? JSON.stringify(filtersO[propS]) : filtersO[propS]));
        }
        return this;
    };
    Query.prototype.setAlias = function (_aliasS) {
        this.aliasS = _aliasS;
        return this;
    };
    Query.prototype.find = function (findA) {
        if (!findA) {
            throw new TypeError("find value can not be >>falsy<<");
        }
        this.bodyS = this.parceFind((Array.isArray(findA)) ? findA : Array.prototype.slice.call(arguments));
        return this;
    };
    Query.prototype.parceFind = function (_levelA) {
        var propsA = _levelA.map(function (currentValue, index) {
            var itemX = _levelA[index];
            if (itemX instanceof Query) {
                return itemX.toString();
            }
            else if (!Array.isArray(itemX) && "object" === typeof itemX) {
                var propsA_1 = Object.keys(itemX);
                if (1 !== propsA_1.length) {
                    throw new RangeError("Alias objects should only have one value. was passed: " + JSON.stringify(itemX));
                }
                var propS = propsA_1[0];
                var item = itemX[propS];
                return propS + " : " + item + " ";
            }
            else if ("string" === typeof itemX) {
                return itemX;
            }
            else {
                throw new RangeError("cannot handle Find value of " + itemX);
            }
        });
        return propsA.join(",");
    };
    Query.prototype.toString = function () {
        if (undefined === this.bodyS) {
            throw new ReferenceError("return properties are not defined. use the 'find' function to defined them");
        }
        return ((this.aliasS) ? (this.aliasS + ":") : "") + " " + this._fnNameS + " " + ((0 < this.headA.length) ? "(" + this.headA.join(",") + ")" : "") + "  { " + this.bodyS + " }";
    };
    return Query;
}());
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Query;
}

//# sourceMappingURL=index.js.map
