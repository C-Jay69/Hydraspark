import { topic } from "encore.dev/pubsub";
const conversations = [
    { id: 'conv1', name: 'Emily', lastMessage: 'See you then!', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    { id: 'conv2', name: 'John', lastMessage: 'Sounds good!', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d' },
];
const messages = {
    conv1: [
        { id: 'msg1', text: 'Hey, are we still on for tonight?', sender: 'Emily', timestamp: '5:30 PM', conversationID: 'conv1' },
        { id: 'msg2', text: 'Yep! See you at 7.', sender: 'You', timestamp: '5:31 PM', conversationID: 'conv1' },
        { id: 'msg3', text: 'See you then!', sender: 'Emily', timestamp: '5:32 PM', conversationID: 'conv1' },
    ],
    conv2: [
        { id: 'msg4', text: 'Let\'s catch up tomorrow.', sender: 'John', timestamp: 'Yesterday', conversationID: 'conv2' },
        { id: 'msg5', text: 'Sounds good!', sender: 'You', timestamp: 'Yesterday', conversationID: 'conv2' },
    ],
};
export async function GetConversations() {
    return { conversations };
}
export async function GetMessages(params) {
    return { messages: messages[params.conversationID] || [] };
}
// Define a topic for real-time messages for each conversation
export const NewMessages = topic('new-messages', {
    delivery: 'at-least-once',
});
export async function SendMessage(params) {
    const newMessage = {
        id: `msg${Date.now()}`,
        text: params.text,
        sender: 'You', // In a real app, this would be the authenticated user
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        conversationID: params.conversationID,
    };
    if (messages[params.conversationID]) {
        messages[params.conversationID].push(newMessage);
    }
    else {
        messages[params.conversationID] = [newMessage];
    }
    // Publish the new message to the topic
    await NewMessages.publish(newMessage, { topic: params.conversationID });
    return newMessage;
}
//# sourceMappingURL=chat.js.map