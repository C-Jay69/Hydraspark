interface TwoTruthsOneLieStatement {
    text: string;
    isLie: boolean;
}
export declare function GetTwoTruthsOneLie(): Promise<{
    statements: TwoTruthsOneLieStatement[];
}>;
export {};
