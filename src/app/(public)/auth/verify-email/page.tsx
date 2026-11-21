import type { Metadata } from "next";
import AuthEmailActions from "@/components/auth/AuthEmailActions";

export const metadata: Metadata = {
  title: "Verify Email | Arazi Digital Media",
  robots: { index: false, follow: false },
};

export default function VerifyEmailPage() {
  return <AuthEmailActions flow="verify" />;
}
