"use client";

import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { navigation, type NavigationChild } from "./menu";

function NavLogo({ compact = false }: { compact?: boolean }) {
    return (
        <Link
            href="/"
            className="group flex items-center gap-2"
        >
            <div className="flex items-center gap-2">
                <div className={`brand-gradient relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-brand transition-all duration-300 group-hover:-translate-y-0.5 ${compact ? "h-6 w-6 sm:h-7 sm:w-7" : "h-7 w-7 sm:h-9 sm:w-9"}`}>
                    <div className="absolute inset-0 bg-white/10" />

                    <img
                        src="/logo.png"
                        alt="ADM logo"
                        className={`relative object-contain ${compact ? "h-5 w-5 sm:h-6 sm:w-6" : "h-7 w-7 sm:h-7 sm:w-7"}`}
                    />
                </div>

                <div className="leading-none">
                    <span className={`font-black tracking-tight text-text transition-all duration-300 ${compact ? "text-base sm:text-base" : "text-lg sm:text-lg"}`}>
                        Arazi{" "}
                        <span className="text-brand-600">Digital Media</span>
                    </span>
                    <p className={`mt-1.5 font-semibold uppercase tracking-[0.18em] text-text-soft transition-all duration-300 ${compact ? "text-[7px]" : "text-[8px] sm:text-[7px]"}`}>
                        Intelligent Digital Solutions
                    </p>
                </div>
            </div>
        </Link>
    );
}

