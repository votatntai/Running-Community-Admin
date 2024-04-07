import { GroupMember } from "./group-member.type";

export interface Group {
    id: string,
    name: string,
    description?: string,
    rule: string,
    thumbnailUrl?: string,
    groupMembers: GroupMember[],
    createAt: string,
}