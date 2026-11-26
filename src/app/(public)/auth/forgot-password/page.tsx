import type { Metadata } from "next";
import ForgotPasswordPage from "@/components/auth/ForgotPasswordPage";

export const metadata: Metadata = { title: "Reset your password | ADM", robots: { index: false, follow: false } };

export default function Page() {
  return <ForgotPasswordPage />;
}
