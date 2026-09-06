"use client";

import {
    FormEvent,
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    Edit3,
    GripVertical,
    Plus,
    Search,
    Trash2,
    X,
} from "lucide-react";

type FAQStatus = "Published" | "Draft";

type FAQ = {
    id: string;
    question: string;
    answer: string;
    category: string;
    status: FAQStatus;
    featured: boolean;
    order: number;
    createdAt: string;
};

const categories = [
    "General",
    "Services",
    "Process",
    "Pricing",
    "Technical",
];

type FAQApiRecord = {
    _id?: string;
    id?: string;
    question: string;
    answer: string;
    category?: string;
    featured?: boolean;
    status: string;
    sortOrder: number;
    createdAt: string;
};

type FAQListResponse = {
    faqs: FAQApiRecord[];
};

async function apiRequest<T>(
    url: string,
    options?: RequestInit
): Promise<T> {
    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    });

    const payload = (await response.json().catch(() => null)) as {
        data?: T;
        message?: string;
    } | null;

    if (!response.ok) {
        throw new Error(
            payload?.message ??
            "The FAQ request could not be completed."
        );
    }

    return payload?.data as T;
}

function mapFAQ(faq: FAQApiRecord): FAQ {
    return {
        id: faq._id ?? faq.id ?? "",
        question: faq.question,
        answer: faq.answer,
        category: faq.category ?? "General",
        status:
            faq.status === "published"
                ? "Published"
                : "Draft",
        featured: faq.featured ?? false,
        order: faq.sortOrder,
        createdAt: new Date(faq.createdAt)
            .toISOString()
            .slice(0, 10),
    };
}

async function fetchFAQs() {
    const result = await apiRequest<FAQListResponse>(
        "/api/faqs?limit=100&sort=sortOrder"
    );

    return result.faqs.map(mapFAQ);
}

