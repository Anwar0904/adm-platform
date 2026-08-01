import Link from "next/link";

export default function NavLogo() {
    return (
        <Link
            href="/"
            className="flex items-center gap-3"
        >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-lg">
                A
            </div>

            <div>
                <h2 className="font-bold text-xl">
                    ADM
                </h2>

                <p className="text-xs text-muted-foreground">
                    Arazi Digital Media
                </p>
            </div>
        </Link>
    );
}