import type { Metadata } from "next";
import AuthRequestLinkForm from "@/components/auth/AuthRequestLinkForm";

export const metadata: Metadata = { title: "Reset your password | ADM", robots: { index: false, follow: false } };

export default function ForgotPasswordPage() {
  return <AuthRequestLinkForm kind="password-reset" />;
}
