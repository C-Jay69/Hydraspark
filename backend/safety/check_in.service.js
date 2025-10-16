import { api } from "encore.dev/api";
import { StartCheckIn, GetCheckIn, EndCheckIn } from "./check_in";
export const checkInService = api({
    auth: true,
    base: "/safety/check-in",
    endpoints: {
        start: {
            method: "POST",
            handler: StartCheckIn,
        },
        get: {
            method: "GET",
            handler: GetCheckIn,
        },
        end: {
            method: "DELETE",
            handler: EndCheckIn,
        },
    },
});
//# sourceMappingURL=check_in.service.js.map