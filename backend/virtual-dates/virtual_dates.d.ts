interface VirtualDate {
    id: string;
    participants: number[];
    scheduledTime: string;
    theme: string;
}
interface CreateVirtualDateParams {
    inviteeId: number;
    scheduledTime: string;
    theme: string;
}
export declare function CreateVirtualDate(params: CreateVirtualDateParams): Promise<VirtualDate>;
interface GetVirtualDateParams {
    id: string;
}
export declare function GetVirtualDate(params: GetVirtualDateParams): Promise<VirtualDate>;
export {};
