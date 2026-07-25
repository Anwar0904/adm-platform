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

  MEDIA_READ: "media.read",
  MEDIA_CREATE: "media.create",
  MEDIA_UPDATE: "media.update",
  MEDIA_DELETE: "media.delete",

  CATEGORY_READ: "category.read",
  CATEGORY_WRITE: "category.write",
  CATEGORY_UPDATE: "category.update",
  CATEGORY_DELETE: "category.delete",

  SETTINGS_MANAGE: "settings.manage",
} as const;

export const PermissionValues = Object.values(PERMISSIONS);