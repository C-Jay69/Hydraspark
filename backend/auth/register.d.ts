export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender?: string;
    phone?: string;
}
export interface RegisterResponse {
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
}
export declare const register: (params: RegisterRequest) => Promise<RegisterResponse>;
