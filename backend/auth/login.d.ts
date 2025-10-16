interface LoginRequest {
    email: string;
    password: string;
}
interface LoginResponse {
    token: string;
}
export declare const login: (params: LoginRequest) => Promise<LoginResponse>;
export {};
