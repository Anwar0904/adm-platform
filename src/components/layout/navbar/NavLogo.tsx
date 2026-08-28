import Link from "next/link";

export default function NavLogo() {
    return (
        <Link
            href="/"
            className="group flex items-center gap-3"
        >
            <div className="flex items-center gap-3">
                {/* Logo */}
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 shadow-lg shadow-blue-600/20 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-xl group-hover:shadow-blue-600/30 sm:h-14 sm:w-14">
                    <div className="absolute inset-0 bg-white/10" />

                    <img
                        src="/logo.png"
                        alt="ADM logo"
                        className="relative h-10 w-10 object-contain sm:h-11 sm:w-11"
                    />
                </div>

                {/* Brand Name */}
                <div className="leading-none">
                    <h1 className="text-lg font-black tracking-tight text-slate-900 sm:text-xl">
                        Arazi{" "}
                        <span className="text-blue-600">Digital Media</span>
                    </h1>
                    <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 sm:text-[11px]">
                        Intelligent Digital Solutions
                    </p>
                </div>
            </div>
        </Link>


    );
} 