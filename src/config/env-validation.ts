export function resolveMongoDbName(
  configuredValue: string | undefined,
  nodeEnv: string | undefined,
) {
  const value = configuredValue?.trim();
  if (value) return value;
  if (nodeEnv === "production") {
    throw new Error("Missing required environment variable: MONGODB_DB");
  }
  return "adm-website";
}
