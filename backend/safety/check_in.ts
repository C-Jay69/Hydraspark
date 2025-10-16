
import { api } from "encore.dev/api";

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

export const createCheckIn = api<StartCheckInParams, CheckIn>(
    {
        method: "POST",
        path: "/safety/check-in",
    },
    async (params) => {
        const endTime = new Date(new Date().getTime() + params.duration * 60000);
        currentCheckIn = {
            location: params.location,
            endTime: endTime.toISOString(),
        };
        return currentCheckIn;
    }
);

export const getCheckIns = api<{}, { checkIn: CheckIn | null }>(
    {
        method: "GET",
        path: "/safety/check-in",
    },
    async () => {
        return { checkIn: currentCheckIn };
    }
);

export const completeCheckIn = api<{}, { success: boolean }>(
    {
        method: "DELETE",
        path: "/safety/check-in",
    },
    async () => {
        currentCheckIn = null;
        return { success: true };
    }
);

export async function GetCheckIn(): Promise<{ checkIn: CheckIn | null }> {
  return { checkIn: currentCheckIn };
}
