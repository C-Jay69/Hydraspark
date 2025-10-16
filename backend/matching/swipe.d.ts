export interface SwipeRequest {
    userId: string;
    targetUserId: string;
    direction: "left" | "right" | "super";
}
export interface SwipeResponse {
    isMatch: boolean;
    vibeScore?: number;
    matchId?: number;
}
export declare const swipe: (params: SwipeRequest) => Promise<SwipeResponse>;
export declare const getMatches: (params: {
    userId: string;
}) => Promise<{
    matches: Array<{
        id: number;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            profilePhotos: string[];
            isVerified: boolean;
        };
        vibeScore: number;
        lastMessageAt?: Date;
        createdAt: Date;
    }>;
}>;
