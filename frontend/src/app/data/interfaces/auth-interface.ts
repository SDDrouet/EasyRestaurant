import { User } from "./user-interface";

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginData {
    accessToken: string;    
    tokenType: string;
}

export interface JwtPayload {
    typ: string;
    sub: string;
    iat: number;
    exp: number;
}

export interface AuthMe {
    user: User;
    permissions: string[];
}