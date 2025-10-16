
import { api } from "encore.dev/api";
import { discover as GetRecommendations } from "./discover";
import { swipe as CreateSwipe, getMatches as GetMatches } from "./swipe";

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
