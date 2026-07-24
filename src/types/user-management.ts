export interface CreateUserInput {
    name: string;
    email: string;
    password: string;
    role: string;
}

export interface UpdateUserInput {
    name?: string;
    email?: string;
    role?: string;
    status?: string;
}

export interface UserQuery {
    page?: number;
    limit?: number;

    search?: string;

    status?: string;

    role?: string;

    sort?: string;
}