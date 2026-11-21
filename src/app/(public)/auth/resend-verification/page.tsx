import type { Metadata } from "next";
import AuthRequestLinkForm from "@/components/auth/AuthRequestLinkForm";

export const metadata: Metadata = { title: "Verify your email | ADM", robots: { index: false, follow: false } };

export default function ResendVerificationPage() {
  return <AuthRequestLinkForm kind="email-verification" />;
}
