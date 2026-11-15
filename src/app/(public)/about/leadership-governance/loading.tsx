export default function Loading() {
    return (
        <main
            aria-busy="true"
            aria-label="Loading leadership profiles"
            className="min-h-screen bg-[#050d1a]"
        >
            <div className="mx-auto max-w-7xl animate-pulse px-5 pb-16 pt-28 sm:px-8 lg:px-10">
                <div className="h-4 w-72 rounded bg-white/10" />
                <div className="mt-12 h-12 max-w-xl rounded bg-white/10" />
                <div className="mt-5 h-5 max-w-2xl rounded bg-white/10" />
                <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    {[0, 1, 2].map((item) => (
                        <div key={item}>
                            <div className="aspect-[4/5] bg-white/10" />
                            <div className="mt-6 h-5 w-2/3 rounded bg-white/10" />
                            <div className="mt-3 h-7 w-4/5 rounded bg-white/10" />
                            <div className="mt-5 h-16 rounded bg-white/10" />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
