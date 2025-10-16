
import { api } from "encore.dev/api";
import { CreateGroup, GetGroup, GetGroupMessages, SendMessage } from "./groups";

export const groupsService = api({
  auth: true,
  base: "/groups",
  endpoints: {
    create: {
      method: "POST",
      path: "/",
      handler: CreateGroup,
    },
    get: {
      method: "GET",
      path: "/:id",
      handler: GetGroup,
    },
    messages: {
      method: "GET",
      path: "/:id/messages",
      handler: GetGroupMessages,
    },
    sendMessage: {
      method: "POST",
      path: "/:id/messages",
      handler: SendMessage,
    },
  },
});
