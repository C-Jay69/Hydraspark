// In-memory store for the current check-in. In a real app, you'd use a database.
let currentCheckIn = null;
export async function StartCheckIn(params) {
    const endTime = new Date(new Date().getTime() + params.duration * 60000);
    currentCheckIn = {
        location: params.location,
        endTime: endTime.toISOString(),
    };
    return currentCheckIn;
}
export async function GetCheckIn() {
    return { checkIn: currentCheckIn };
}
export async function EndCheckIn() {
    currentCheckIn = null;
    return { success: true };
}
//# sourceMappingURL=check_in.js.map