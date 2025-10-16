interface User {
    id: string;
    email: string;
    name: string | null;
    is_admin: boolean;
    is_active: boolean;
    created_at: string;
}
interface ListUsersResponse {
    users: User[];
    count: number;
}
export declare function listUsers(query: {
    limit: number;
    offset: number;
}): Promise<ListUsersResponse>;
interface UpdateUserParams {
    userID: string;
    isAdmin?: boolean;
    isActive?: boolean;
}
export declare function updateUser(params: UpdateUserParams): Promise<{
    success: boolean;
}>;
export declare function deleteUser({ userID }: {
    userID: string;
}): Promise<{
    success: boolean;
}>;
export {};
