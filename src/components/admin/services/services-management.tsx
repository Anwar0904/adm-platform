"use client";

import { FormEvent, useMemo, useState } from "react";
import {
    Edit3,
    Eye,
    FolderKanban,
    Plus,
    Search,
    Trash2,
    X,
} from "lucide-react";

type ServiceStatus = "Published" | "Draft";

type Service = {
    id: string;
    title: string;
    slug: string;
    description: string;
    icon: string;
    status: ServiceStatus;
    featured: boolean;
    projects: number;
    createdAt: string;
};

const initialServices: Service[] = [
    {
        id: "1",
        title: "Web Development",
        slug: "web-development",
        description:
            "Modern, scalable and high-performance web applications built for businesses.",
        icon: "Globe",
        status: "Published",
        featured: true,
        projects: 12,
        createdAt: "Jul 20, 2026",
    },
    {
        id: "2",
        title: "AI & Machine Learning",
        slug: "ai-machine-learning",
        description:
            "Practical AI solutions, intelligent automation and machine learning systems.",
        icon: "Brain",
        status: "Published",
        featured: true,
        projects: 8,
        createdAt: "Jul 18, 2026",
    },
    {
        id: "3",
        title: "UI / UX Design",
        slug: "ui-ux-design",
        description:
            "Premium user experiences and interfaces designed around real business goals.",
        icon: "Palette",
        status: "Published",
        featured: true,
        projects: 15,
        createdAt: "Jul 15, 2026",
    },
    {
        id: "4",
        title: "Cloud & DevOps",
        slug: "cloud-devops",
        description:
            "Reliable cloud infrastructure, deployment pipelines and DevOps solutions.",
        icon: "Cloud",
        status: "Published",
        featured: false,
        projects: 6,
        createdAt: "Jul 12, 2026",
    },
    {
        id: "5",
        title: "Blockchain Development",
        slug: "blockchain-development",
        description:
            "Secure decentralized applications and blockchain-based business solutions.",
        icon: "Blocks",
        status: "Draft",
        featured: false,
        projects: 4,
        createdAt: "Jul 8, 2026",
    },
    {
        id: "6",
        title: "Digital Marketing",
        slug: "digital-marketing",
        description:
            "Data-driven digital marketing strategies focused on visibility and growth.",
        icon: "Megaphone",
        status: "Published",
        featured: false,
        projects: 9,
        createdAt: "Jul 5, 2026",
    },
];

