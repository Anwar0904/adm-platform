"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
    Check,
    ImageIcon,
    Search,
    X,
} from "lucide-react";

type MediaItem = {
    _id: string;
    title?: string;
    url?: string;
    path?: string;
    mimeType?: string;
    alt?: string;
};

interface MediaPickerProps {
    value?: string | null;
    onChange: (mediaId: string | null) => void;
    label: string;
    description?: string;
    accept?: "image" | "all";
}

export default function MediaPicker({
    value,
    onChange,
    label,
    description,
    accept = "image",
}: MediaPickerProps) {
    const [open, setOpen] = useState(false);
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    const selected = media.find(
        (item) => item._id === value
    );

    async function loadMedia() {
        try {
            setLoading(true);

            const response = await fetch(
                "/api/media?limit=100",
                {
                    cache: "no-store",
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Unable to load media."
                );
            }

            const result = await response.json();

            const items =
                result.data?.media ??
                result.data?.items ??
                [];

            setMedia(items);
        } catch {
            setMedia([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (open) {
            loadMedia();
        }
    }, [open]);

    const filteredMedia = media.filter(
        (item) =>
            item.title
                ?.toLowerCase()
                .includes(
                    search.toLowerCase()
                ) ||
            item.alt
                ?.toLowerCase()
                .includes(
                    search.toLowerCase()
                )
    );

    function selectMedia(item: MediaItem) {
        onChange(item._id);
        setOpen(false);
    }

    const imageUrl =
        selected?.url ??
        selected?.path;

    return (
        <>
            <div className="space-y-3">
                <div>
                    <label className="text-sm font-bold text-slate-800">
                        {label}
                    </label>

                    {description && (
                        <p className="mt-1 text-xs text-slate-500">
                            {description}
                        </p>
                    )}
                </div>

                {selected ? (
                    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                        <div className="relative aspect-[3/1] w-full">
                            {imageUrl ? (
                                <Image
                                    src={imageUrl}
                                    alt={
                                        selected.alt ??
                                        selected.title ??
                                        label
                                    }
                                    fill
                                    className="object-contain p-5"
                                    sizes="600px"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-slate-400">
                                    <ImageIcon />
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-200 bg-white p-3">
                            <div className="min-w-0">
                                <p className="truncate text-sm font-bold text-slate-800">
                                    {selected.title ??
                                        "Selected media"}
                                </p>

                                <p className="truncate text-xs text-slate-400">
                                    {selected._id}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setOpen(true)
                                    }
                                    className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800"
                                >
                                    Change
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        onChange(null)
                                    }
                                    className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                                    aria-label={`Remove ${label}`}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() =>
                            setOpen(true)
                        }
                        className="flex min-h-32 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-5 text-center transition hover:border-blue-400 hover:bg-blue-50/40"
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                            <ImageIcon size={20} />
                        </div>

                        <span className="mt-3 text-sm font-bold text-slate-700">
                            Select from Media Library
                        </span>

                        <span className="mt-1 text-xs text-slate-400">
                            Choose an existing image
                        </span>
                    </button>
                )}
            </div>

            {open && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
                    <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-200 p-5">
                            <div>
                                <h2 className="text-xl font-black text-slate-900">
                                    Select Media
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Choose an image from your media library.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setOpen(false)
                                }
                                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="border-b border-slate-100 p-4">
                            <div className="relative">
                                <Search
                                    size={17}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Search media..."
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white"
                                />
                            </div>
                        </div>

                        <div className="min-h-0 flex-1 overflow-y-auto p-5">
                            {loading ? (
                                <div className="flex min-h-60 items-center justify-center text-sm text-slate-400">
                                    Loading media...
                                </div>
                            ) : filteredMedia.length ===
                                0 ? (
                                <div className="flex min-h-60 flex-col items-center justify-center text-center">
                                    <ImageIcon
                                        size={36}
                                        className="text-slate-300"
                                    />

                                    <p className="mt-3 font-bold text-slate-600">
                                        No media found
                                    </p>

                                    <p className="mt-1 text-sm text-slate-400">
                                        Upload an image from Media Management first.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                                    {filteredMedia.map(
                                        (item) => {
                                            const src =
                                                item.url ??
                                                item.path;

                                            const isSelected =
                                                item._id ===
                                                value;

                                            if (
                                                accept ===
                                                "image" &&
                                                !item.mimeType?.startsWith(
                                                    "image/"
                                                )
                                            ) {
                                                return null;
                                            }

                                            return (
                                                <button
                                                    key={
                                                        item._id
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        selectMedia(
                                                            item
                                                        )
                                                    }
                                                    className={`group relative overflow-hidden rounded-2xl border-2 bg-slate-50 text-left transition ${isSelected
                                                        ? "border-blue-600 ring-4 ring-blue-100"
                                                        : "border-slate-200 hover:border-blue-300"
                                                        }`}
                                                >
                                                    <div className="relative aspect-square">
                                                        {src ? (
                                                            <Image
                                                                src={
                                                                    src
                                                                }
                                                                alt={
                                                                    item.alt ??
                                                                    item.title ??
                                                                    ""
                                                                }
                                                                fill
                                                                className="object-cover transition group-hover:scale-105"
                                                                sizes="250px"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full items-center justify-center text-slate-300">
                                                                <ImageIcon />
                                                            </div>
                                                        )}

                                                        {isSelected && (
                                                            <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg">
                                                                <Check
                                                                    size={
                                                                        15
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="p-3">
                                                        <p className="truncate text-xs font-bold text-slate-700">
                                                            {item.title ??
                                                                "Untitled"}
                                                        </p>
                                                    </div>
                                                </button>
                                            );
                                        }
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}