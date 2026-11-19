export function isRoleSeedRouteDisabled(environment: string | undefined): boolean {
  return environment === "production";
}
