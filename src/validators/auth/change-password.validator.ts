import { z } from "zod";

export const ChangePasswordSchema =
  z.object({
    currentPassword: z.string(),

    newPassword: z
      .string()
      .min(8),
  });

export type ChangePasswordInput =
  z.infer<typeof ChangePasswordSchema>;