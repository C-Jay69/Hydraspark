import { api } from "encore.dev/api";
import { GetConversations, GetMessages, SendMessage } from "./chat";
export const chatService = api({
    auth: true,
    base: "/chat",
    endpoints: {
        getConversations: {
            method: "GET",
            path: "/conversations",
            handler: GetConversations,
        },
        getMessages: {
            method: "GET",
            path: "/messages/:conversationID",
            handler: GetMessages,
        },
        sendMessage: {
            method: "POST",
            path: "/messages",
            handler: SendMessage,
        },
    },
});
//# sourceMappingURL=encore.service.js.map