interface Conversation {
    id: string;
    name: string;
    lastMessage: string;
    avatar: string;
}
interface Message {
    id: string;
    text: string;
    sender: string;
    timestamp: string;
    conversationID: string;
}
export declare function GetConversations(): Promise<{
    conversations: Conversation[];
}>;
interface GetMessagesParams {
    conversationID: string;
}
export declare function GetMessages(params: GetMessagesParams): Promise<{
    messages: Message[];
}>;
interface SendMessageParams {
    conversationID: string;
    text: string;
}
export declare const NewMessages: any;
export declare function SendMessage(params: SendMessageParams): Promise<Message>;
export {};
