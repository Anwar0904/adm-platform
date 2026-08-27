import Link from "next/link";
import { ChevronDown } from "lucide-react";

import { navigation } from "./menu";
import MegaMenu from "./MegaMenu";

export default function DesktopMenu() {
    return (
        <nav
            aria-label="Main navigation"
            className="hidden items-center gap-5 lg:flex xl:gap-7"
        >
            {navigation.map((item) => {
                const hasMegaMenu =
                    "mega" in item && item.mega;

                return (
                    <div
                        key={item.title}
                        className="group relative flex h-20 items-center"
                    >
                        {hasMegaMenu ? (
                            <>
                                <Link
                                    href={item.href ?? "#"}
                                    className="flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-slate-700 transition hover:text-blue-600"
                                >
                                    <span>{item.title}</span>

                                    <ChevronDown
                                        size={15}
                                        strokeWidth={2}
                                        className="transition-transform duration-200 group-hover:rotate-180"
                                    />
                                </Link>

                                <div className="pointer-events-none absolute left-1/2 top-full -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
                                    <MegaMenu
                                        items={item.items ?? []}
                                    />
                                </div>
                            </>
                        ) : (
                            <Link
                                href={item.href ?? "#"}
                                className="whitespace-nowrap text-sm font-medium text-slate-700 transition hover:text-blue-600"
                            >
                                {item.title}
                            </Link>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}