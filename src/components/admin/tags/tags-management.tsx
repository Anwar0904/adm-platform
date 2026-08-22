"use client";

import { FormEvent, useMemo, useState } from "react";
import {
    Edit3,
    Hash,
    Plus,
    Search,
    Trash2,
    X,
} from "lucide-react";

type Tag = {
    id: string;
    name: string;
    slug: string;
    posts: number;
    createdAt: string;
};

const initialTags: Tag[] = [
    {
        id: "1",
        name: "AI",
        slug: "ai",
        posts: 12,
        createdAt: "Jul 25, 2026",
    },
    {
        id: "2",
        name: "LLMs",
        slug: "llms",
        posts: 8,
        createdAt: "Jul 24, 2026",
    },
    {
        id: "3",
        name: "Next.js",
        slug: "next-js",
        posts: 7,
        createdAt: "Jul 20, 2026",
    },
    {
        id: "4",
        name: "Performance",
        slug: "performance",
        posts: 6,
        createdAt: "Jul 19, 2026",
    },
    {
        id: "5",
        name: "SSR",
        slug: "ssr",
        posts: 5,
        createdAt: "Jul 18, 2026",
    },
    {
        id: "6",
        name: "UI",
        slug: "ui",
        posts: 6,
        createdAt: "Jul 15, 2026",
    },
    {
        id: "7",
        name: "UX",
        slug: "ux",
        posts: 5,
        createdAt: "Jul 15, 2026",
    },
    {
        id: "8",
        name: "Cloud",
        slug: "cloud",
        posts: 4,
        createdAt: "Jul 10, 2026",
    },
    {
        id: "9",
        name: "Docker",
        slug: "docker",
        posts: 3,
        createdAt: "Jul 10, 2026",
    },
    {
        id: "10",
        name: "Kubernetes",
        slug: "kubernetes",
        posts: 3,
        createdAt: "Jul 9, 2026",
    },
    {
        id: "11",
        name: "Blockchain",
        slug: "blockchain",
        posts: 5,
        createdAt: "Jul 5, 2026",
    },
    {
        id: "12",
        name: "Web3",
        slug: "web3",
        posts: 4,
        createdAt: "Jul 5, 2026",
    },
    {
        id: "13",
        name: "Solidity",
        slug: "solidity",
        posts: 4,
        createdAt: "Jul 4, 2026",
    },
];

