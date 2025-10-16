
import { SQL } from "encore.dev/storage/sql";

interface WouldYouRatherQuestion {
  optionA: string;
  optionB: string;
}

export async function GetWouldYouRather(): Promise<{ question: WouldYouRatherQuestion }> {
  // In a real application, you would fetch these questions from a database.
  const questions: WouldYouRatherQuestion[] = [
    { optionA: "be able to fly", optionB: "be able to turn invisible" },
    { optionA: "have more time", optionB: "have more money" },
    { optionA: "live in the city", optionB: "live in the country" },
  ];

  const randomIndex = Math.floor(Math.random() * questions.length);
  return { question: questions[randomIndex] };
}
