export interface UpdateProfileRequest {
    bio?: string;
    interests?: string[];
    modes?: string[];
    city?: string;
    locationLat?: number;
    locationLng?: number;
    vibeAnswers?: Record<string, string>;
}
export interface ProfileResponse {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    bio?: string;
    profilePhotos: string[];
    videoStoryUrl?: string;
    interests: string[];
    modes: string[];
    city?: string;
    isVerified: boolean;
    safetyScore: number;
    premiumTier: string;
    vibeAnswers?: Record<string, string>;
}
export declare const getProfile: (params: {
    userId: string;
}) => Promise<ProfileResponse>;
export declare const updateProfile: (params: UpdateProfileRequest & {
    userId: string;
}) => Promise<ProfileResponse>;
export declare const getVibeQuestions: () => Promise<{
    questions: Array<{
        id: number;
        question: string;
        options: string[];
        category: string;
    }>;
}>;
