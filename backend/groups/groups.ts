
import { SQL } from "encore.dev/storage/sql";

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

export async function CreateGroup(params: CreateGroupParams): Promise<Group> {
  // In a real application, you would save this to the database.
  const group: Group = {
    id: Math.random().toString(36).substring(2, 15),
    name: params.name,
    description: params.description,
    members: [1], // Assuming the current user has an ID of 1
  };

  return group;
}

interface GetGroupParams {
  id: string;
}

export async function GetGroup(params: GetGroupParams): Promise<Group> {
  // In a real application, you would fetch this from the database.
  return {
    id: params.id,
    name: "Virtual Coffee Lovers",
    description: "A group for people who love virtual coffee dates.",
    members: [1, 2, 3],
  };
}

interface GetGroupMessagesParams {
  id: string;
}

export async function GetGroupMessages(params: GetGroupMessagesParams): Promise<{ messages: Message[] }> {
  // In a real application, you would fetch these from the database.
  return {
    messages: [
      {
        id: "1",
        text: "Hey everyone!",
        authorId: 1,
        timestamp: new Date().toISOString(),
      },
      {
        id: "2",
        text: "Welcome to the group!",
        authorId: 2,
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

interface SendMessageParams {
  id: string;
  text: string;
}

export async function SendMessage(params: SendMessageParams): Promise<Message> {
  // In a real application, you would save this to the database.
  const message: Message = {
    id: Math.random().toString(36).substring(2, 15),
    text: params.text,
    authorId: 1, // Assuming the current user has an ID of 1
    timestamp: new Date().toISOString(),
  };

  return message;
}
