const MONGODB_URL =process.env.MONGODB_URL;
if(!MONGODB_URL){
    throw new Error(
        "MONGODB_URL is missing. Please add it to your .env.local file"
    );
}

export const env={
    MONGODB_URL,
    NODE_ENV:process.env.NODE_ENV ?? "development"
} as const;