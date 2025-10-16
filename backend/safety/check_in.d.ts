interface CheckIn {
    location: string;
    endTime: string;
}
interface StartCheckInParams {
    location: string;
    duration: number;
}
export declare function StartCheckIn(params: StartCheckInParams): Promise<CheckIn>;
export declare function GetCheckIn(): Promise<{
    checkIn: CheckIn | null;
}>;
export declare function EndCheckIn(): Promise<{
    success: boolean;
}>;
export {};
