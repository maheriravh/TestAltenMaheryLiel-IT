
export interface User {
    id_user: number,
    login: string,
    password: string,
    role_user: string
}

export interface UserError {
    login?: string,
    password?: string
}

export interface ResponseListUser {
    success: boolean,
    message: string,
    result: User[]
}

export const defaultUser: User = {
    id_user: 0,
    login: "",
    password: "",
    role_user: "",
}