interface GraphQlQueryConstructor {
    new (fnNameS: any, aliasS_OR_Filter?: any): GraphQlQuery;
}
declare class GraphQlQuery {
    private fnName;
    private alias_OR_filter;
    private head;
    private alias;
    private body;
    constructor(fnName: string, alias_OR_filter?: string | Object);
    filter(filters: Object): GraphQlQuery;
    setAlias(alias: string): GraphQlQuery;
    find(find: string | Array<string>): GraphQlQuery;
    toString(): string;
    private parseFind(levelA);
}
