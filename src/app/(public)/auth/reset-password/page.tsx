import type { Metadata } from "next";
import AuthEmailActions from "@/components/auth/AuthEmailActions";

export const metadata: Metadata = {
  title: "Reset Password | Arazi Digital Media",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return <AuthEmailActions flow="reset" />;
}
