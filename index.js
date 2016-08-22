var GraphQlQuery = (function () {
    function GraphQlQuery(fnNameS, aliasS_OR_Filter) {
        this.fnNameS = fnNameS;
        this.aliasS_OR_Filter = aliasS_OR_Filter;
        this.headA = [];
        if ("string" === typeof aliasS_OR_Filter) {
            this.aliasS = aliasS_OR_Filter;
        }
        else if ("object" === typeof aliasS_OR_Filter) {
            this.filter(aliasS_OR_Filter);
        }
        else if (undefined === aliasS_OR_Filter && 2 == arguments.length) {
            throw new TypeError("You have passed undefined as Second argument to 'GraphQlQuery'");
        }
        else if (undefined !== aliasS_OR_Filter) {
            throw new TypeError("Second argument to 'GraphQlQuery' should be an alias name(String) or filter arguments(Object). was passed " + aliasS_OR_Filter);
        }
    }
    GraphQlQuery.prototype.filter = function (filtersO) {
        for (var propS in filtersO) {
            this.headA.push(propS + ":" + (("string" === typeof filtersO[propS]) ? JSON.stringify(filtersO[propS]) : filtersO[propS]));
        }
        return this;
    };
    GraphQlQuery.prototype.setAlias = function (aliasS) {
        this.aliasS = aliasS;
        return this;
    };
    GraphQlQuery.prototype.find = function (findA) {
        if (!findA) {
            throw new TypeError("find value can not be >>falsy<<");
        }
        this.bodyS = this.parseFind((Array.isArray(findA)) ? findA : Array.prototype.slice.call(arguments));
        return this;
    };
    GraphQlQuery.prototype.parseFind = function (levelA) {
        var propsA = levelA.map(function (currentValue, index) {
            var itemX = levelA[index];
            if (itemX instanceof GraphQlQuery) {
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
    GraphQlQuery.prototype.toString = function () {
        if (undefined === this.bodyS) {
            throw new ReferenceError("return properties are not defined. use the 'find' function to defined them");
        }
        return ((this.aliasS) ? (this.aliasS + ":") : "") + " " + this.fnNameS + " " + ((0 < this.headA.length) ? "(" + this.headA.join(",") + ")" : "") + "  { " + this.bodyS + " }";
    };
    return GraphQlQuery;
}());
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = GraphQlQuery;
}

//# sourceMappingURL=index.js.map