export default function FAQsManagement() {
    const [faqs, setFaqs] =
        useState<FAQ[]>([]);

    const [isLoading, setIsLoading] =
        useState(true);

    const [isSaving, setIsSaving] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState<"All" | FAQStatus>("All");

    const [categoryFilter, setCategoryFilter] =
        useState("All");

    const [showForm, setShowForm] =
        useState(false);

    const [editing, setEditing] =
        useState<FAQ | null>(null);

    const [deleteTarget, setDeleteTarget] =
        useState<FAQ | null>(null);

    const [question, setQuestion] =
        useState("");

    const [answer, setAnswer] =
        useState("");

    const [category, setCategory] =
        useState("General");

    const [status, setStatus] =
        useState<FAQStatus>("Published");

    const [featured, setFeatured] =
        useState(false);

    useEffect(() => {
        fetchFAQs()
            .then(setFaqs)
            .catch((requestError: unknown) => {
                setError(
                    requestError instanceof Error
                        ? requestError.message
                        : "FAQs could not be loaded."
                );
            })
            .finally(() => setIsLoading(false));
    }, []);

    async function refreshFAQs() {
        setFaqs(await fetchFAQs());
    }

    const filteredFAQs = useMemo(() => {
        const query =
            search.trim().toLowerCase();

        return faqs
            .filter((faq) => {
                const matchesSearch =
                    !query ||
                    faq.question
                        .toLowerCase()
                        .includes(query) ||
                    faq.answer
                        .toLowerCase()
                        .includes(query);

                const matchesStatus =
                    statusFilter === "All" ||
                    faq.status === statusFilter;

                const matchesCategory =
                    categoryFilter === "All" ||
                    faq.category === categoryFilter;

                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesCategory
                );
            })
            .sort(
                (a, b) =>
                    a.order - b.order
            );
    }, [
        faqs,
        search,
        statusFilter,
        categoryFilter,
    ]);

    const publishedCount =
        faqs.filter(
            (faq) =>
                faq.status === "Published"
        ).length;

    const draftCount =
        faqs.filter(
            (faq) =>
                faq.status === "Draft"
        ).length;

    const featuredCount =
        faqs.filter(
            (faq) => faq.featured
        ).length;

    function resetForm() {
        setQuestion("");
        setAnswer("");
        setCategory("General");
        setStatus("Published");
        setFeatured(false);
        setEditing(null);
    }

    function openCreate() {
        resetForm();
        setShowForm(true);
    }

    function openEdit(faq: FAQ) {
        setEditing(faq);
        setQuestion(faq.question);
        setAnswer(faq.answer);
        setCategory(faq.category);
        setStatus(faq.status);
        setFeatured(faq.featured);
        setShowForm(true);
    }

    function closeForm() {
        setShowForm(false);
        resetForm();
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (
            !question.trim() ||
            !answer.trim()
        ) {
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            const payload = {
                question: question.trim(),
                answer: answer.trim(),
                category,
                status:
                    status === "Published"
                        ? "published"
                        : "draft",
                featured,
                ...(editing
                    ? {}
                    : {
                        sortOrder:
                            faqs.length > 0
                                ? Math.max(
                                    ...faqs.map(
                                        (faq) =>
                                            faq.order
                                    )
                                ) + 1
                                : 1,
                    }),
            };

            await apiRequest<FAQApiRecord>(
                editing
                    ? `/api/faqs/${editing.id}`
                    : "/api/faqs",
                {
                    method: editing
                        ? "PATCH"
                        : "POST",
                    body: JSON.stringify(
                        payload
                    ),
                }
            );

            await refreshFAQs();
            closeForm();
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "FAQ could not be saved."
            );
        } finally {
            setIsSaving(false);
        }
    }

    async function deleteFAQ() {
        if (!deleteTarget) return;

        setIsSaving(true);
        setError(null);

        try {
            await apiRequest<null>(
                `/api/faqs/${deleteTarget.id}`,
                { method: "DELETE" }
            );

            const remaining = faqs
                .filter(
                    (faq) =>
                        faq.id !==
                        deleteTarget.id
                )
                .sort((a, b) => a.order - b.order);

            await Promise.all(
                remaining.map((faq, index) =>
                    faq.order === index + 1
                        ? Promise.resolve()
                        : apiRequest<FAQApiRecord>(
                            `/api/faqs/${faq.id}`,
                            {
                                method: "PATCH",
                                body: JSON.stringify({
                                    sortOrder:
                                        index + 1,
                                }),
                            }
                        )
                )
            );

            await refreshFAQs();
            setDeleteTarget(null);
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "FAQ could not be deleted."
            );
        } finally {
            setIsSaving(false);
        }
    }

    async function moveFAQ(
        id: string,
        direction: "up" | "down"
    ) {
        const sorted = [...faqs].sort(
            (a, b) => a.order - b.order
        );
        const index = sorted.findIndex(
            (faq) => faq.id === id
        );
        const targetIndex =
            direction === "up"
                ? index - 1
                : index + 1;

        if (
            index === -1 ||
            targetIndex < 0 ||
            targetIndex >= sorted.length
        ) {
            return;
        }

        const currentFAQ = sorted[index];
        const targetFAQ = sorted[targetIndex];

        setIsSaving(true);
        setError(null);

        try {
            await Promise.all([
                apiRequest<FAQApiRecord>(
                    `/api/faqs/${currentFAQ.id}`,
                    {
                        method: "PATCH",
                        body: JSON.stringify({
                            sortOrder:
                                targetFAQ.order,
                        }),
                    }
                ),
                apiRequest<FAQApiRecord>(
                    `/api/faqs/${targetFAQ.id}`,
                    {
                        method: "PATCH",
                        body: JSON.stringify({
                            sortOrder:
                                currentFAQ.order,
                        }),
                    }
                ),
            ]);
            await refreshFAQs();
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "FAQ order could not be updated."
            );
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            {/* Header */}

            <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold text-blue-600">
                        Knowledge Base
                    </p>

                    <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
                        FAQs
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                        Manage frequently asked
                        questions shown across the
                        ADM website.
                    </p>
                </div>

                <button
                    onClick={openCreate}
                    disabled={isLoading || isSaving}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                >
                    <Plus size={18} />
                    Add FAQ
                </button>
            </section>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    {error}
                </div>
            )}

            {/* Stats */}

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Total FAQs"
                    value={faqs.length}
                />

                <StatCard
                    label="Published"
                    value={publishedCount}
                    valueClass="text-emerald-600"
                />

                <StatCard
                    label="Drafts"
                    value={draftCount}
                    valueClass="text-amber-600"
                />

                <StatCard
                    label="Featured"
                    value={featuredCount}
                    valueClass="text-blue-600"
                />
            </section>

            {/* Filters */}

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
                    <div className="relative">
                        <Search
                            size={18}
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event
                                        .target
                                        .value
                                )
                            }
                            placeholder="Search FAQs..."
                            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                        />
                    </div>

                    <select
                        value={
                            categoryFilter
                        }
                        onChange={(event) =>
                            setCategoryFilter(
                                event.target
                                    .value
                            )
                        }
                        className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-600 outline-none focus:border-blue-500"
                    >
                        <option value="All">
                            All Categories
                        </option>

                        {categories.map(
                            (item) => (
                                <option
                                    key={item}
                                    value={item}
                                >
                                    {item}
                                </option>
                            )
                        )}
                    </select>

                    <div className="flex gap-2 overflow-x-auto">
                        {[
                            "All",
                            "Published",
                            "Draft",
                        ].map((filter) => (
                            <button
                                key={filter}
                                onClick={() =>
                                    setStatusFilter(
                                        filter as
                                        | "All"
                                        | FAQStatus
                                    )
                                }
                                className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition ${statusFilter ===
                                    filter
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ List */}

            <section className="space-y-3">
                {isLoading ? (
                    <div className="rounded-2xl border border-slate-200 bg-white py-20 text-center text-sm font-semibold text-slate-500 shadow-sm">
                        Loading FAQs...
                    </div>
                ) : filteredFAQs.length > 0 ? (
                    filteredFAQs.map(
                        (faq, index) => (
                            <article
                                key={faq.id}
                                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                            >
                                <div className="flex gap-4">
                                    <div className="hidden shrink-0 items-center gap-1 sm:flex">
                                        <GripVertical
                                            size={
                                                18
                                            }
                                            className="text-slate-300"
                                        />

                                        <div className="flex flex-col gap-1">
                                            <button
                                                disabled={
                                                    isSaving ||
                                                    index ===
                                                    0
                                                }
                                                onClick={() =>
                                                    moveFAQ(
                                                        faq.id,
                                                        "up"
                                                    )
                                                }
                                                className="rounded-md px-1 text-[10px] font-black text-slate-400 hover:bg-slate-100 disabled:opacity-20"
                                            >
                                                ▲
                                            </button>

                                            <button
                                                disabled={
                                                    isSaving ||
                                                    index ===
                                                    filteredFAQs.length -
                                                    1
                                                }
                                                onClick={() =>
                                                    moveFAQ(
                                                        faq.id,
                                                        "down"
                                                    )
                                                }
                                                className="rounded-md px-1 text-[10px] font-black text-slate-400 hover:bg-slate-100 disabled:opacity-20"
                                            >
                                                ▼
                                            </button>
                                        </div>
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="text-xs font-black text-slate-300">
                                                        #
                                                        {String(
                                                            faq.order
                                                        ).padStart(
                                                            2,
                                                            "0"
                                                        )}
                                                    </span>

                                                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black text-blue-700">
                                                        {
                                                            faq.category
                                                        }
                                                    </span>

                                                    {faq.featured && (
                                                        <span className="rounded-full bg-purple-50 px-2.5 py-1 text-[10px] font-black text-purple-700">
                                                            FEATURED
                                                        </span>
                                                    )}

                                                    <span
                                                        className={`rounded-full px-2.5 py-1 text-[10px] font-black ${faq.status ===
                                                            "Published"
                                                            ? "bg-emerald-50 text-emerald-700"
                                                            : "bg-amber-50 text-amber-700"
                                                            }`}
                                                    >
                                                        {
                                                            faq.status
                                                        }
                                                    </span>
                                                </div>

                                                <h2 className="mt-3 text-base font-black leading-6 text-slate-900">
                                                    {
                                                        faq.question
                                                    }
                                                </h2>
                                            </div>

                                            <div className="flex shrink-0 gap-1">
                                                <button
                                                    disabled={
                                                        isSaving
                                                    }
                                                    onClick={() =>
                                                        openEdit(
                                                            faq
                                                        )
                                                    }
                                                    className="rounded-xl p-2.5 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                                                >
                                                    <Edit3
                                                        size={
                                                            16
                                                        }
                                                    />
                                                </button>

                                                <button
                                                    disabled={
                                                        isSaving
                                                    }
                                                    onClick={() =>
                                                        setDeleteTarget(
                                                            faq
                                                        )
                                                    }
                                                    className="rounded-xl p-2.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                                                >
                                                    <Trash2
                                                        size={
                                                            16
                                                        }
                                                    />
                                                </button>
                                            </div>
                                        </div>

                                        <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-500">
                                            {
                                                faq.answer
                                            }
                                        </p>

                                        <p className="mt-4 text-xs font-semibold text-slate-300">
                                            Added{" "}
                                            {
                                                faq.createdAt
                                            }
                                        </p>
                                    </div>
                                </div>
                            </article>
                        )
                    )
                ) : (
                    <div className="rounded-2xl border border-slate-200 bg-white py-20 text-center shadow-sm">
                        <h2 className="font-black text-slate-900">
                            No FAQs found
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            Try changing your search
                            or filters.
                        </p>
                    </div>
                )}
            </section>

            {/* Create / Edit Modal */}

            {showForm && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            closeForm();
                        }
                    }}
                >
                    <div className="my-auto w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-100 p-6">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                                    FAQ Management
                                </p>

                                <h2 className="mt-1 text-xl font-black text-slate-900">
                                    {editing
                                        ? "Edit FAQ"
                                        : "Add FAQ"}
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
                            <Field label="Question">
                                <input
                                    required
                                    value={
                                        question
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setQuestion(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="Enter the frequently asked question"
                                    className="input"
                                />
                            </Field>

                            <Field label="Answer">
                                <textarea
                                    required
                                    rows={7}
                                    value={
                                        answer
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setAnswer(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="Write a clear and helpful answer..."
                                    className="input min-h-40 resize-none py-3"
                                />
                            </Field>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <Field label="Category">
                                    <select
                                        value={
                                            category
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setCategory(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        className="input"
                                    >
                                        {categories.map(
                                            (
                                                item
                                            ) => (
                                                <option
                                                    key={
                                                        item
                                                    }
                                                    value={
                                                        item
                                                    }
                                                >
                                                    {
                                                        item
                                                    }
                                                </option>
                                            )
                                        )}
                                    </select>
                                </Field>

                                <Field label="Status">
                                    <select
                                        value={
                                            status
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setStatus(
                                                event
                                                    .target
                                                    .value as FAQStatus
                                            )
                                        }
                                        className="input"
                                    >
                                        <option value="Published">
                                            Published
                                        </option>

                                        <option value="Draft">
                                            Draft
                                        </option>
                                    </select>
                                </Field>
                            </div>

                            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4">
                                <input
                                    type="checkbox"
                                    checked={
                                        featured
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setFeatured(
                                            event
                                                .target
                                                .checked
                                        )
                                    }
                                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />

                                <div>
                                    <p className="text-sm font-bold text-slate-800">
                                        Featured FAQ
                                    </p>

                                    <p className="mt-0.5 text-xs text-slate-500">
                                        Allow this FAQ to
                                        appear in
                                        highlighted FAQ
                                        sections.
                                    </p>
                                </div>
                            </label>

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
                                    disabled={isSaving}
                                    className="h-11 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
                                >
                                    {editing
                                        ? "Save Changes"
                                        : "Create FAQ"}
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
                            Delete FAQ?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            This FAQ will be removed
                            from the current admin
                            list.
                        </p>

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
                                    deleteFAQ
                                }
                                disabled={isSaving}
                                className="h-11 rounded-xl bg-red-600 px-5 text-sm font-bold text-white hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({
    label,
    value,
    valueClass = "text-slate-900",
}: {
    label: string;
    value: number;
    valueClass?: string;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
                {label}
            </p>

            <p
                className={`mt-2 text-3xl font-black ${valueClass}`}
            >
                {value}
            </p>
        </div>
    );
}

function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
                {label}
            </label>

            {children}
        </div>
    );
}