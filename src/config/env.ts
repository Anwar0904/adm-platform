export const env = {
  MONGODB_URI: process.env.MONGODB_URI!,

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,

  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,

  JWT_ACCESS_EXPIRES:
    process.env.JWT_ACCESS_EXPIRES!,

  JWT_REFRESH_EXPIRES:
    process.env.JWT_REFRESH_EXPIRES!,

  BCRYPT_SALT_ROUNDS:
    Number(process.env.BCRYPT_SALT_ROUNDS),
};