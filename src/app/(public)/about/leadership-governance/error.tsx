"use client";

import { useEffect } from "react";

export default function Error({
    error,
    retry,
}: {
    error: Error & { digest?: string };
    retry: () => void;
}) {
    useEffect(() => {
        console.error("Unable to load leadership governance content.", error);
    }, [error]);

    return (
        <main className="flex min-h-[50vh] items-center justify-center bg-[#050d1a] px-5 py-16 text-center">
            <div className="max-w-lg">
                <h1 className="text-2xl font-semibold text-white">
                    Leadership profiles are temporarily unavailable.
                </h1>
                <p className="mt-4 leading-7 text-slate-400">
                    Please try again in a moment.
                </p>
                <button
                    type="button"
                    onClick={() => retry()}
                    className="mt-7 inline-flex min-h-11 items-center justify-center rounded-full border border-cyan-300/40 px-5 text-sm font-semibold text-cyan-200 transition-colors hover:bg-cyan-300/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                >
                    Try again
                </button>
            </div>
        </main>
    );
}
