"use client";

import Link from "next/link";
import { navigation } from "./menu";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function MobileMenu() {
    const [open, setOpen] =
        useState(false);

    return (
        <>

            <button
                onClick={() =>
                    setOpen(!open)
                }
                className="lg:hidden"
            >
                {open ? (
                    <X />
                ) : (
                    <Menu />
                )}
            </button>

            {open && (
                <div className="fixed inset-0 z-50 bg-white">

                    <div className="space-y-6 p-8">

                        {navigation.map(
                            (item) => (

                                <div
                                    key={
                                        item.title
                                    }
                                >

                                    {"mega" in
                                    item ? (
                                        <>
                                            <h3 className="mb-3 font-semibold">
                                                {
                                                    item.title
                                                }
                                            </h3>

                                            <div className="ml-4 space-y-3">

                                                {item.items?.map(
                                                    (
                                                        child
                                                    ) => (
                                                        <Link
                                                            key={
                                                                child.href
                                                            }
                                                            href={
                                                                child.href
                                                            }
                                                        >
                                                            {
                                                                child.title
                                                            }
                                                        </Link>
                                                    )
                                                )}

                                            </div>
                                        </>
                                    ) : (
                                        <Link
                                            href={
                                                item.href!
                                            }
                                        >
                                            {
                                                item.title
                                            }
                                        </Link>
                                    )}

                                </div>
                            )
                        )}

                    </div>

                </div>
            )}

        </>
    );
}