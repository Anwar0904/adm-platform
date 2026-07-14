export const PERMISSIONS = {
  BLOG_READ: "blog.read",
  BLOG_WRITE: "blog.write",
  BLOG_DELETE: "blog.delete",

  USER_READ: "user.read",
  USER_WRITE: "user.write",
  USER_DELETE: "user.delete",

  SERVICE_READ: "service.read",
  SERVICE_WRITE: "service.write",

  SETTINGS_MANAGE: "settings.manage",
} as const;

export const PermissionValues = Object.values(PERMISSIONS);