function createSlug(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export default function ServicesManagement() {
    const [services, setServices] =
        useState<Service[]>(initialServices);

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState<"All" | ServiceStatus>("All");

    const [showForm, setShowForm] =
        useState(false);

    const [editing, setEditing] =
        useState<Service | null>(null);

    const [deleteTarget, setDeleteTarget] =
        useState<Service | null>(null);

    const [title, setTitle] =
        useState("");

    const [slug, setSlug] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [icon, setIcon] =
        useState("Globe");

    const [status, setStatus] =
        useState<ServiceStatus>("Draft");

    const [featured, setFeatured] =
        useState(false);

    const [slugEdited, setSlugEdited] =
        useState(false);

    const filteredServices = useMemo(() => {
        const query =
            search.trim().toLowerCase();

        return services.filter((service) => {
            const matchesSearch =
                !query ||
                service.title
                    .toLowerCase()
                    .includes(query) ||
                service.slug
                    .toLowerCase()
                    .includes(query) ||
                service.description
                    .toLowerCase()
                    .includes(query);

            const matchesStatus =
                statusFilter === "All" ||
                service.status === statusFilter;

            return (
                matchesSearch &&
                matchesStatus
            );
        });
    }, [
        services,
        search,
        statusFilter,
    ]);

    function resetForm() {
        setTitle("");
        setSlug("");
        setDescription("");
        setIcon("Globe");
        setStatus("Draft");
        setFeatured(false);
        setEditing(null);
        setSlugEdited(false);
    }

    function openCreate() {
        resetForm();
        setShowForm(true);
    }

    function openEdit(service: Service) {
        setEditing(service);
        setTitle(service.title);
        setSlug(service.slug);
        setDescription(service.description);
        setIcon(service.icon);
        setStatus(service.status);
        setFeatured(service.featured);
        setSlugEdited(true);
        setShowForm(true);
    }

    function closeForm() {
        setShowForm(false);
        resetForm();
    }

    function handleTitleChange(
        value: string
    ) {
        setTitle(value);

        if (!slugEdited) {
            setSlug(createSlug(value));
        }
    }

    function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        const cleanTitle =
            title.trim();

        const cleanSlug =
            slug.trim() ||
            createSlug(cleanTitle);

        const cleanDescription =
            description.trim();

        if (
            !cleanTitle ||
            !cleanSlug ||
            !cleanDescription
        ) {
            return;
        }

        const duplicate = services.some(
            (service) =>
                service.slug === cleanSlug &&
                service.id !== editing?.id
        );

        if (duplicate) {
            alert(
                "A service with this slug already exists."
            );
            return;
        }

        if (editing) {
            setServices((current) =>
                current.map((service) =>
                    service.id === editing.id
                        ? {
                            ...service,
                            title: cleanTitle,
                            slug: cleanSlug,
                            description:
                                cleanDescription,
                            icon,
                            status,
                            featured,
                        }
                        : service
                )
            );
        } else {
            setServices((current) => [
                {
                    id: crypto.randomUUID(),
                    title: cleanTitle,
                    slug: cleanSlug,
                    description:
                        cleanDescription,
                    icon,
                    status,
                    featured,
                    projects: 0,
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

    function deleteService() {
        if (!deleteTarget) return;

        setServices((current) =>
            current.filter(
                (service) =>
                    service.id !==
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
                        Business
                    </p>

                    <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
                        Services
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                        Manage the services displayed across
                        the ADM website.
                    </p>
                </div>

                <button
                    onClick={openCreate}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                >
                    <Plus size={18} />
                    Add Service
                </button>
            </section>

            {/* Stats */}

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                        Total Services
                    </p>

                    <p className="mt-2 text-3xl font-black text-slate-900">
                        {services.length}
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                        Published
                    </p>

                    <p className="mt-2 text-3xl font-black text-emerald-600">
                        {
                            services.filter(
                                (service) =>
                                    service.status ===
                                    "Published"
                            ).length
                        }
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                        Drafts
                    </p>

                    <p className="mt-2 text-3xl font-black text-amber-600">
                        {
                            services.filter(
                                (service) =>
                                    service.status ===
                                    "Draft"
                            ).length
                        }
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                        Featured
                    </p>

                    <p className="mt-2 text-3xl font-black text-blue-600">
                        {
                            services.filter(
                                (service) =>
                                    service.featured
                            ).length
                        }
                    </p>
                </div>
            </section>

            {/* Toolbar */}

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative w-full lg:max-w-lg">
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
                            placeholder="Search services..."
                            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                        />
                    </div>

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
                                        | ServiceStatus
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

            {/* Desktop */}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="hidden overflow-x-auto md:block">
                    <table className="w-full min-w-[900px]">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/70">
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Service
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Status
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Projects
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Visibility
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
                            {filteredServices.map(
                                (service) => (
                                    <tr
                                        key={
                                            service.id
                                        }
                                        className="transition hover:bg-slate-50/70"
                                    >
                                        <td className="max-w-md px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                    <FolderKanban
                                                        size={
                                                            19
                                                        }
                                                    />
                                                </div>

                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="truncate font-bold text-slate-900">
                                                            {
                                                                service.title
                                                            }
                                                        </h3>

                                                        {service.featured && (
                                                            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600">
                                                                FEATURED
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="mt-1 truncate text-xs text-slate-400">
                                                        {
                                                            service.description
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${service.status ===
                                                        "Published"
                                                        ? "bg-emerald-50 text-emerald-700"
                                                        : "bg-amber-50 text-amber-700"
                                                    }`}
                                            >
                                                {
                                                    service.status
                                                }
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-sm font-bold text-slate-700">
                                            {
                                                service.projects
                                            }
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-500">
                                                {service.featured
                                                    ? "Featured"
                                                    : "Standard"}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {
                                                service.createdAt
                                            }
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-1">
                                                <button
                                                    title="Preview"
                                                    className="rounded-xl p-2.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                                >
                                                    <Eye
                                                        size={
                                                            17
                                                        }
                                                    />
                                                </button>

                                                <button
                                                    title="Edit"
                                                    onClick={() =>
                                                        openEdit(
                                                            service
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
                                                    title="Delete"
                                                    onClick={() =>
                                                        setDeleteTarget(
                                                            service
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
                    {filteredServices.map(
                        (service) => (
                            <article
                                key={
                                    service.id
                                }
                                className="p-4"
                            >
                                <div className="flex gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                        <FolderKanban
                                            size={
                                                18
                                            }
                                        />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <h3 className="truncate font-bold text-slate-900">
                                                    {
                                                        service.title
                                                    }
                                                </h3>

                                                <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                                                    {
                                                        service.description
                                                    }
                                                </p>
                                            </div>

                                            <span
                                                className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${service.status ===
                                                        "Published"
                                                        ? "bg-emerald-50 text-emerald-700"
                                                        : "bg-amber-50 text-amber-700"
                                                    }`}
                                            >
                                                {
                                                    service.status
                                                }
                                            </span>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between">
                                            <div className="flex gap-3 text-xs text-slate-400">
                                                <span>
                                                    {
                                                        service.projects
                                                    }{" "}
                                                    projects
                                                </span>

                                                {service.featured && (
                                                    <span className="font-bold text-blue-600">
                                                        Featured
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() =>
                                                        openEdit(
                                                            service
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
                                                            service
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

                {!filteredServices.length && (
                    <div className="py-20 text-center">
                        <FolderKanban
                            size={38}
                            className="mx-auto text-slate-300"
                        />

                        <h3 className="mt-4 font-black text-slate-900">
                            No services found
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Try another search or filter.
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
                                    {editing
                                        ? "Edit Service"
                                        : "New Service"}
                                </p>

                                <h2 className="mt-1 text-xl font-black text-slate-900">
                                    {editing
                                        ? "Update Service"
                                        : "Create Service"}
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
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-slate-700">
                                        Service Name
                                    </label>

                                    <input
                                        value={
                                            title
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            handleTitleChange(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder="e.g. Web Development"
                                        required
                                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-bold text-slate-700">
                                        Slug
                                    </label>

                                    <input
                                        value={
                                            slug
                                        }
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

                                            setSlugEdited(
                                                true
                                            );
                                        }}
                                        placeholder="web-development"
                                        required
                                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                    />
                                </div>
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
                                    placeholder="Describe what ADM offers..."
                                    rows={4}
                                    required
                                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                />

                                <p className="mt-1 text-right text-xs text-slate-400">
                                    {
                                        description.length
                                    }{" "}
                                    characters
                                </p>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-slate-700">
                                        Icon
                                    </label>

                                    <select
                                        value={
                                            icon
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setIcon(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                    >
                                        <option value="Globe">
                                            Globe
                                        </option>
                                        <option value="Brain">
                                            Brain
                                        </option>
                                        <option value="Palette">
                                            Palette
                                        </option>
                                        <option value="Cloud">
                                            Cloud
                                        </option>
                                        <option value="Blocks">
                                            Blocks
                                        </option>
                                        <option value="Megaphone">
                                            Megaphone
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-bold text-slate-700">
                                        Status
                                    </label>

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
                                                    .value as ServiceStatus
                                            )
                                        }
                                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                    >
                                        <option value="Draft">
                                            Draft
                                        </option>

                                        <option value="Published">
                                            Published
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 hover:bg-slate-50">
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
                                        Feature this service
                                    </p>

                                    <p className="mt-0.5 text-xs text-slate-500">
                                        Show this service in
                                        featured service areas.
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
                                    className="h-11 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
                                >
                                    {editing
                                        ? "Save Changes"
                                        : "Create Service"}
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
                            Delete service?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Are you sure you want to
                            delete{" "}
                            <strong className="text-slate-700">
                                {
                                    deleteTarget.title
                                }
                            </strong>
                            ?
                        </p>

                        {deleteTarget.projects >
                            0 && (
                                <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-700">
                                    This service is associated
                                    with{" "}
                                    {
                                        deleteTarget.projects
                                    }{" "}
                                    projects. Production deletion
                                    should verify these references
                                    before removing it.
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
                                    deleteService
                                }
                                className="h-11 rounded-xl bg-red-600 px-5 text-sm font-bold text-white hover:bg-red-700"
                            >
                                Delete Service
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}