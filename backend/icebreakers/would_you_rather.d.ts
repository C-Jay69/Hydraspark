interface WouldYouRatherQuestion {
    optionA: string;
    optionB: string;
}
export declare function GetWouldYouRather(): Promise<{
    question: WouldYouRatherQuestion;
}>;
export {};
