declare namespace gql {
    interface GraphQlQueryFactory {
        new (fnName: string | IAlias, argumentsMap?: IArgumentsMap): GraphQlQuery;
    }
    interface IArgumentsMap {
        [index: string]: string | number | boolean | Object;
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
        constructor(fnName: string | IAlias, argumentsMap?: IArgumentsMap);
        select(...selects: (string | ISelection | GraphQlQuery)[]): GraphQlQuery;
        join(...queries: GraphQlQuery[]): GraphQlQuery;
        toString(): string;
        private buildHeader();
        private handleArguments(argumentsMap);
        private handleAlias(attr);
        private buildBody();
        private prepareAsInnerQuery(query);
    }
}
