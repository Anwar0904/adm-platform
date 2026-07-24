export const PERMISSIONS = {
  BLOG_READ: "blog.read",
  BLOG_WRITE: "blog.write",
  BLOG_UPDATE: "blog.update",
  BLOG_DELETE: "blog.delete",

  USER_READ: "user.read",
  USER_WRITE: "user.write",
  USER_UPDATE: 'user.update',
  USER_DELETE: "user.delete",

  ROLE_READ: "role.read",
  ROLE_WRITE: "role.write",
  ROLE_UPDATE: "role.update",
  ROLE_DELETE: "role.delete",

  SERVICE_READ: "service.read",
  SERVICE_CREATE: 'service.create',
  SERVICE_UPDATE: "service.update",
  SERVICE_DELETE: "service.delete",

  SETTINGS_MANAGE: "settings.manage",
} as const;

export const PermissionValues = Object.values(PERMISSIONS);