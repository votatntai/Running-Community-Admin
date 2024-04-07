import { User } from "app/core/user/user.types";

export interface GroupMember {
    id: string,
    user: User,
    role: string,
    status: string,
    createAt: string,
}