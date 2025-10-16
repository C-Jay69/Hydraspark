import { api, stream } from "encore.dev/api";
import { LLM, OpenAI } from "encore.dev/llm";
import { secret } from "encore.dev/config";
import { sql, srpc } from "encore.dev/storage/sql";
import { auth } from "encore.dev/auth";
const OPENAI_API_KEY = secret("OPENAI_API_KEY");
LLM.provider = new OpenAI({
    apiKey: OPENAI_API_KEY,
});
// SendMessage sends a message to a recipient.
export const sendMessage = api.POST("/chat/messages", async ({ recipientId, text }) => {
    const { id } = await auth.data();
    const senderId = id;
    await sql `
        INSERT INTO message (sender_id, recipient_id, text)
        VALUES (${senderId}, ${recipientId}, ${text})
    `;
});
// GetMessages retrieves the message history with a specific recipient.
export const getMessages = api.GET("/chat/messages/:recipientId", async ({ recipientId }) => {
    const { id } = await auth.data();
    const messages = await sql `
        SELECT id, created_at AS "createdAt", sender_id AS "senderId", recipient_id AS "recipientId", text
        FROM message
        WHERE (sender_id = ${id} AND recipient_id = ${recipientId}) OR (sender_id = ${recipientId} AND recipient_id = ${id})
        ORDER BY created_at ASC
    `;
    return { messages };
});
// MessageStream streams messages for a given recipient in real-time.
export const messageStream = api.GET("/chat/messages/:recipientId/stream", async function* ({ recipientId }) {
    const { id } = await auth.data();
    for await (const message of srpc `
        SELECT id, created_at AS "createdAt", sender_id AS "senderId", recipient_id AS "recipientId", text
        FROM message
        WHERE recipient_id = ${id} AND sender_id = ${recipientId}
    `) {
        yield stream.data(message);
    }
});
//# sourceMappingURL=chat.js.map