var gql;
(function (gql) {
    var GraphQlQuery = (function () {
        function GraphQlQuery(fnName, argumentsMap) {
            if (argumentsMap === void 0) { argumentsMap = {}; }
            this.head = typeof fnName === 'string' ? { fnName: (_a = {}, _a[fnName] = fnName, _a) } : { fnName: fnName };
            this.head.argumentsMap = argumentsMap;
            this.body = [];
            this.isContainer = false;
            var _a;
        }
        GraphQlQuery.prototype.select = function () {
            var selects = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                selects[_i - 0] = arguments[_i];
            }
            if (this.isContainer) {
                throw new Error('Can`t use selection on joined query.');
            }
            this.body = this.body.concat(selects.map(function (item) {
                var selection = {};
                if (typeof item === 'string') {
                    selection.attr = (_a = {}, _a[item] = item, _a);
                    selection.argumentsMap = {};
                }
                else if (item instanceof GraphQlQuery) {
                    selection = item;
                }
                else if (typeof item === 'object') {
                    selection.argumentsMap = item['_filter'] || {};
                    delete item['_filter'];
                    selection.attr = item;
                }
                return selection;
                var _a;
            }));
            return this;
        };
        GraphQlQuery.prototype.filter = function (argumentsMap) {
            for (var key in argumentsMap) {
                if (argumentsMap.hasOwnProperty(key)) {
                    this.head.argumentsMap[key] = argumentsMap[key];
                }
            }
            return this;
        };
        GraphQlQuery.prototype.join = function () {
            var queries = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                queries[_i - 0] = arguments[_i];
            }
            var combined = new GraphQlQuery('');
            combined.isContainer = true;
            combined.body.push(this);
            combined.body = combined.body.concat(queries);
            return combined;
        };
        GraphQlQuery.prototype.toString = function () {
            return this.isContainer ? "{ " + this.buildBody() + " }" : "{ " + this.buildHeader() + "{" + this.buildBody() + "} }";
        };
        GraphQlQuery.prototype.buildHeader = function () {
            return this.handleAlias(this.head.fnName) + this.handleArguments(this.head.argumentsMap);
        };
        GraphQlQuery.prototype.handleArguments = function (argumentsMap) {
            var query = this.objectToString(argumentsMap);
            return query ? "(" + query + ")" : '';
        };
        GraphQlQuery.prototype.getGraphQLValue = function (value) {
            var _this = this;
            if (Array.isArray(value)) {
                var array = value.map(function (item) {
                    return _this.getGraphQLValue(item);
                }).join();
                return "[" + array + "]";
            }
            else if ("object" === typeof value) {
                return "{" + this.objectToString(value) + "}";
            }
            else {
                return JSON.stringify(value);
            }
        };
        GraphQlQuery.prototype.objectToString = function (obj) {
            var _this = this;
            return Object.keys(obj).map(function (key) { return (key + ": " + _this.getGraphQLValue(obj[key])); }).join(', ');
        };
        GraphQlQuery.prototype.handleAlias = function (attr) {
            var alias = Object.keys(attr)[0];
            var value = this.prepareAsInnerQuery(attr[alias]);
            value = (alias !== value) ? alias + ": " + value : value;
            return value;
        };
        GraphQlQuery.prototype.buildBody = function () {
            var _this = this;
            return this.body.map(function (item) {
                if (item instanceof GraphQlQuery) {
                    return _this.prepareAsInnerQuery(item);
                }
                else {
                    return _this.handleAlias(item['attr']) + _this.handleArguments(item['argumentsMap']);
                }
            }).join(' ');
        };
        GraphQlQuery.prototype.prepareAsInnerQuery = function (query) {
            var ret = '';
            if (query instanceof GraphQlQuery) {
                ret = query.toString();
                ret = ret.substr(2, ret.length - 4);
            }
            else {
                ret = query.toString();
            }
            return ret;
        };
        return GraphQlQuery;
    }());
    gql.GraphQlQuery = GraphQlQuery;
})(gql || (gql = {}));
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = gql.GraphQlQuery;
}

//# sourceMappingURL=GraphQlQuery.js.map
