import type { Metadata } from "next";
import ResetPasswordPage from "@/components/auth/ResetPasswordPage";

export const metadata: Metadata = { title: "Reset Password | Arazi Digital Media", robots: { index: false, follow: false } };

export default function Page() {
  return <ResetPasswordPage />;
}