function createSlug(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export default function TagsManagement() {
    const [tags, setTags] =
        useState<Tag[]>(initialTags);

    const [search, setSearch] =
        useState("");

    const [showForm, setShowForm] =
        useState(false);

    const [editing, setEditing] =
        useState<Tag | null>(null);

    const [deleteTarget, setDeleteTarget] =
        useState<Tag | null>(null);

    const [name, setName] =
        useState("");

    const [slug, setSlug] =
        useState("");

    const [slugEdited, setSlugEdited] =
        useState(false);

    const filteredTags = useMemo(() => {
        const query =
            search.trim().toLowerCase();

        if (!query) return tags;

        return tags.filter(
            (tag) =>
                tag.name
                    .toLowerCase()
                    .includes(query) ||
                tag.slug
                    .toLowerCase()
                    .includes(query)
        );
    }, [tags, search]);

    function resetForm() {
        setName("");
        setSlug("");
        setEditing(null);
        setSlugEdited(false);
    }

    function openCreate() {
        resetForm();
        setShowForm(true);
    }

    function openEdit(tag: Tag) {
        setEditing(tag);
        setName(tag.name);
        setSlug(tag.slug);
        setSlugEdited(true);
        setShowForm(true);
    }

    function closeForm() {
        setShowForm(false);
        resetForm();
    }

    function handleNameChange(
        value: string
    ) {
        setName(value);

        if (!slugEdited) {
            setSlug(createSlug(value));
        }
    }

    function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        const cleanName =
            name.trim();

        const cleanSlug =
            slug.trim() ||
            createSlug(cleanName);

        if (!cleanName || !cleanSlug) {
            return;
        }

        const duplicate = tags.some(
            (tag) =>
                tag.slug === cleanSlug &&
                tag.id !== editing?.id
        );

        if (duplicate) {
            alert(
                "A tag with this slug already exists."
            );
            return;
        }

        if (editing) {
            setTags((current) =>
                current.map((tag) =>
                    tag.id === editing.id
                        ? {
                            ...tag,
                            name: cleanName,
                            slug: cleanSlug,
                        }
                        : tag
                )
            );
        } else {
            setTags((current) => [
                {
                    id: crypto.randomUUID(),
                    name: cleanName,
                    slug: cleanSlug,
                    posts: 0,
                    createdAt:
                        new Intl.DateTimeFormat(
                            "en-US",
                            {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            }
                        ).format(new Date()),
                },
                ...current,
            ]);
        }

        closeForm();
    }

    function deleteTag() {
        if (!deleteTarget) return;

        setTags((current) =>
            current.filter(
                (tag) =>
                    tag.id !==
                    deleteTarget.id
            )
        );

        setDeleteTarget(null);
    }

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            {/* Header */}

            <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold text-blue-600">
                        Content
                    </p>

                    <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
                        Tags
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                        Manage article tags used to improve
                        content discovery and filtering.
                    </p>
                </div>

                <button
                    onClick={openCreate}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                >
                    <Plus size={18} />
                    Add Tag
                </button>
            </section>

            {/* Stats */}

            <section className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                        Total Tags
                    </p>

                    <p className="mt-2 text-3xl font-black text-slate-900">
                        {tags.length}
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                        Used Tags
                    </p>

                    <p className="mt-2 text-3xl font-black text-slate-900">
                        {
                            tags.filter(
                                (tag) =>
                                    tag.posts > 0
                            ).length
                        }
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                        Article Relations
                    </p>

                    <p className="mt-2 text-3xl font-black text-slate-900">
                        {tags.reduce(
                            (total, tag) =>
                                total +
                                tag.posts,
                            0
                        )}
                    </p>
                </div>
            </section>

            {/* Search */}

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="relative max-w-lg">
                    <Search
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                        placeholder="Search tags..."
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                </div>
            </section>

            {/* Desktop */}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="hidden overflow-x-auto md:block">
                    <table className="w-full min-w-[700px]">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/70">
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Tag
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Slug
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Articles
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Created
                                </th>

                                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {filteredTags.map(
                                (tag) => (
                                    <tr
                                        key={
                                            tag.id
                                        }
                                        className="transition hover:bg-slate-50/70"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                    <Hash
                                                        size={
                                                            18
                                                        }
                                                    />
                                                </div>

                                                <span className="font-bold text-slate-900">
                                                    {
                                                        tag.name
                                                    }
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <code className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs text-slate-600">
                                                {
                                                    tag.slug
                                                }
                                            </code>
                                        </td>

                                        <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                                            {
                                                tag.posts
                                            }
                                        </td>

                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {
                                                tag.createdAt
                                            }
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-1">
                                                <button
                                                    onClick={() =>
                                                        openEdit(
                                                            tag
                                                        )
                                                    }
                                                    className="rounded-xl p-2.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                                                >
                                                    <Edit3
                                                        size={
                                                            17
                                                        }
                                                    />
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        setDeleteTarget(
                                                            tag
                                                        )
                                                    }
                                                    className="rounded-xl p-2.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                                                >
                                                    <Trash2
                                                        size={
                                                            17
                                                        }
                                                    />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile */}

                <div className="divide-y divide-slate-100 md:hidden">
                    {filteredTags.map(
                        (tag) => (
                            <article
                                key={tag.id}
                                className="p-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                        <Hash
                                            size={
                                                18
                                            }
                                        />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-3">
                                            <h3 className="font-bold text-slate-900">
                                                {
                                                    tag.name
                                                }
                                            </h3>

                                            <span className="text-xs font-semibold text-slate-400">
                                                {
                                                    tag.posts
                                                }{" "}
                                                posts
                                            </span>
                                        </div>

                                        <p className="mt-1 text-xs text-slate-400">
                                            {
                                                tag.slug
                                            }
                                        </p>
                                    </div>

                                    <div className="flex shrink-0 gap-1">
                                        <button
                                            onClick={() =>
                                                openEdit(
                                                    tag
                                                )
                                            }
                                            className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                                        >
                                            <Edit3
                                                size={
                                                    16
                                                }
                                            />
                                        </button>

                                        <button
                                            onClick={() =>
                                                setDeleteTarget(
                                                    tag
                                                )
                                            }
                                            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                                        >
                                            <Trash2
                                                size={
                                                    16
                                                }
                                            />
                                        </button>
                                    </div>
                                </div>
                            </article>
                        )
                    )}
                </div>

                {!filteredTags.length && (
                    <div className="py-20 text-center">
                        <Hash
                            size={36}
                            className="mx-auto text-slate-300"
                        />

                        <h3 className="mt-4 font-black text-slate-900">
                            No tags found
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Try another search term.
                        </p>
                    </div>
                )}
            </section>

            {/* Form Modal */}

            {showForm && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            closeForm();
                        }
                    }}
                >
                    <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-100 p-6">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                                    {editing
                                        ? "Edit"
                                        : "Create"}
                                </p>

                                <h2 className="mt-1 text-xl font-black text-slate-900">
                                    {editing
                                        ? "Edit Tag"
                                        : "New Tag"}
                                </h2>
                            </div>

                            <button
                                onClick={
                                    closeForm
                                }
                                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="space-y-5 p-6"
                        >
                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                    Tag Name
                                </label>

                                <input
                                    value={name}
                                    onChange={(event) =>
                                        handleNameChange(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="e.g. Artificial Intelligence"
                                    required
                                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                    Slug
                                </label>

                                <input
                                    value={slug}
                                    onChange={(event) => {
                                        setSlug(
                                            createSlug(
                                                event
                                                    .target
                                                    .value
                                            )
                                        );
                                        setSlugEdited(
                                            true
                                        );
                                    }}
                                    placeholder="artificial-intelligence"
                                    required
                                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                />
                            </div>

                            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={
                                        closeForm
                                    }
                                    className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-bold text-slate-600 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="h-11 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
                                >
                                    {editing
                                        ? "Save Changes"
                                        : "Create Tag"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}

            {deleteTarget && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                            <Trash2 size={21} />
                        </div>

                        <h2 className="mt-5 text-xl font-black text-slate-900">
                            Delete tag?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Delete{" "}
                            <strong className="text-slate-700">
                                {
                                    deleteTarget.name
                                }
                            </strong>
                            ?
                        </p>

                        {deleteTarget.posts >
                            0 && (
                                <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-700">
                                    This tag is currently
                                    attached to{" "}
                                    {
                                        deleteTarget.posts
                                    }{" "}
                                    articles. Production deletion
                                    should verify article references.
                                </div>
                            )}

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                onClick={() =>
                                    setDeleteTarget(
                                        null
                                    )
                                }
                                className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-bold text-slate-600 hover:bg-slate-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={
                                    deleteTag
                                }
                                className="h-11 rounded-xl bg-red-600 px-5 text-sm font-bold text-white hover:bg-red-700"
                            >
                                Delete Tag
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}