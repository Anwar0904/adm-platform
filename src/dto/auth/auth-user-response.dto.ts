type RoleProjection = { _id?: unknown; id?: unknown; name?: unknown } | string | null;

export function toAuthUserResponse(user: {
  _id: { toString(): string };
  firstName?: string;
  lastName?: string;
  email: string;
  avatar?: unknown;
  jobTitle?: string | null;
  status?: string;
  role?: RoleProjection;
}) {
  const role = user.role;
  const roleName = typeof role === "object" && role !== null && typeof role.name === "string"
    ? role.name
    : typeof role === "string" ? role : null;

  return {
    _id: user._id.toString(),
    name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    email: user.email,
    avatar: user.avatar ?? null,
    jobTitle: user.jobTitle ?? null,
    status: user.status ?? null,
    role: roleName ? { name: roleName } : null,
  };
}
