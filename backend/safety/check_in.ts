
import { SQL } from "encore.dev/storage/sql";

// Represents a user's check-in status
interface CheckIn {
  location: string;
  endTime: string; // ISO 8601 format
}

// In-memory store for the current check-in. In a real app, you'd use a database.
let currentCheckIn: CheckIn | null = null;

interface StartCheckInParams {
  location: string;
  duration: number; // in minutes
}

export async function StartCheckIn(params: StartCheckInParams): Promise<CheckIn> {
  const endTime = new Date(new Date().getTime() + params.duration * 60000);
  currentCheckIn = {
    location: params.location,
    endTime: endTime.toISOString(),
  };
  return currentCheckIn;
}

export async function GetCheckIn(): Promise<{ checkIn: CheckIn | null }> {
  return { checkIn: currentCheckIn };
}

export async function EndCheckIn(): Promise<{ success: boolean }> {
  currentCheckIn = null;
  return { success: true };
}
