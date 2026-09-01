import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import QueryClientProviderWrapper from "@/components/QueryClientProviderWrapper";

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: {
        default: "ADM",
        template: "%s | ADM",
    },

    description:
        "Arazi Digital Media",

    icons: {
        icon: "/favicon.ico",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            data-scroll-behavior="smooth"
        >
            <body className="app-shell">
                <QueryClientProviderWrapper>
                    {children}
                </QueryClientProviderWrapper>
                <Analytics />
            </body>
        </html>
    );
}