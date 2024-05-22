export interface User {
    id: string,
    phone: string,
    name: string,
    avatarUrl?: string,
    address?: string,
    longitude: number,
    latitude: number,
    status: string,
    createAt: string,
}