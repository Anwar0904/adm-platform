import Link from "next/link";

import NavLogo from "./NavLogo";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">

            <div className="container mx-auto flex h-20 items-center justify-between px-6">

                <NavLogo />

                <DesktopMenu />

                <div className="flex items-center gap-4">

                    <Link
                        href="/consultation"
                        className="hidden rounded-xl bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700 lg:inline-flex"
                    >
                        Book Consultation
                    </Link>

                    <MobileMenu />

                </div>

            </div>

        </header>
    );
}