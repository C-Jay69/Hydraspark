// In a real application, this would be a database table.
// We'll use an in-memory array for demonstration.
const trustedContacts = [
    { id: "1", name: 'Mom', phone: '+1-555-0123', verified: true },
    { id: "2", name: 'Best Friend Sarah', phone: '+1-555-0456', verified: true }
];
export async function AddTrustedContact(params) {
    const newContact = {
        id: Math.random().toString(36).substring(2, 15),
        name: params.name,
        phone: params.phone,
        verified: false, // New contacts are not verified by default
    };
    trustedContacts.push(newContact);
    return newContact;
}
export async function GetTrustedContacts() {
    // In a real app, you would fetch this from the database for the current user.
    return { contacts: trustedContacts };
}
export async function RemoveTrustedContact(params) {
    const index = trustedContacts.findIndex(c => c.id === params.id);
    if (index > -1) {
        trustedContacts.splice(index, 1);
        return { success: true };
    }
    return { success: false };
}
//# sourceMappingURL=safety.js.map