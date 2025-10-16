
import { api } from "encore.dev/api";
import { CreateVirtualDate, GetVirtualDate } from "./virtual_dates";

export const virtualDatesService = api({
  auth: true,
  base: "/virtual-dates",
  endpoints: {
    create: {
      method: "POST",
      path: "/",
      handler: CreateVirtualDate,
    },
    get: {
      method: "GET",
      path: "/:id",
      handler: GetVirtualDate,
    },
  },
});
