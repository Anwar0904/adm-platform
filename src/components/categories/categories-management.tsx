"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import {
    Check,
    ChevronLeft,
    Edit3,
    Folder,
    Plus,
    Search,
    Trash2,
    X,
} from "lucide-react";

type Category = {
    id: string;
    name: string;
    slug: string;
    description: string;
    posts: number;
    status: "active" | "inactive";
    createdAt: string;
};

const initialCategories: Category[] = [
    {
        id: "1",
        name: "Artificial Intelligence",
        slug: "artificial-intelligence",
        description:
            "AI, machine learning, LLMs and intelligent digital solutions.",
        posts: 12,
        status: "active",
        createdAt: "Jul 25, 2026",
    },
    {
        id: "2",
        name: "Web Development",
        slug: "web-development",
        description:
            "Modern web applications, architecture and engineering.",
        posts: 9,
        status: "active",
        createdAt: "Jul 20, 2026",
    },
    {
        id: "3",
        name: "Next.js",
        slug: "next-js",
        description:
            "Next.js development, performance and production practices.",
        posts: 7,
        status: "active",
        createdAt: "Jul 18, 2026",
    },
    {
        id: "4",
        name: "UI / UX",
        slug: "ui-ux",
        description:
            "Interface design, usability and digital experiences.",
        posts: 6,
        status: "active",
        createdAt: "Jul 15, 2026",
    },
    {
        id: "5",
        name: "Cloud",
        slug: "cloud",
        description:
            "Cloud infrastructure, deployment and scalable systems.",
        posts: 4,
        status: "active",
        createdAt: "Jul 10, 2026",
    },
    {
        id: "6",
        name: "DevOps",
        slug: "devops",
        description:
            "CI/CD, infrastructure automation and developer operations.",
        posts: 3,
        status: "active",
        createdAt: "Jul 8, 2026",
    },
    {
        id: "7",
        name: "Blockchain",
        slug: "blockchain",
        description:
            "Blockchain, Web3, smart contracts and decentralized applications.",
        posts: 5,
        status: "active",
        createdAt: "Jul 5, 2026",
    },
    {
        id: "8",
        name: "Digital Marketing",
        slug: "digital-marketing",
        description:
            "SEO, content strategy, growth and digital marketing.",
        posts: 4,
        status: "active",
        createdAt: "Jul 2, 2026",
    },
    {
        id: "9",
        name: "Case Studies",
        slug: "case-studies",
        description:
            "ADM projects, results and client success stories.",
        posts: 3,
        status: "active",
        createdAt: "Jun 28, 2026",
    },
    {
        id: "10",
        name: "Company News",
        slug: "company-news",
        description:
            "ADM announcements, culture and company updates.",
        posts: 2,
        status: "active",
        createdAt: "Jun 25, 2026",
    },
];

