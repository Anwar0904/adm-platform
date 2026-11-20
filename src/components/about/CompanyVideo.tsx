type Props = {
    src: string;
    poster: string;
    label: string;
    className?: string;
    cover?: boolean;
};

/** Decorative capability visual. No sample or third-party video is presented as ADM media. */
export default function CompanyVideo({
    poster,
    label,
    className = "",
    cover = false,
}: Props) {
    const frameLayout = cover
        ? "absolute inset-0 h-full w-full"
        : "relative aspect-video w-full";

    return (
        <div
            role="img"
            aria-label={`${label} visual`}
            className={`${frameLayout} overflow-hidden bg-surface-alt ${className}`}
            style={{
                backgroundImage: `linear-gradient(135deg, rgba(4, 14, 28, 0.3), rgba(7, 20, 35, 0.55)), url("${poster}")`,
                backgroundPosition: "center",
                backgroundSize: "cover",
            }}
        >
            <div aria-hidden="true" className="absolute inset-[7%] border border-white/15" />
            <p className="absolute bottom-5 left-5 max-w-[70%] text-sm font-medium text-white/90 sm:bottom-7 sm:left-7 sm:text-base">
                {label}
            </p>
        </div>
    );
}
