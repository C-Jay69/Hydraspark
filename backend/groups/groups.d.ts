interface Group {
    id: string;
    name: string;
    description: string;
    members: number[];
}
interface Message {
    id: string;
    text: string;
    authorId: number;
    timestamp: string;
}
interface CreateGroupParams {
    name: string;
    description: string;
}
export declare function CreateGroup(params: CreateGroupParams): Promise<Group>;
interface GetGroupParams {
    id: string;
}
export declare function GetGroup(params: GetGroupParams): Promise<Group>;
interface GetGroupMessagesParams {
    id: string;
}
export declare function GetGroupMessages(params: GetGroupMessagesParams): Promise<{
    messages: Message[];
}>;
interface SendMessageParams {
    id: string;
    text: string;
}
export declare function SendMessage(params: SendMessageParams): Promise<Message>;
export {};
