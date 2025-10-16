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
export declare const addTrustedContact: (params: AddTrustedContactRequest) => Promise<TrustedContact>;
export declare const getTrustedContacts: (params: {
    userId: string;
}) => Promise<{
    contacts: TrustedContact[];
}>;
export declare const removeTrustedContact: (params: {
    userId: string;
    contactId: number;
}) => Promise<void>;
