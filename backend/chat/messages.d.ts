export interface SendMessageRequest {
    matchId: number;
    senderId: string;
    messageText: string;
    messageType?: string;
}
export interface ChatMessage {
    id: number;
    senderId: string;
    messageText: string;
    messageType: string;
    isRead: boolean;
    createdAt: Date;
}
export declare const sendMessage: (params: SendMessageRequest) => Promise<ChatMessage>;
export declare const getMessages: (params: {
    matchId: number;
    userId: string;
    limit?: number;
    offset?: number;
}) => Promise<{
    messages: ChatMessage[];
}>;
export declare const getIcebreakers: () => Promise<{
    icebreakers: Array<{
        id: number;
        title: string;
        description: string;
        category: string;
        prompts: string[];
    }>;
}>;
export declare const sendIcebreaker: (params: {
    matchId: number;
    senderId: string;
    icebreakerId: number;
    selectedPrompt: string;
}) => Promise<ChatMessage>;
