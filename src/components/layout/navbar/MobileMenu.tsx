"use client";

import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { navigation } from "./menu";

export default function MobileMenu() {
    const [open, setOpen] = useState(false);
    const [servicesOpen, setServicesOpen] =
        useState(false);

    // Prevent background scrolling while menu is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    const closeMenu = () => {
        setOpen(false);
        setServicesOpen(false);
    };

    return (
        <>
            {/* Mobile menu button */}
            <button
                type="button"
                aria-label={
                    open
                        ? "Close navigation menu"
                        : "Open navigation menu"
                }
                aria-expanded={open}
                onClick={() => setOpen((value) => !value)}
                className="relative z-[70] inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 lg:hidden"
            >
                {open ? (
                    <X
                        size={21}
                        strokeWidth={2}
                    />
                ) : (
                    <Menu
                        size={21}
                        strokeWidth={2}
                    />
                )}
            </button>

            {/* Mobile navigation */}
            {open && (
                <div className="fixed inset-0 z-[60] lg:hidden">
                    {/* Solid backdrop */}
                    <button
                        type="button"
                        aria-label="Close menu"
                        onClick={closeMenu}
                        className="absolute inset-0 bg-slate-950/30"
                    />

                    {/* Menu panel */}
                    <div className="absolute inset-x-0 top-0 flex h-screen flex-col bg-white shadow-2xl">
                        {/* Menu header */}
                        <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-200 px-5 sm:px-6">
                            <Link
                                href="/"
                                onClick={closeMenu}
                                className="text-lg font-bold text-slate-950"
                            >
                                ADM
                            </Link>

                            <button
                                type="button"
                                aria-label="Close navigation"
                                onClick={closeMenu}
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
                            >
                                <X
                                    size={21}
                                />
                            </button>
                        </div>

                        {/* Links */}
                        <nav className="flex-1 overflow-y-auto px-5 py-6 sm:px-6">
                            <div className="space-y-1">
                                {navigation.map(
                                    (item) => {
                                        const isMega =
                                            "mega" in
                                            item &&
                                            item.mega;

                                        if (
                                            isMega
                                        ) {
                                            return (
                                                <div
                                                    key={
                                                        item.title
                                                    }
                                                >
                                                    {/* Services */}
                                                    <div className="flex items-center">
                                                        <Link
                                                            href={
                                                                item.href!
                                                            }
                                                            onClick={
                                                                closeMenu
                                                            }
                                                            className="flex min-h-12 flex-1 items-center rounded-xl px-3 text-base font-semibold text-slate-900 transition hover:bg-slate-50"
                                                        >
                                                            {
                                                                item.title
                                                            }
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            aria-label="Toggle services"
                                                            aria-expanded={
                                                                servicesOpen
                                                            }
                                                            onClick={() =>
                                                                setServicesOpen(
                                                                    (
                                                                        value
                                                                    ) =>
                                                                        !value
                                                                )
                                                            }
                                                            className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100"
                                                        >
                                                            <ChevronDown
                                                                size={
                                                                    19
                                                                }
                                                                className={`transition-transform duration-200 ${servicesOpen
                                                                        ? "rotate-180"
                                                                        : ""
                                                                    }`}
                                                            />
                                                        </button>
                                                    </div>

                                                    {/* Services submenu */}
                                                    {servicesOpen && (
                                                        <div className="ml-3 mt-1 space-y-1 border-l-2 border-slate-100 pl-3">
                                                            {item.items?.map(
                                                                (
                                                                    child
                                                                ) => {
                                                                    const Icon =
                                                                        child.icon;

                                                                    return (
                                                                        <Link
                                                                            key={
                                                                                child.href
                                                                            }
                                                                            href={
                                                                                child.href
                                                                            }
                                                                            onClick={
                                                                                closeMenu
                                                                            }
                                                                            className="flex items-start gap-3 rounded-xl px-3 py-3 transition hover:bg-slate-50"
                                                                        >
                                                                            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                                                                {Icon && (
                                                                                    <Icon
                                                                                        size={
                                                                                            17
                                                                                        }
                                                                                    />
                                                                                )}
                                                                            </span>

                                                                            <span className="min-w-0">
                                                                                <span className="block text-sm font-semibold text-slate-900">
                                                                                    {
                                                                                        child.title
                                                                                    }
                                                                                </span>

                                                                                {child.description && (
                                                                                    <span className="mt-0.5 block text-xs leading-5 text-slate-500">
                                                                                        {
                                                                                            child.description
                                                                                        }
                                                                                    </span>
                                                                                )}
                                                                            </span>
                                                                        </Link>
                                                                    );
                                                                }
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        }

                                        return (
                                            <Link
                                                key={
                                                    item.title
                                                }
                                                href={
                                                    item.href!
                                                }
                                                onClick={
                                                    closeMenu
                                                }
                                                className="flex min-h-12 items-center rounded-xl px-3 text-base font-semibold text-slate-900 transition hover:bg-slate-50 hover:text-blue-600"
                                            >
                                                {
                                                    item.title
                                                }
                                            </Link>
                                        );
                                    }
                                )}
                            </div>

                            {/* Mobile CTA */}
                            <div className="mt-6 border-t border-slate-200 pt-6">
                                <Link
                                    href="/consultation"
                                    onClick={
                                        closeMenu
                                    }
                                    className="flex h-12 w-full items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                                >
                                    Book Consultation
                                </Link>
                            </div>
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
}