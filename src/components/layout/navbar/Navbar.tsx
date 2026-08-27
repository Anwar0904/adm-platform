import Link from "next/link";

import NavLogo from "./NavLogo";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
            <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:h-18 sm:px-6 lg:h-20 lg:px-8">
                {/* Logo */}
                <div className="shrink-0">
                    <NavLogo />
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex lg:flex-1 lg:justify-center">
                    <DesktopMenu />
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                    <Link
                        href="/consultation"
                        className="hidden rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 lg:inline-flex xl:px-5 xl:py-3"
                    >
                        Book Consultation
                    </Link>

                    {/* Mobile / Tablet Menu */}
                    <MobileMenu />
                </div>
            </div>
        </header>
    );
}