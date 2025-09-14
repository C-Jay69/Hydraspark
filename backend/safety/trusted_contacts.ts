import { api, APIError } from "encore.dev/api";
import { safetyDB } from "./db";
import { authDB } from "../auth/db";

export interface AddTrustedContactRequest {
  userId: string;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  relationship?: string;
  isPrimary?: boolean;
}

export interface TrustedContact {
  id: number;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  relationship?: string;
  isPrimary: boolean;
  createdAt: Date;
}

// Adds a trusted contact for the user.
export const addTrustedContact = api<AddTrustedContactRequest, TrustedContact>(
  { expose: true, method: "POST", path: "/safety/trusted-contacts" },
  async (req) => {
    // Limit to 3 trusted contacts
    const existingCount = await safetyDB.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM trusted_contacts WHERE user_id = ${req.userId}
    `;

    if (existingCount && existingCount.count >= 3) {
      throw APIError.failedPrecondition("Maximum of 3 trusted contacts allowed");
    }

    // If setting as primary, unset other primary contacts
    if (req.isPrimary) {
      await safetyDB.exec`
        UPDATE trusted_contacts SET is_primary = false WHERE user_id = ${req.userId}
      `;
    }

    const contact = await safetyDB.queryRow<{
      id: number;
      contact_name: string;
      contact_phone: string;
      contact_email: string;
      relationship: string;
      is_primary: boolean;
      created_at: Date;
    }>`
      INSERT INTO trusted_contacts (user_id, contact_name, contact_phone, contact_email, relationship, is_primary)
      VALUES (${req.userId}, ${req.contactName}, ${req.contactPhone}, ${req.contactEmail}, ${req.relationship}, ${req.isPrimary || false})
      RETURNING id, contact_name, contact_phone, contact_email, relationship, is_primary, created_at
    `;

    if (!contact) {
      throw APIError.internal("Failed to create trusted contact");
    }

    // Award safety points
    await recordSafetyAction(req.userId, "trusted_contact_add", 10);

    return {
      id: contact.id,
      contactName: contact.contact_name,
      contactPhone: contact.contact_phone,
      contactEmail: contact.contact_email,
      relationship: contact.relationship,
      isPrimary: contact.is_primary,
      createdAt: contact.created_at,
    };
  }
);

// Gets user's trusted contacts.
export const getTrustedContacts = api<{ userId: string }, { contacts: TrustedContact[] }>(
  { expose: true, method: "GET", path: "/safety/trusted-contacts/:userId" },
  async ({ userId }) => {
    const contacts = await safetyDB.queryAll<{
      id: number;
      contact_name: string;
      contact_phone: string;
      contact_email: string;
      relationship: string;
      is_primary: boolean;
      created_at: Date;
    }>`
      SELECT id, contact_name, contact_phone, contact_email, relationship, is_primary, created_at
      FROM trusted_contacts
      WHERE user_id = ${userId}
      ORDER BY is_primary DESC, created_at ASC
    `;

    return {
      contacts: contacts.map(c => ({
        id: c.id,
        contactName: c.contact_name,
        contactPhone: c.contact_phone,
        contactEmail: c.contact_email,
        relationship: c.relationship,
        isPrimary: c.is_primary,
        createdAt: c.created_at,
      })),
    };
  }
);

// Removes a trusted contact.
export const removeTrustedContact = api<{ userId: string; contactId: number }, void>(
  { expose: true, method: "DELETE", path: "/safety/trusted-contacts/:userId/:contactId" },
  async ({ userId, contactId }) => {
    const result = await safetyDB.queryRow<{ contact_name: string }>`
      DELETE FROM trusted_contacts 
      WHERE id = ${contactId} AND user_id = ${userId}
      RETURNING contact_name
    `;

    if (!result) {
      throw APIError.notFound("Trusted contact not found");
    }
  }
);

async function recordSafetyAction(userId: string, actionType: string, points: number) {
  await safetyDB.exec`
    INSERT INTO safety_actions (user_id, action_type, points_earned)
    VALUES (${userId}, ${actionType}, ${points})
  `;

  // Update user's safety score
  await authDB.exec`
    UPDATE users 
    SET safety_score = safety_score + ${points}
    WHERE id = ${userId}
  `;
}
