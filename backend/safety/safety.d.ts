interface TrustedContact {
    id: string;
    name: string;
    phone: string;
    verified: boolean;
}
interface AddTrustedContactParams {
    name: string;
    phone: string;
}
export declare function AddTrustedContact(params: AddTrustedContactParams): Promise<TrustedContact>;
export declare function GetTrustedContacts(): Promise<{
    contacts: TrustedContact[];
}>;
interface RemoveTrustedContactParams {
    id: string;
}
export declare function RemoveTrustedContact(params: RemoveTrustedContactParams): Promise<{
    success: boolean;
}>;
export {};
