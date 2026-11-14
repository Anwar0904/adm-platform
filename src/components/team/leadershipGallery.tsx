
"use client";

import Image from "next/image";
import {
    useState,
    useRef,
    type PointerEvent,
    type TransitionEvent,
} from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { IPublicTeamMember } from "@/types/team-member.types";

type GalleryMember = IPublicTeamMember & {
    avatar: {
        url: string;
        alt?: string;
    };
};

const mod = (value: number, length: number) =>
    ((value % length) + length) % length;

export default function TeamGallery({
    members,
}: {
    members: IPublicTeamMember[];
}) {
    const galleryMembers = members.filter(
        (member): member is GalleryMember =>
            Boolean(member.governanceGroup && member.avatar?.url)
    );
    const [currentIndex, setCurrentIndex] = useState(0);
    const [dragX, setDragX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [exitDirection, setExitDirection] = useState<
        -1 | 1 | null
    >(null);

    const startX = useRef(0);
    const startTime = useRef(0);
    const draggingRef = useRef(false);

    // Start dragging the front photograph.
    const handlePointerDown = (
        event: PointerEvent<HTMLDivElement>
    ) => {
        if (
            exitDirection !== null ||
            !event.isPrimary ||
            (event.pointerType === "mouse" && event.button !== 0)
        ) return;

        draggingRef.current = true;
        startX.current = event.clientX;
        startTime.current = Date.now();

        setIsDragging(true);

        event.currentTarget.setPointerCapture(event.pointerId);
    };

    // Follow the pointer while dragging.
    const handlePointerMove = (
        event: PointerEvent<HTMLDivElement>
    ) => {
        if (!draggingRef.current) return;

        setDragX(event.clientX - startX.current);
    };

    // Decide whether to dismiss the current photograph.
    const handlePointerUp = (
        event: PointerEvent<HTMLDivElement>
    ) => {
        if (!draggingRef.current) return;

        draggingRef.current = false;
        setIsDragging(false);

        const distance = event.clientX - startX.current;
        const elapsed = Math.max(Date.now() - startTime.current, 1);
        const velocity = Math.abs(distance) / elapsed;

        const shouldMove =
            Math.abs(distance) > 105 ||
            (Math.abs(distance) > 45 && velocity > 0.55);

        if (shouldMove) {
            setExitDirection(distance < 0 ? -1 : 1);
        } else {
            setDragX(0);
        }
    };

    // Cancel an incomplete gesture.
    const handlePointerCancel = () => {
        draggingRef.current = false;
        setIsDragging(false);
        setDragX(0);
    };

    // Move the dismissed photograph to the bottom of the stack.
    const handleTransitionEnd = (
        event: TransitionEvent<HTMLDivElement>
    ) => {
        if (
            event.propertyName !== "transform" ||
            exitDirection === null
        ) return;

        const direction = exitDirection;

        setCurrentIndex((index) =>
            mod(index + (direction === -1 ? 1 : -1), galleryMembers.length)
        );

        setExitDirection(null);
        setDragX(0);
    };

    // Navigate using the controls.
    const navigate = (direction: -1 | 1) => {
        if (exitDirection !== null || draggingRef.current) return;

        setExitDirection(direction);
    };

    return (
        <section className="overflow-hidden bg-[#050d1a]">

            <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">

                {/* Gallery introduction */}
                <div className="mb-14 text-center sm:mb-16">

                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
                        Leadership &amp; Governance
                    </p>

                    <h2 className="text-3xl font-semibold tracking-[-0.045em] text-white sm:text-4xl lg:text-5xl">
                        Meet the <span className="text-brand-300">people</span>
                        <br className="hidden sm:block" /> behind our vision.
                    </h2>

                    <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                        Approved leadership portraits from the Board,
                        Executive Committee and Management Committee.
                    </p>
                </div>

                {/* Stacked slider */}
                <div className="mx-auto w-full max-w-[470px]">
                    {galleryMembers.length > 0 ? (
                        <div
                            className="relative mx-auto aspect-[0.92/1] w-full"
                            style={{ touchAction: "pan-y" }}
                        >

                            {Array.from(galleryMembers.keys()).map((offset) => {
                                const index = mod(
                                    currentIndex + offset,
                                    galleryMembers.length
                                );
                                const member = galleryMembers[index];

                                const isTop = offset === 0;

                                const stackX = Math.min(offset * 20, 60);
                                const stackY = Math.min(offset * 13, 39);
                                const scale = Math.max(
                                    0.925,
                                    1 - offset * 0.025
                                );

                                let transform =
                                    `translate3d(${stackX}px, ${stackY}px, 0) scale(${scale})`;

                                if (isTop) {
                                    if (exitDirection !== null) {
                                        transform =
                                            `translate3d(${exitDirection * 135}%, 0, 0) rotate(${exitDirection * 14}deg)`;
                                    } else if (isDragging) {
                                        transform =
                                            `translate3d(${dragX}px, 0, 0) rotate(${dragX * 0.035}deg)`;
                                    } else {
                                        transform =
                                            "translate3d(0, 0, 0) scale(1)";
                                    }
                                }

                                return (
                                    <div
                                        key={member.id}
                                        onPointerDown={isTop ? handlePointerDown : undefined}
                                        onPointerMove={isTop ? handlePointerMove : undefined}
                                        onPointerUp={isTop ? handlePointerUp : undefined}
                                        onPointerCancel={isTop ? handlePointerCancel : undefined}
                                        onTransitionEnd={isTop ? handleTransitionEnd : undefined}
                                        className={`absolute left-0 top-0 w-[84%] max-w-[390px] overflow-hidden rounded-xl bg-[#102039] shadow-2xl ${
                                            isTop
                                                ? "cursor-grab active:cursor-grabbing"
                                                : "pointer-events-none"
                                        }`}
                                        style={{
                                            aspectRatio: "4 / 5",
                                            zIndex: galleryMembers.length - offset,
                                            transform,
                                            transition:
                                                isTop && isDragging
                                                    ? "none"
                                                    : "transform 520ms cubic-bezier(0.22, 1, 0.36, 1)",
                                            willChange: "transform",
                                        }}
                                    >

                                        <Image
                                            src={member.avatar.url}
                                            alt={member.avatar.alt || `${member.name}, ${member.designation}`}
                                            fill
                                            draggable={false}
                                            sizes="(max-width: 640px) 84vw, 390px"
                                            className="pointer-events-none select-none object-cover"
                                            priority={isTop}
                                        />

                                        {/* Image caption */}
                                        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#050d1a] via-[#050d1a]/55 to-transparent px-6 pb-7 pt-24 sm:px-8">

                                            <p className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                                                {member.name}
                                            </p>

                                            <p className="mt-2 text-sm text-slate-300">
                                                {member.designation}
                                            </p>

                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex aspect-[0.92/1] items-center justify-center rounded-2xl border border-white/10 bg-[#091629] px-8 text-center">
                            <p className="max-w-sm text-sm leading-7 text-slate-400">
                                Approved leadership portraits will appear here
                                when they are available.
                            </p>
                        </div>
                    )}

                    {galleryMembers.length > 0 && (
                        <>
                            {/* Navigation and counter */}
                            <div className="mt-8 flex items-center justify-between">
                                <p className="text-xs tracking-wide text-slate-400">
                                    <span className="font-semibold text-white">
                                        {String(currentIndex + 1).padStart(2, "0")}
                                    </span>
                                    {" / "}
                                    {String(galleryMembers.length).padStart(2, "0")}
                                    <span className="ml-2 text-slate-500">
                                        Approved profiles
                                    </span>
                                </p>

                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => navigate(1)}
                                        disabled={exitDirection !== null}
                                        aria-label="Previous leadership profile"
                                        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-cyan-300 hover:text-cyan-300 disabled:opacity-40"
                                    >
                                        <ArrowLeft aria-hidden="true" size={18} />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => navigate(-1)}
                                        disabled={exitDirection !== null}
                                        aria-label="Next leadership profile"
                                        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-cyan-300 hover:text-cyan-300 disabled:opacity-40"
                                    >
                                        <ArrowRight aria-hidden="true" size={18} />
                                    </button>
                                </div>
                            </div>

                            <p className="mt-5 text-center text-[11px] tracking-wide text-slate-500">
                                Drag or swipe the photograph to explore approved profiles
                            </p>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
