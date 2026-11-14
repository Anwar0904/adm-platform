"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Props = {
    src: string;
    poster: string;
    label: string;
    className?: string;
    cover?: boolean;
};

export default function CompanyVideo({
    src,
    poster,
    label,
    className = "",
    cover = false,
}: Props) {
    const frameRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isInView, setIsInView] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasFrame, setHasFrame] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [playbackBlocked, setPlaybackBlocked] = useState(false);

    useEffect(() => {
        const query = window.matchMedia("(prefers-reduced-motion: reduce)");
        const updatePreference = (event?: MediaQueryListEvent) => {
            setPrefersReducedMotion(event?.matches ?? query.matches);
        };

        updatePreference();
        query.addEventListener("change", updatePreference);

        return () => query.removeEventListener("change", updatePreference);
    }, []);

    useEffect(() => {
        const frame = frameRef.current;
        if (!frame) return;

        let frameId: number | null = null;
        const updateVisibility = () => {
            frameId = null;
            const rect = frame.getBoundingClientRect();
            const visibleWidth = Math.max(
                0,
                Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0)
            );
            const visibleHeight = Math.max(
                0,
                Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)
            );
            const visible =
                rect.width > 0 &&
                rect.height > 0 &&
                visibleWidth * visibleHeight >= rect.width * rect.height * 0.2;

            setIsInView((current) => (current === visible ? current : visible));
        };
        const scheduleVisibilityUpdate = () => {
            if (frameId === null) {
                frameId = window.requestAnimationFrame(updateVisibility);
            }
        };
        const observer = new IntersectionObserver(
            scheduleVisibilityUpdate,
            { threshold: 0.2 }
        );

        observer.observe(frame);
        window.addEventListener("scroll", scheduleVisibilityUpdate, {
            passive: true,
        });
        window.addEventListener("resize", scheduleVisibilityUpdate);
        scheduleVisibilityUpdate();

        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", scheduleVisibilityUpdate);
            window.removeEventListener("resize", scheduleVisibilityUpdate);
            if (frameId !== null) window.cancelAnimationFrame(frameId);
        };
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (!isInView || prefersReducedMotion || hasError) {
            video.pause();
            return;
        }

        video.play().then(
            () => setPlaybackBlocked(false),
            () => setPlaybackBlocked(true)
        );
    }, [hasError, isInView, prefersReducedMotion]);

    const togglePlayback = async () => {
        const video = videoRef.current;
        if (!video || hasError) return;

        if (!video.paused) {
            video.pause();
            return;
        }

        setPlaybackBlocked(false);
        try {
            await video.play();
        } catch {
            setPlaybackBlocked(true);
        }
    };

    const frameLayout = cover
        ? "absolute inset-0 h-full w-full"
        : "relative aspect-video w-full";

    return (
        <div
            ref={frameRef}
            className={`${frameLayout} overflow-hidden bg-surface-alt ${className}`}
        >
            <div
                aria-hidden="true"
                style={{
                    backgroundImage: `linear-gradient(135deg, rgba(16, 34, 56, 0.1), rgba(7, 20, 35, 0.1)), url("${poster}")`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                }}
                className={`absolute inset-0 transition-opacity duration-500 ${
                    hasFrame && !hasError ? "opacity-0" : "opacity-100"
                }`}
            >
                <div className="absolute inset-[7%] border border-white/10" />
                <p className="absolute bottom-5 left-5 max-w-[70%] text-sm font-medium text-white/80 sm:bottom-7 sm:left-7 sm:text-base">
                    {label}
                </p>
            </div>

            <p className="absolute left-4 top-4 z-10 bg-surface/85 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-text-muted sm:left-6 sm:top-6 sm:text-[10px]">
                Temporary media
            </p>

            <video
                ref={videoRef}
                aria-label={`${label} sample video`}
                muted
                loop
                playsInline
                preload="none"
                poster={poster}
                onLoadedData={() => setHasFrame(true)}
                onPlaying={() => {
                    setHasFrame(true);
                    setIsPlaying(true);
                    setPlaybackBlocked(false);
                }}
                onPause={() => setIsPlaying(false)}
                onError={() => {
                    setHasError(true);
                    setHasFrame(false);
                    setIsPlaying(false);
                }}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                    hasFrame && !hasError ? "opacity-100" : "opacity-0"
                }`}
            >
                <source src={src} type="video/mp4" />
            </video>

            {hasError ? (
                <p
                    role="status"
                    className="absolute bottom-5 left-5 max-w-[65%] text-xs leading-5 text-text-muted sm:bottom-7 sm:left-7 sm:text-sm"
                >
                    This sample is unavailable. The ADM media placeholder is
                    shown instead.
                </p>
            ) : (
                <>
                    {playbackBlocked && (
                        <p
                            role="status"
                            className="absolute bottom-5 left-5 max-w-[65%] text-xs leading-5 text-text-muted sm:bottom-7 sm:left-7 sm:text-sm"
                        >
                            Select play to start this sample.
                        </p>
                    )}
                    <button
                        type="button"
                        onClick={togglePlayback}
                        aria-label={`${isPlaying ? "Pause" : "Play"} ${label} video`}
                        aria-pressed={isPlaying}
                        className="absolute bottom-4 right-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/50 bg-surface/85 text-text transition-colors hover:bg-surface-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300 sm:bottom-6 sm:right-6 sm:h-12 sm:w-12"
                    >
                        {isPlaying ? (
                            <Pause aria-hidden="true" size={18} />
                        ) : (
                            <Play aria-hidden="true" size={18} className="ml-0.5" />
                        )}
                    </button>
                </>
            )}
        </div>
    );
}
