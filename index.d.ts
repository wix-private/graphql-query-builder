declare class Query {
    private _fnNameS;
    private _aliasS_OR_Filter;
    private headA;
    private aliasS;
    private bodyS;
    constructor(_fnNameS: any, _aliasS_OR_Filter: any);
    filter(filtersO: any): this;
    setAlias(_aliasS: string): this;
    find(findA: any): this;
    parceFind(_levelA: Array<any>): string;
    toString(): string;
}
