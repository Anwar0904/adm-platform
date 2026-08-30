import type { Metadata } from "next";
import "./globals.css";
import QueryClientProviderWrapper from "@/components/QueryClientProviderWrapper";

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
            <body className="app-shell">
                <QueryClientProviderWrapper>
                    {children}
                </QueryClientProviderWrapper>
            </body>
        </html>
    );
}