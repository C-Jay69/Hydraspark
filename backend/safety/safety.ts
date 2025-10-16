
import { SQL } from "encore.dev/storage/sql";

interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  verified: boolean;
}

// In a real application, this would be a database table.
// We'll use an in-memory array for demonstration.
const trustedContacts: TrustedContact[] = [
  { id: "1", name: 'Mom', phone: '+1-555-0123', verified: true },
  { id: "2", name: 'Best Friend Sarah', phone: '+1-555-0456', verified: true }
];

interface AddTrustedContactParams {
  name: string;
  phone: string;
}

export async function AddTrustedContact(params: AddTrustedContactParams): Promise<TrustedContact> {
  const newContact: TrustedContact = {
    id: Math.random().toString(36).substring(2, 15),
    name: params.name,
    phone: params.phone,
    verified: false, // New contacts are not verified by default
  };
  trustedContacts.push(newContact);
  return newContact;
}

export async function GetTrustedContacts(): Promise<{ contacts: TrustedContact[] }> {
  // In a real app, you would fetch this from the database for the current user.
  return { contacts: trustedContacts };
}

interface RemoveTrustedContactParams {
  id: string;
}

export async function RemoveTrustedContact(params: RemoveTrustedContactParams): Promise<{ success: boolean }> {
  const index = trustedContacts.findIndex(c => c.id === params.id);
  if (index > -1) {
    trustedContacts.splice(index, 1);
    return { success: true };
  }
  return { success: false };
}
