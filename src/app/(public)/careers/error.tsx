"use client";

export default function CareersError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div role="alert" className="flex min-h-[50vh] items-center justify-center bg-surface px-5 py-16 text-center text-text">
      <div className="max-w-lg">
        <h1 className="text-2xl font-semibold">Careers are temporarily unavailable.</h1>
        <p className="mt-4 leading-7 text-text-muted">Please try again in a moment.</p>
        <button
          type="button"
          onClick={reset}
          className="mt-7 inline-flex min-h-11 items-center justify-center border border-border px-5 text-sm font-semibold text-brand-300 transition-colors hover:bg-surface-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
