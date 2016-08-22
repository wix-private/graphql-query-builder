declare class GraphQlQuery {
    private fnNameS;
    private aliasS_OR_Filter;
    private headA;
    private aliasS;
    private bodyS;
    constructor(fnNameS: any, aliasS_OR_Filter: any);
    filter(filtersO: any): GraphQlQuery;
    setAlias(aliasS: string): GraphQlQuery;
    find(findA: any): GraphQlQuery;
    parseFind(levelA: Array<any>): string;
    toString(): string;
}
