import type { Metadata } from "next";
import "./globals.css";
import QueryClientProviderWrapper from "@/components/QueryClientProviderWrapper";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
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
        >
            <body>
                <QueryClientProviderWrapper>
                    {children}
                </QueryClientProviderWrapper>
                <Analytics />
            </body>
        </html>
    );
}