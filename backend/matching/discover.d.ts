interface User {
    id: number;
    firstName: string;
    lastName: string;
    bio: string;
    profilePicture: string;
    interests: string[];
    vibe: number;
}
interface Recommendation extends User {
}
export declare function GetRecommendations(): Promise<{
    recommendations: Recommendation[];
}>;
export {};
