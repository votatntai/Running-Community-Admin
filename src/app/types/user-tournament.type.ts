import { User } from "./user.type";

export interface UserTournament {
    id: string,
    user: User,
    createAt: string,
    status: string
}