import { api, APIError } from "encore.dev/api";
import { safetyDB } from "./db";
// Triggers a panic alert and notifies trusted contacts.
export const triggerPanic = api({ expose: true, method: "POST", path: "/safety/panic" }, async (req) => {
    // Get user's trusted contacts
    const contacts = await safetyDB.queryAll `
      SELECT id, contact_name, contact_phone, contact_email
      FROM trusted_contacts
      WHERE user_id = ${req.userId}
      ORDER BY is_primary DESC
    `;
    // Create panic alert
    const alert = await safetyDB.queryRow `
      INSERT INTO panic_alerts (user_id, location_lat, location_lng, notes, notified_contacts)
      VALUES (${req.userId}, ${req.locationLat}, ${req.locationLng}, ${req.notes}, ${JSON.stringify(contacts.map(c => c.id.toString()))})
      RETURNING id, alert_type, status, location_lat, location_lng, notes, notified_contacts, created_at
    `;
    if (!alert) {
        throw APIError.internal("Failed to create panic alert");
    }
    // TODO: In a real implementation, you would integrate with SMS/email services
    // to actually notify the trusted contacts. For now, we'll just log it.
    console.log(`PANIC ALERT: User ${req.userId} triggered panic alert ${alert.id}`);
    console.log(`Notifying contacts:`, contacts);
    return {
        id: alert.id,
        alertType: alert.alert_type,
        status: alert.status,
        locationLat: alert.location_lat,
        locationLng: alert.location_lng,
        notes: alert.notes,
        notifiedContacts: alert.notified_contacts,
        createdAt: alert.created_at,
    };
});
// Resolves a panic alert.
export const resolvePanic = api({ expose: true, method: "PUT", path: "/safety/panic/:userId/:alertId/resolve" }, async ({ userId, alertId, status }) => {
    const result = await safetyDB.queryRow `
      UPDATE panic_alerts 
      SET status = ${status}, resolved_at = CURRENT_TIMESTAMP
      WHERE id = ${alertId} AND user_id = ${userId} AND status = 'active'
      RETURNING id
    `;
    if (!result) {
        throw APIError.notFound("Active panic alert not found");
    }
});
// Gets user's panic alerts.
export const getPanicAlerts = api({ expose: true, method: "GET", path: "/safety/panic-alerts/:userId" }, async ({ userId }) => {
    const alerts = await safetyDB.queryAll `
      SELECT id, alert_type, status, location_lat, location_lng, notes, notified_contacts, created_at
      FROM panic_alerts
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 10
    `;
    return {
        alerts: alerts.map(a => ({
            id: a.id,
            alertType: a.alert_type,
            status: a.status,
            locationLat: a.location_lat,
            locationLng: a.location_lng,
            notes: a.notes,
            notifiedContacts: a.notified_contacts,
            createdAt: a.created_at,
        })),
    };
});
//# sourceMappingURL=panic.js.map