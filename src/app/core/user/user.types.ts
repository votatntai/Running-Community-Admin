export interface User {
    id: string,
    name: string,
    phone: string,
    address: string,
    longitude?: number,
    latitude?: number,
    avatarUrl?: string,
    status: string,
    createAt: string
}
