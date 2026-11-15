export const AUTH_MESSAGES = {
  INVALID_CREDENTIALS: "Invalid email or password.",

  ACCOUNT_DISABLED:
    "Your account has been disabled.",

  LOGIN_SUCCESS:
    "Login successful.",

  REGISTER_SUCCESS:
    "Registration successful.",

  UNAUTHORIZED:
    "Unauthorized.",

  FORBIDDEN:
    "Forbidden.",

  TOKEN_EXPIRED:
    "Token has expired.",

  INVALID_TOKEN:
    "Invalid token.",
} as const;

export const SESSION_IDLE_TIMEOUT_SECONDS =
  7 * 24 * 60 * 60;

export const SESSION_ACTIVITY_SYNC_INTERVAL_MS =
  5 * 60 * 1000;

export const SESSION_ACTIVITY_DEBOUNCE_MS = 1000;