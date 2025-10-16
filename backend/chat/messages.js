import { api, APIError } from "encore.dev/api";
import { chatDB } from "./db";
import { matchingDB } from "../matching/db";
// Sends a message in a match.
export const sendMessage = api({ expose: true, method: "POST", path: "/chat/messages" }, async (req) => {
    // Verify the match exists and user is part of it
    const match = await matchingDB.queryRow `
      SELECT user1_id, user2_id, is_active
      FROM matches
      WHERE id = ${req.matchId}
    `;
    if (!match) {
        throw APIError.notFound("Match not found");
    }
    if (!match.is_active) {
        throw APIError.failedPrecondition("Match is not active");
    }
    if (match.user1_id !== req.senderId && match.user2_id !== req.senderId) {
        throw APIError.permissionDenied("Not authorized to send messages in this match");
    }
    // Send the message
    const message = await chatDB.queryRow `
      INSERT INTO chat_messages (match_id, sender_id, message_text, message_type)
      VALUES (${req.matchId}, ${req.senderId}, ${req.messageText}, ${req.messageType || 'text'})
      RETURNING id, sender_id, message_text, message_type, is_read, created_at
    `;
    if (!message) {
        throw APIError.internal("Failed to send message");
    }
    // Update match last message time
    await matchingDB.exec `
      UPDATE matches 
      SET last_message_at = CURRENT_TIMESTAMP
      WHERE id = ${req.matchId}
    `;
    return {
        id: message.id,
        senderId: message.sender_id,
        messageText: message.message_text,
        messageType: message.message_type,
        isRead: message.is_read,
        createdAt: message.created_at,
    };
});
// Gets messages for a match.
export const getMessages = api({ expose: true, method: "GET", path: "/chat/messages/:matchId/:userId" }, async ({ matchId, userId, limit = 50, offset = 0 }) => {
    // Verify user is part of the match
    const match = await matchingDB.queryRow `
      SELECT user1_id, user2_id
      FROM matches
      WHERE id = ${matchId}
    `;
    if (!match) {
        throw APIError.notFound("Match not found");
    }
    if (match.user1_id !== userId && match.user2_id !== userId) {
        throw APIError.permissionDenied("Not authorized to view messages in this match");
    }
    const messages = await chatDB.queryAll `
      SELECT id, sender_id, message_text, message_type, is_read, created_at
      FROM chat_messages
      WHERE match_id = ${matchId}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    // Mark messages as read
    await chatDB.exec `
      UPDATE chat_messages 
      SET is_read = true
      WHERE match_id = ${matchId} AND sender_id != ${userId}
    `;
    return {
        messages: messages.map(m => ({
            id: m.id,
            senderId: m.sender_id,
            messageText: m.message_text,
            messageType: m.message_type,
            isRead: m.is_read,
            createdAt: m.created_at,
        })).reverse(), // Return in chronological order
    };
});
// Gets available icebreakers.
export const getIcebreakers = api({ expose: true, method: "GET", path: "/chat/icebreakers" }, async () => {
    const icebreakers = await chatDB.queryAll `
      SELECT id, title, description, category, prompts
      FROM icebreakers
      WHERE is_active = true
      ORDER BY category, title
    `;
    return { icebreakers };
});
// Sends an icebreaker message.
export const sendIcebreaker = api({ expose: true, method: "POST", path: "/chat/icebreaker" }, async ({ matchId, senderId, icebreakerId, selectedPrompt }) => {
    // Get icebreaker details
    const icebreaker = await chatDB.queryRow `
      SELECT title, category
      FROM icebreakers
      WHERE id = ${icebreakerId} AND is_active = true
    `;
    if (!icebreaker) {
        throw APIError.notFound("Icebreaker not found");
    }
    // Send as special icebreaker message
    const message = `🎯 ${icebreaker.title}\n\n${selectedPrompt}`;
    return sendMessage({
        matchId,
        senderId,
        messageText: message,
        messageType: 'icebreaker',
    });
});
//# sourceMappingURL=messages.js.map