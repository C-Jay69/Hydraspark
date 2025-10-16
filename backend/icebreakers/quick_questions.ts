
import { SQL } from "encore.dev/storage/sql";

interface QuickQuestion {
  question: string;
}

export async function GetQuickQuestion(): Promise<{ question: QuickQuestion }> {
  // In a real application, you would fetch these questions from a database.
  const questions: QuickQuestion[] = [
    { question: "What's your favorite book?" },
    { question: "What's the best concert you've ever been to?" },
    { question: "What's your go-to karaoke song?" },
  ];

  const randomIndex = Math.floor(Math.random() * questions.length);
  return { question: questions[randomIndex] };
}
