declare namespace gql {
    interface GraphQlQueryFactory {
        new (fnName: string | IAlias, argumentsMap?: IArgumentsMap): GraphQlQuery;
    }
    interface IArgumentsMap {
        [index: string]: string | number | boolean | Object | EnumValue;
    }
    interface IAlias {
        [index: string]: string | GraphQlQuery;
    }
    interface IHead {
        fnName: IAlias;
        argumentsMap?: IArgumentsMap;
    }
    interface IBody {
        attr: IAlias;
        argumentsMap?: IArgumentsMap;
    }
    interface ISelection extends IArgumentsMap {
        _filter?: Object;
    }
    class GraphQlQuery {
        private head;
        private body;
        private isContainer;
        private isWithoutBody;
        constructor(fnName: string | IAlias, argumentsMap?: IArgumentsMap);
        select(...selects: (string | ISelection | GraphQlQuery)[]): GraphQlQuery;
        filter(argumentsMap: IArgumentsMap): GraphQlQuery;
        join(...queries: GraphQlQuery[]): GraphQlQuery;
        withoutBody(): GraphQlQuery;
        toString(): string;
        private buildHeader;
        private buildArguments;
        private getGraphQLValue;
        private objectToString;
        private buildAlias;
        private buildBody;
        private prepareAsInnerQuery;
    }
    class EnumValue {
        private value;
        constructor(value: string);
        toString(): string;
    }
    function enumValue(value: string): EnumValue;
}
