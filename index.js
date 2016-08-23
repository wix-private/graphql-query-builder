var GraphQlQuery = (function () {
    function GraphQlQuery(fnName, alias_OR_filter) {
        this.fnName = fnName;
        this.alias_OR_filter = alias_OR_filter;
        this.head = [];
        if (typeof alias_OR_filter === 'string') {
            this.setAlias(alias_OR_filter);
        }
        else if (typeof alias_OR_filter === 'object') {
            this.filter(alias_OR_filter);
        }
        else if (undefined === alias_OR_filter && 2 == arguments.length) {
            throw new TypeError("You have passed undefined as Second argument to 'GraphQlQuery'");
        }
        else if (undefined !== alias_OR_filter) {
            throw new TypeError("Second argument to 'GraphQlQuery' should be an alias name(String) or filter arguments(Object). was passed " + alias_OR_filter);
        }
    }
    GraphQlQuery.prototype.filter = function (filters) {
        for (var props in filters) {
            this.head.push(props + ":" + ((typeof filters[props] === 'string') ? JSON.stringify(filters[props]) : filters[props]));
        }
        return this;
    };
    GraphQlQuery.prototype.setAlias = function (alias) {
        this.alias = alias;
        return this;
    };
    GraphQlQuery.prototype.find = function (find) {
        if (!find) {
            throw new TypeError('find value can not be >>falsy<<');
        }
        this.body = this.parseFind((Array.isArray(find)) ? find : Array.prototype.slice.call(arguments));
        return this;
    };
    GraphQlQuery.prototype.toString = function () {
        if (undefined === this.body) {
            throw new ReferenceError("return properties are not defined. use the 'find' function to defined them");
        }
        return ((this.alias) ? (this.alias + ":") : "") + " " + this.fnName + " " + ((0 < this.head.length) ? "(" + this.head.join(",") + ")" : "") + "  { " + this.body + " }";
    };
    GraphQlQuery.prototype.parseFind = function (levelA) {
        var propsA = levelA.map(function (currentValue, index) {
            var itemX = levelA[index];
            if (itemX instanceof GraphQlQuery) {
                return itemX.toString();
            }
            else if (!Array.isArray(itemX) && typeof itemX === 'object') {
                var propsA_1 = Object.keys(itemX);
                if (1 !== propsA_1.length) {
                    throw new RangeError("Alias objects should only have one value. was passed: " + JSON.stringify(itemX));
                }
                var propS = propsA_1[0];
                var item = itemX[propS];
                return propS + " : " + item + " ";
            }
            else if (typeof itemX === 'string') {
                return itemX;
            }
            else {
                throw new RangeError("cannot handle Find value of " + itemX);
            }
        });
        return propsA.join(',');
    };
    return GraphQlQuery;
}());
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = GraphQlQuery;
}

//# sourceMappingURL=index.js.map
