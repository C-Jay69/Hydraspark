
import { api } from "encore.dev/api";
import { AddTrustedContact, GetTrustedContacts, RemoveTrustedContact } from "./safety";

export const safetyService = api({
  auth: true,
  base: "/safety",
  endpoints: {
    addTrustedContact: {
      method: "POST",
      path: "/trusted-contacts",
      handler: AddTrustedContact,
    },
    getTrustedContacts: {
      method: "GET",
      path: "/trusted-contacts",
      handler: GetTrustedContacts,
    },
    removeTrustedContact: {
      method: "DELETE",
      path: "/trusted-contacts/:id",
      handler: RemoveTrustedContact,
    },
  },
});