function MegaMenu({
    id,
    items,
    open,
    onNavigate,
}: {
    id: string;
    items: NavigationChild[];
    open: boolean;
    onNavigate?: () => void;
}) {
    return (
        <div
            id={id}
            hidden={!open}
            className="absolute left-1/2 top-full w-[31rem] -translate-x-1/2 rounded-2xl border border-white/10 bg-slate-950/95 p-6 shadow-[0_30px_60px_rgba(2,6,23,0.5)] backdrop-blur-md"
        >
            <div className="grid grid-cols-2 gap-4">
                {items.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onNavigate}
                            className="flex gap-4 rounded-xl border border-transparent p-4 transition hover:border-blue-400/30 hover:bg-blue-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                        >
                            {Icon && (
                                <Icon
                                    aria-hidden="true"
                                    className="mt-1 h-5 w-5 shrink-0 text-cyan-300"
                                />
                            )}

                            <div>
                                <h4 className="font-semibold text-white">{item.title}</h4>
                                {item.description && (
                                    <p className="mt-1 text-sm text-slate-300">
                                        {item.description}
                                    </p>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [aboutOpen, setAboutOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);
    const [desktopOpenMenu, setDesktopOpenMenu] = useState<string | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const desktopTriggerRefs = useRef<Record<string, HTMLElement | null>>({});
    const suppressDesktopFocusOpen = useRef(false);
    const primaryNavigationItem = navigation.find(
        (item) => "primary" in item && item.primary
    );
    const desktopNavigation = navigation.filter(
        (item) => item !== primaryNavigationItem
    );

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 18);
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });

        return () => window.removeEventListener("scroll", onScroll);
    }, []);

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
        setAboutOpen(false);
        setServicesOpen(false);
    };

    return (
        <header className={`site-nav sticky top-0 z-50 w-full bg-slate-950/60 transition-all duration-300 ${scrolled ? "shadow-[0_20px_50px_rgba(8,15,30,0.45)] backdrop-blur-md" : "shadow-none"}`}>
            <div className={`mx-auto flex w-full max-w-7xl items-center justify-between px-4 transition-all duration-300 sm:px-5 lg:px-8 ${scrolled ? "h-13 sm:h-16 lg:h-14" : "h-18 sm:h-14 lg:h-16"}`}>
                <div className="shrink-0">
                    <NavLogo compact={scrolled} />
                </div>

                <nav
                    aria-label="Main navigation"
                    className="hidden items-center gap-5 lg:flex xl:gap-7"
                >
                    {desktopNavigation.map((item) => {
                        const hasMegaMenu = item.mega === true;
                        const submenuId = `desktop-${item.title
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")}-submenu`;
                        const submenuOpen = desktopOpenMenu === item.title;

                        return (
                            <div
                                key={item.title}
                                className="group relative flex h-20 items-center"
                                onMouseEnter={() => {
                                    if (hasMegaMenu) {
                                        setDesktopOpenMenu(item.title);
                                    }
                                }}
                                onMouseLeave={(event) => {
                                    if (
                                        !hasMegaMenu ||
                                        event.currentTarget.contains(document.activeElement)
                                    ) {
                                        return;
                                    }

                                    setDesktopOpenMenu((activeMenu) =>
                                        activeMenu === item.title ? null : activeMenu
                                    );
                                }}
                                onFocus={() => {
                                    if (!hasMegaMenu) {
                                        return;
                                    }

                                    if (suppressDesktopFocusOpen.current) {
                                        suppressDesktopFocusOpen.current = false;
                                        return;
                                    }

                                    setDesktopOpenMenu(item.title);
                                }}
                                onBlur={(event) => {
                                    const nextTarget = event.relatedTarget;

                                    if (
                                        !hasMegaMenu ||
                                        (nextTarget instanceof Node &&
                                            event.currentTarget.contains(nextTarget))
                                    ) {
                                        return;
                                    }

                                    setDesktopOpenMenu((activeMenu) =>
                                        activeMenu === item.title ? null : activeMenu
                                    );
                                }}
                                onKeyDown={(event) => {
                                    if (
                                        !hasMegaMenu ||
                                        event.key !== "Escape" ||
                                        desktopOpenMenu !== item.title
                                    ) {
                                        return;
                                    }

                                    event.preventDefault();
                                    setDesktopOpenMenu(null);
                                    const trigger = desktopTriggerRefs.current[item.title];

                                    if (trigger && document.activeElement !== trigger) {
                                        suppressDesktopFocusOpen.current = true;
                                        trigger.focus();
                                    }
                                }}
                            >
                                {hasMegaMenu ? (
                                    <>
                                        {item.href ? (
                                            <Link
                                                ref={(element) => {
                                                    desktopTriggerRefs.current[item.title] = element;
                                                }}
                                                href={item.href}
                                                aria-expanded={submenuOpen}
                                                aria-controls={submenuId}
                                                className="site-nav-link flex items-center gap-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
                                            >
                                                <span>{item.title}</span>
                                                <ChevronDown
                                                    aria-hidden="true"
                                                    size={15}
                                                    strokeWidth={2}
                                                    className={`transition-transform duration-200 ${
                                                        submenuOpen ? "rotate-180" : ""
                                                    }`}
                                                />
                                            </Link>
                                        ) : (
                                            <button
                                                ref={(element) => {
                                                    desktopTriggerRefs.current[item.title] = element;
                                                }}
                                                type="button"
                                                aria-expanded={submenuOpen}
                                                aria-controls={submenuId}
                                                onClick={(event) => {
                                                    if (event.detail === 0 && submenuOpen) {
                                                        setDesktopOpenMenu(null);
                                                    } else {
                                                        setDesktopOpenMenu(item.title);
                                                    }
                                                }}
                                                className="site-nav-link flex items-center gap-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
                                            >
                                                <span>{item.title}</span>
                                                <ChevronDown
                                                    aria-hidden="true"
                                                    size={15}
                                                    strokeWidth={2}
                                                    className={`transition-transform duration-200 ${
                                                        submenuOpen ? "rotate-180" : ""
                                                    }`}
                                                />
                                            </button>
                                        )}
                                        <MegaMenu
                                            id={submenuId}
                                            items={item.items}
                                            open={submenuOpen}
                                            onNavigate={() => setDesktopOpenMenu(null)}
                                        />
                                    </>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className={
                                            item.primary
                                                ? "site-button-primary inline-flex focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300 xl:px-5 xl:py-2.5"
                                                : "site-nav-link focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
                                        }
                                    >
                                        {item.title}
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </nav>

                <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                    {primaryNavigationItem && !primaryNavigationItem.mega && (
                        <Link
                            href={primaryNavigationItem.href}
                            className="site-button-primary hidden lg:inline-flex focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300 xl:px-5 xl:py-2.5"
                        >
                            {primaryNavigationItem.title}
                        </Link>
                    )}

                    <button
                        type="button"
                        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
                        aria-expanded={open}
                        onClick={() => (open ? closeMenu() : setOpen(true))}
                        className="relative z-[70] inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-text shadow-sm transition hover:bg-surface-alt focus:outline-none focus:ring-2 focus:ring-brand-500/20 lg:hidden"
                    >
                        {open ? <X size={21} strokeWidth={2} /> : <Menu size={21} strokeWidth={2} />}
                    </button>
                </div>
            </div>

            {open && (
                <div className="fixed inset-0 z-[60] lg:hidden">
                    <button
                        type="button"
                        aria-label="Close menu"
                        onClick={closeMenu}
                        className="absolute inset-0 bg-slate-950/30"
                    />

                    <div className="absolute inset-x-0 top-0 flex h-screen flex-col bg-surface shadow-2xl">
                        <div className="flex h-20 shrink-0 items-center justify-between border-b border-border px-5 sm:px-6">
                            <Link href="/" onClick={closeMenu} className="text-lg font-bold text-text">
                                ADM
                            </Link>

                            <button
                                type="button"
                                aria-label="Close navigation"
                                onClick={closeMenu}
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-text-muted transition hover:bg-surface-alt"
                            >
                                <X size={21} />
                            </button>
                        </div>

                        <nav
                            aria-label="Mobile navigation"
                            className="flex-1 overflow-y-auto px-5 py-6 sm:px-6"
                        >
                            <div className="space-y-1">
                                {navigation.map((item) => {
                                    const isMega = item.mega === true;

                                    if (isMega) {
                                        const isAboutDropdown = !item.href;
                                        const isExpanded = isAboutDropdown
                                            ? aboutOpen
                                            : servicesOpen;
                                        const submenuId = `mobile-${item.title
                                            .toLowerCase()
                                            .replace(/[^a-z0-9]+/g, "-")}-submenu`;
                                        const toggleSubmenu = isAboutDropdown
                                            ? () => setAboutOpen((value) => !value)
                                            : () => setServicesOpen((value) => !value);

                                        return (
                                            <div key={item.title}>
                                                {item.href ? (
                                                    <div className="flex items-center">
                                                        <Link
                                                            href={item.href}
                                                            onClick={closeMenu}
                                                            className="flex min-h-12 flex-1 items-center rounded-xl px-3 text-base font-semibold text-text transition hover:bg-surface-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                                                        >
                                                            {item.title}
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            aria-label={`Toggle ${item.title} submenu`}
                                                            aria-expanded={isExpanded}
                                                            aria-controls={submenuId}
                                                            onClick={toggleSubmenu}
                                                            className="flex h-11 w-11 items-center justify-center rounded-xl text-text-soft transition hover:bg-surface-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                                                        >
                                                            <ChevronDown
                                                                aria-hidden="true"
                                                                size={19}
                                                                className={`transition-transform duration-200 ${
                                                                    isExpanded ? "rotate-180" : ""
                                                                }`}
                                                            />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        aria-expanded={isExpanded}
                                                        aria-controls={submenuId}
                                                        onClick={toggleSubmenu}
                                                        className="flex min-h-12 w-full items-center justify-between rounded-xl px-3 text-left text-base font-semibold text-text transition hover:bg-surface-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                                                    >
                                                        {item.title}
                                                        <ChevronDown
                                                            aria-hidden="true"
                                                            size={19}
                                                            className={`transition-transform duration-200 ${
                                                                isExpanded ? "rotate-180" : ""
                                                            }`}
                                                        />
                                                    </button>
                                                )}

                                                <div
                                                    id={submenuId}
                                                    hidden={!isExpanded}
                                                    className="ml-3 mt-1 space-y-1 border-l border-white/10 pl-3"
                                                >
                                                    {item.items.map((child) => {
                                                        const Icon = child.icon;

                                                        return (
                                                            <Link
                                                                key={child.href}
                                                                href={child.href}
                                                                onClick={closeMenu}
                                                                className="flex items-start gap-3 rounded-xl px-3 py-3 transition hover:border hover:border-blue-400/30 hover:bg-blue-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                                                            >
                                                                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/15 text-cyan-300">
                                                                    {Icon && (
                                                                        <Icon
                                                                            aria-hidden="true"
                                                                            size={17}
                                                                        />
                                                                    )}
                                                                </span>

                                                                <span className="min-w-0">
                                                                    <span className="block text-sm font-semibold text-white">
                                                                        {child.title}
                                                                    </span>
                                                                    {child.description && (
                                                                        <span className="mt-0.5 block text-xs leading-5 text-slate-300">
                                                                            {child.description}
                                                                        </span>
                                                                    )}
                                                                </span>
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    }

                                    return (
                                        <Link
                                            key={item.title}
                                            href={item.href}
                                            onClick={closeMenu}
                                            className={
                                                item.primary
                                                    ? "site-button-primary mt-4 flex h-12 w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                                                    : "site-nav-link flex min-h-12 items-center rounded-xl px-3 text-base font-semibold text-text transition hover:bg-surface-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                                            }
                                        >
                                            {item.title}
                                        </Link>
                                    );
                                })}
                            </div>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
}
