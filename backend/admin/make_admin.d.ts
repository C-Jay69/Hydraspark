interface MakeAdminRequest {
    email: string;
}
export declare const makeAdmin: (params: MakeAdminRequest) => Promise<{
    status: string;
}>;
export {};