function createSlug(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export default function CategoriesManagement() {
    const [categories, setCategories] =
        useState<Category[]>(
            initialCategories
        );

    const [search, setSearch] =
        useState("");

    const [showForm, setShowForm] =
        useState(false);

    const [editing, setEditing] =
        useState<Category | null>(null);

    const [deleteTarget, setDeleteTarget] =
        useState<Category | null>(null);

    const [name, setName] =
        useState("");

    const [slug, setSlug] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [status, setStatus] =
        useState<
            "active" | "inactive"
        >("active");

    const [slugManuallyEdited, setSlugManuallyEdited] =
        useState(false);

    const filteredCategories = useMemo(() => {
        const query =
            search.trim().toLowerCase();

        if (!query) return categories;

        return categories.filter(
            (category) =>
                category.name
                    .toLowerCase()
                    .includes(query) ||
                category.slug
                    .toLowerCase()
                    .includes(query) ||
                category.description
                    .toLowerCase()
                    .includes(query)
        );
    }, [categories, search]);

    function resetForm() {
        setName("");
        setSlug("");
        setDescription("");
        setStatus("active");
        setEditing(null);
        setSlugManuallyEdited(false);
    }

    function openCreate() {
        resetForm();
        setShowForm(true);
    }

    function openEdit(
        category: Category
    ) {
        setEditing(category);
        setName(category.name);
        setSlug(category.slug);
        setDescription(
            category.description
        );
        setStatus(category.status);
        setSlugManuallyEdited(true);
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

        if (!slugManuallyEdited) {
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

        if (!cleanName || !cleanSlug)
            return;

        if (editing) {
            setCategories((current) =>
                current.map((category) =>
                    category.id ===
                        editing.id
                        ? {
                            ...category,
                            name: cleanName,
                            slug: cleanSlug,
                            description:
                                description.trim(),
                            status,
                        }
                        : category
                )
            );
        } else {
            const newCategory: Category =
            {
                id: crypto.randomUUID(),
                name: cleanName,
                slug: cleanSlug,
                description:
                    description.trim(),
                posts: 0,
                status,
                createdAt:
                    new Intl.DateTimeFormat(
                        "en-US",
                        {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        }
                    ).format(new Date()),
            };

            setCategories((current) => [
                newCategory,
                ...current,
            ]);
        }

        closeForm();
    }

    function confirmDelete() {
        if (!deleteTarget) return;

        setCategories((current) =>
            current.filter(
                (category) =>
                    category.id !==
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
                    <Link
                        href="/admin/blogs"
                        className="mb-3 inline-flex items-center gap-1 text-xs font-bold text-slate-400 transition hover:text-blue-600"
                    >
                        <ChevronLeft
                            size={14}
                        />
                        Blogs
                    </Link>

                    <p className="text-sm font-semibold text-blue-600">
                        Content
                    </p>

                    <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
                        Categories
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Organize ADM articles into clear,
                        searchable content categories.
                    </p>
                </div>

                <button
                    onClick={openCreate}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                >
                    <Plus size={18} />
                    Add Category
                </button>
            </section>

            {/* Stats */}

            <section className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                        Total Categories
                    </p>

                    <p className="mt-2 text-3xl font-black text-slate-900">
                        {categories.length}
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                        Active
                    </p>

                    <p className="mt-2 text-3xl font-black text-slate-900">
                        {
                            categories.filter(
                                (category) =>
                                    category.status ===
                                    "active"
                            ).length
                        }
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                        Articles Assigned
                    </p>

                    <p className="mt-2 text-3xl font-black text-slate-900">
                        {categories.reduce(
                            (total, category) =>
                                total +
                                category.posts,
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
                        placeholder="Search categories..."
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                </div>
            </section>

            {/* Category table */}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="hidden overflow-x-auto md:block">
                    <table className="w-full min-w-[760px]">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/70">
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Category
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Slug
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Articles
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Status
                                </th>

                                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {filteredCategories.map(
                                (category) => (
                                    <tr
                                        key={
                                            category.id
                                        }
                                        className="group transition hover:bg-slate-50/70"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                    <Folder
                                                        size={
                                                            19
                                                        }
                                                    />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="font-bold text-slate-900">
                                                        {
                                                            category.name
                                                        }
                                                    </p>

                                                    <p className="mt-0.5 max-w-sm truncate text-xs text-slate-400">
                                                        {
                                                            category.description
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <code className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs text-slate-600">
                                                /
                                                {
                                                    category.slug
                                                }
                                            </code>
                                        </td>

                                        <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                                            {
                                                category.posts
                                            }
                                        </td>

                                        <td className="px-6 py-4">
                                            <span
                                                className={[
                                                    "inline-flex rounded-full px-2.5 py-1 text-xs font-bold",
                                                    category.status ===
                                                        "active"
                                                        ? "bg-emerald-50 text-emerald-600"
                                                        : "bg-slate-100 text-slate-500",
                                                ].join(
                                                    " "
                                                )}
                                            >
                                                {
                                                    category.status
                                                }
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-1">
                                                <button
                                                    onClick={() =>
                                                        openEdit(
                                                            category
                                                        )
                                                    }
                                                    className="rounded-xl p-2.5 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                                                    title="Edit"
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
                                                            category
                                                        )
                                                    }
                                                    className="rounded-xl p-2.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                                                    title="Delete"
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

                {/* Mobile cards */}

                <div className="divide-y divide-slate-100 md:hidden">
                    {filteredCategories.map(
                        (category) => (
                            <article
                                key={
                                    category.id
                                }
                                className="p-4"
                            >
                                <div className="flex gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                        <Folder
                                            size={
                                                19
                                            }
                                        />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h3 className="font-bold text-slate-900">
                                                    {
                                                        category.name
                                                    }
                                                </h3>

                                                <p className="mt-1 text-xs text-slate-400">
                                                    /
                                                    {
                                                        category.slug
                                                    }
                                                </p>
                                            </div>

                                            <span
                                                className={[
                                                    "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold",
                                                    category.status ===
                                                        "active"
                                                        ? "bg-emerald-50 text-emerald-600"
                                                        : "bg-slate-100 text-slate-500",
                                                ].join(
                                                    " "
                                                )}
                                            >
                                                {
                                                    category.status
                                                }
                                            </span>
                                        </div>

                                        <p className="mt-3 text-sm leading-5 text-slate-500">
                                            {
                                                category.description
                                            }
                                        </p>

                                        <div className="mt-4 flex items-center justify-between">
                                            <span className="text-xs font-semibold text-slate-400">
                                                {
                                                    category.posts
                                                }{" "}
                                                articles
                                            </span>

                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() =>
                                                        openEdit(
                                                            category
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
                                                            category
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
                                    </div>
                                </div>
                            </article>
                        )
                    )}
                </div>

                {!filteredCategories.length && (
                    <div className="py-20 text-center">
                        <Folder
                            size={38}
                            className="mx-auto text-slate-300"
                        />

                        <h3 className="mt-4 font-black text-slate-900">
                            No categories found
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Try a different search term.
                        </p>
                    </div>
                )}
            </section>

            {/* Create / Edit modal */}

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
                    <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-100 p-6">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                                    {editing
                                        ? "Edit"
                                        : "Create"}
                                </p>

                                <h2 className="mt-1 text-xl font-black text-slate-900">
                                    {editing
                                        ? "Edit Category"
                                        : "New Category"}
                                </h2>
                            </div>

                            <button
                                onClick={
                                    closeForm
                                }
                                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X
                                    size={
                                        19
                                    }
                                />
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
                                    Name
                                </label>

                                <input
                                    value={name}
                                    onChange={(
                                        event
                                    ) =>
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
                                    onChange={(
                                        event
                                    ) => {
                                        setSlug(
                                            createSlug(
                                                event
                                                    .target
                                                    .value
                                            )
                                        );

                                        setSlugManuallyEdited(
                                            true
                                        );
                                    }}
                                    placeholder="artificial-intelligence"
                                    required
                                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                />

                                <p className="mt-1.5 text-xs text-slate-400">
                                    Used in the public category URL.
                                </p>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                    Description
                                </label>

                                <textarea
                                    value={
                                        description
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setDescription(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="Briefly describe this category..."
                                    rows={4}
                                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                    Status
                                </label>

                                <div className="grid grid-cols-2 gap-2">
                                    {(
                                        [
                                            "active",
                                            "inactive",
                                        ] as const
                                    ).map(
                                        (
                                            value
                                        ) => (
                                            <button
                                                key={
                                                    value
                                                }
                                                type="button"
                                                onClick={() =>
                                                    setStatus(
                                                        value
                                                    )
                                                }
                                                className={[
                                                    "flex h-11 items-center justify-center gap-2 rounded-xl border text-sm font-bold capitalize transition",
                                                    status ===
                                                        value
                                                        ? "border-blue-200 bg-blue-50 text-blue-600"
                                                        : "border-slate-200 text-slate-500 hover:bg-slate-50",
                                                ].join(
                                                    " "
                                                )}
                                            >
                                                {status ===
                                                    value && (
                                                        <Check
                                                            size={
                                                                15
                                                            }
                                                        />
                                                    )}

                                                {
                                                    value
                                                }
                                            </button>
                                        )
                                    )}
                                </div>
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
                                        : "Create Category"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete confirmation */}

            {deleteTarget && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                            <Trash2 size={21} />
                        </div>

                        <h2 className="mt-5 text-xl font-black text-slate-900">
                            Delete category?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            You are about to delete{" "}
                            <strong className="text-slate-700">
                                {
                                    deleteTarget.name
                                }
                            </strong>
                            .
                        </p>

                        {deleteTarget.posts >
                            0 && (
                                <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-700">
                                    This category currently
                                    contains{" "}
                                    {
                                        deleteTarget.posts
                                    }{" "}
                                    articles. In the production
                                    API, deletion should be blocked
                                    or require reassignment.
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
                                    confirmDelete
                                }
                                className="h-11 rounded-xl bg-red-600 px-5 text-sm font-bold text-white hover:bg-red-700"
                            >
                                Delete Category
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}