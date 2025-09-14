import { api, APIError } from "encore.dev/api";
import { safetyDB } from "./db";

export interface CreateCheckInRequest {
  userId: string;
  locationName: string;
  locationLat: number;
  locationLng: number;
  plannedEndTime: string;
  notes?: string;
  companionInfo?: string;
}

export interface CheckIn {
  id: number;
  locationName: string;
  locationLat: number;
  locationLng: number;
  plannedEndTime: Date;
  actualEndTime?: Date;
  status: string;
  notes?: string;
  companionInfo?: string;
  createdAt: Date;
}

// Creates a new safety check-in.
export const createCheckIn = api<CreateCheckInRequest, CheckIn>(
  { expose: true, method: "POST", path: "/safety/check-in" },
  async (req) => {
    const plannedEnd = new Date(req.plannedEndTime);
    
    // Validate that planned end time is in the future
    if (plannedEnd <= new Date()) {
      throw APIError.invalidArgument("Planned end time must be in the future");
    }

    const checkIn = await safetyDB.queryRow<{
      id: number;
      location_name: string;
      location_lat: number;
      location_lng: number;
      planned_end_time: Date;
      actual_end_time: Date;
      status: string;
      notes: string;
      companion_info: string;
      created_at: Date;
    }>`
      INSERT INTO check_ins (user_id, location_name, location_lat, location_lng, planned_end_time, notes, companion_info)
      VALUES (${req.userId}, ${req.locationName}, ${req.locationLat}, ${req.locationLng}, ${req.plannedEndTime}, ${req.notes}, ${req.companionInfo})
      RETURNING id, location_name, location_lat, location_lng, planned_end_time, actual_end_time, status, notes, companion_info, created_at
    `;

    if (!checkIn) {
      throw APIError.internal("Failed to create check-in");
    }

    // Award safety points
    await recordSafetyAction(req.userId, "check_in_create", 5);

    return {
      id: checkIn.id,
      locationName: checkIn.location_name,
      locationLat: checkIn.location_lat,
      locationLng: checkIn.location_lng,
      plannedEndTime: checkIn.planned_end_time,
      actualEndTime: checkIn.actual_end_time,
      status: checkIn.status,
      notes: checkIn.notes,
      companionInfo: checkIn.companion_info,
      createdAt: checkIn.created_at,
    };
  }
);

// Completes a check-in.
export const completeCheckIn = api<{ userId: string; checkInId: number }, CheckIn>(
  { expose: true, method: "PUT", path: "/safety/check-in/:userId/:checkInId/complete" },
  async ({ userId, checkInId }) => {
    const checkIn = await safetyDB.queryRow<{
      id: number;
      location_name: string;
      location_lat: number;
      location_lng: number;
      planned_end_time: Date;
      actual_end_time: Date;
      status: string;
      notes: string;
      companion_info: string;
      created_at: Date;
    }>`
      UPDATE check_ins 
      SET actual_end_time = CURRENT_TIMESTAMP, status = 'completed', updated_at = CURRENT_TIMESTAMP
      WHERE id = ${checkInId} AND user_id = ${userId} AND status = 'active'
      RETURNING id, location_name, location_lat, location_lng, planned_end_time, actual_end_time, status, notes, companion_info, created_at
    `;

    if (!checkIn) {
      throw APIError.notFound("Active check-in not found");
    }

    // Award bonus points for completing on time
    const wasOnTime = new Date() <= new Date(checkIn.planned_end_time);
    await recordSafetyAction(userId, "check_in_complete", wasOnTime ? 5 : 2);

    return {
      id: checkIn.id,
      locationName: checkIn.location_name,
      locationLat: checkIn.location_lat,
      locationLng: checkIn.location_lng,
      plannedEndTime: checkIn.planned_end_time,
      actualEndTime: checkIn.actual_end_time,
      status: checkIn.status,
      notes: checkIn.notes,
      companionInfo: checkIn.companion_info,
      createdAt: checkIn.created_at,
    };
  }
);

// Gets user's check-ins.
export const getCheckIns = api<{ userId: string }, { checkIns: CheckIn[] }>(
  { expose: true, method: "GET", path: "/safety/check-ins/:userId" },
  async ({ userId }) => {
    const checkIns = await safetyDB.queryAll<{
      id: number;
      location_name: string;
      location_lat: number;
      location_lng: number;
      planned_end_time: Date;
      actual_end_time: Date;
      status: string;
      notes: string;
      companion_info: string;
      created_at: Date;
    }>`
      SELECT id, location_name, location_lat, location_lng, planned_end_time, 
             actual_end_time, status, notes, companion_info, created_at
      FROM check_ins
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 20
    `;

    return {
      checkIns: checkIns.map(c => ({
        id: c.id,
        locationName: c.location_name,
        locationLat: c.location_lat,
        locationLng: c.location_lng,
        plannedEndTime: c.planned_end_time,
        actualEndTime: c.actual_end_time,
        status: c.status,
        notes: c.notes,
        companionInfo: c.companion_info,
        createdAt: c.created_at,
      })),
    };
  }
);

async function recordSafetyAction(userId: string, actionType: string, points: number) {
  await safetyDB.exec`
    INSERT INTO safety_actions (user_id, action_type, points_earned)
    VALUES (${userId}, ${actionType}, ${points})
  `;

  // Update user's safety score - import authDB
  const { authDB } = await import("../auth/db");
  await authDB.exec`
    UPDATE users 
    SET safety_score = safety_score + ${points}
    WHERE id = ${userId}
  `;
}
