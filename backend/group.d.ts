export interface Group {
    id: number;
    name: string;
    description: string;
    createdBy: string;
}
export interface GroupMember {
    groupId: number;
    userId: string;
}
export declare const listGroups: any;
export declare const createGroup: any;
export declare const joinGroup: any;
