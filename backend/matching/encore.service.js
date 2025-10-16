import { api } from "encore.dev/api";
import { CreateSwipe, GetMatches, GetRecommendations } from "./matching";
export const matchingService = api({
    auth: true,
    base: "/matching",
    endpoints: {
        recommendations: {
            method: "GET",
            path: "/recommendations",
            handler: GetRecommendations,
        },
        swipe: {
            method: "POST",
            path: "/swipes",
            handler: CreateSwipe,
        },
        matches: {
            method: "GET",
            path: "/matches",
            handler: GetMatches,
        },
    },
});
//# sourceMappingURL=encore.service.js.map