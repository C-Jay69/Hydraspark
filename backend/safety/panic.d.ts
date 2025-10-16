export interface TriggerPanicRequest {
    userId: string;
    locationLat?: number;
    locationLng?: number;
    notes?: string;
}
export interface PanicAlert {
    id: number;
    alertType: string;
    status: string;
    locationLat?: number;
    locationLng?: number;
    notes?: string;
    notifiedContacts: string[];
    createdAt: Date;
}
export declare const triggerPanic: (params: TriggerPanicRequest) => Promise<PanicAlert>;
export declare const resolvePanic: (params: {
    userId: string;
    alertId: number;
    status: "resolved" | "false_alarm";
}) => Promise<void>;
export declare const getPanicAlerts: (params: {
    userId: string;
}) => Promise<{
    alerts: PanicAlert[];
}>;
