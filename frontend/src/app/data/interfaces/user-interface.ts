export interface User {
        id: number;
        username: string;
        email: string;
        firstName: string;
        lastName: string;
        isActive: boolean;
}

export interface RegisterUser {
        username: string;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
}