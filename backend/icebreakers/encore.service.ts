
import { api } from "encore.dev/api";
import { GetTwoTruthsOneLie } from "./two_truths_one_lie";

export const icebreakersService = api({
  auth: true,
  base: "/icebreakers",
  endpoints: {
    twoTruthsOneLie: {
      method: "GET",
      path: "/two-truths-one-lie",
      handler: GetTwoTruthsOneLie,
    },
  },
});
