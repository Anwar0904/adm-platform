"use client";

import { FormEvent, useMemo, useState } from "react";
import {
    Edit3,
    ExternalLink,
    FolderKanban,
    Plus,
    Search,
    Trash2,
    X,
} from "lucide-react";

type ProjectStatus = "Published" | "Draft";

type Project = {
    id: string;
    title: string;
    slug: string;
    client: string;
    category: string;
    description: string;
    image: string;
    status: ProjectStatus;
    featured: boolean;
    year: number;
};

const initialProjects: Project[] = [
    {
        id: "1",
        title: "ADM Digital Platform",
        slug: "adm-digital-platform",
        client: "ADM",
        category: "Web Development",
        description:
            "A modern digital platform designed to present ADM's services, portfolio and expertise.",
        image:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80",
        status: "Published",
        featured: true,
        year: 2026,
    },
    {
        id: "2",
        title: "AI Business Assistant",
        slug: "ai-business-assistant",
        client: "Private Client",
        category: "Artificial Intelligence",
        description:
            "An intelligent assistant designed to automate business workflows and customer interactions.",
        image:
            "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900&q=80",
        status: "Published",
        featured: true,
        year: 2026,
    },
    {
        id: "3",
        title: "E-Commerce Experience",
        slug: "ecommerce-experience",
        client: "Retail Brand",
        category: "Web Development",
        description:
            "A conversion-focused e-commerce experience with a streamlined shopping journey.",
        image:
            "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=80",
        status: "Published",
        featured: false,
        year: 2026,
    },
    {
        id: "4",
        title: "FinTech Dashboard",
        slug: "fintech-dashboard",
        client: "FinTech Startup",
        category: "UI / UX",
        description:
            "A data-rich financial dashboard focused on clarity, usability and performance.",
        image:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80",
        status: "Draft",
        featured: false,
        year: 2026,
    },
    {
        id: "5",
        title: "Blockchain Marketplace",
        slug: "blockchain-marketplace",
        client: "Web3 Startup",
        category: "Blockchain",
        description:
            "A decentralized marketplace experience built around secure Web3 interactions.",
        image:
            "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=900&q=80",
        status: "Draft",
        featured: false,
        year: 2026,
    },
];

const categories = [
    "Web Development",
    "Artificial Intelligence",
    "UI / UX",
    "Cloud & DevOps",
    "Blockchain",
    "Digital Marketing",
];

function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export default function PortfolioManagement() {
    const [projects, setProjects] =
        useState<Project[]>(initialProjects);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] =
        useState<"All" | ProjectStatus>("All");

    const [showForm, setShowForm] =
        useState(false);

    const [editing, setEditing] =
        useState<Project | null>(null);

    const [deleteTarget, setDeleteTarget] =
        useState<Project | null>(null);

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [client, setClient] = useState("");
    const [category, setCategory] =
        useState(categories[0]);
    const [description, setDescription] =
        useState("");
    const [image, setImage] = useState("");
    const [status, setStatus] =
        useState<ProjectStatus>("Draft");
    const [featured, setFeatured] =
        useState(false);
    const [year, setYear] = useState("2026");

    const [slugEdited, setSlugEdited] =
        useState(false);

    const filteredProjects = useMemo(() => {
        const query =
            search.trim().toLowerCase();

        return projects.filter((project) => {
            const matchesSearch =
                !query ||
                project.title
                    .toLowerCase()
                    .includes(query) ||
                project.client
                    .toLowerCase()
                    .includes(query) ||
                project.category
                    .toLowerCase()
                    .includes(query) ||
                project.slug
                    .toLowerCase()
                    .includes(query);

            const matchesStatus =
                statusFilter === "All" ||
                project.status === statusFilter;

            return (
                matchesSearch &&
                matchesStatus
            );
        });
    }, [
        projects,
        search,
        statusFilter,
    ]);

    function resetForm() {
        setTitle("");
        setSlug("");
        setClient("");
        setCategory(categories[0]);
        setDescription("");
        setImage("");
        setStatus("Draft");
        setFeatured(false);
        setYear("2026");
        setEditing(null);
        setSlugEdited(false);
    }

    function openCreate() {
        resetForm();
        setShowForm(true);
    }

    function openEdit(project: Project) {
        setEditing(project);
        setTitle(project.title);
        setSlug(project.slug);
        setClient(project.client);
        setCategory(project.category);
        setDescription(project.description);
        setImage(project.image);
        setStatus(project.status);
        setFeatured(project.featured);
        setYear(project.year.toString());
        setSlugEdited(true);
        setShowForm(true);
    }

    function closeForm() {
        setShowForm(false);
        resetForm();
    }

    function handleTitleChange(value: string) {
        setTitle(value);

        if (!slugEdited) {
            setSlug(slugify(value));
        }
    }

    function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        const cleanTitle = title.trim();
        const cleanSlug =
            slug.trim() ||
            slugify(cleanTitle);

        const cleanClient =
            client.trim();

        const cleanDescription =
            description.trim();

        if (
            !cleanTitle ||
            !cleanSlug ||
            !cleanClient ||
            !cleanDescription ||
            !image.trim()
        ) {
            return;
        }

        const duplicate = projects.some(
            (project) =>
                project.slug === cleanSlug &&
                project.id !== editing?.id
        );

        if (duplicate) {
            alert(
                "A project with this slug already exists."
            );
            return;
        }

        if (editing) {
            setProjects((current) =>
                current.map((project) =>
                    project.id === editing.id
                        ? {
                            ...project,
                            title: cleanTitle,
                            slug: cleanSlug,
                            client: cleanClient,
                            category,
                            description:
                                cleanDescription,
                            image: image.trim(),
                            status,
                            featured,
                            year:
                                Number(year) ||
                                2026,
                        }
                        : project
                )
            );
        } else {
            setProjects((current) => [
                {
                    id: crypto.randomUUID(),
                    title: cleanTitle,
                    slug: cleanSlug,
                    client: cleanClient,
                    category,
                    description:
                        cleanDescription,
                    image: image.trim(),
                    status,
                    featured,
                    year:
                        Number(year) || 2026,
                },
                ...current,
            ]);
        }

        closeForm();
    }

    function deleteProject() {
        if (!deleteTarget) return;

        setProjects((current) =>
            current.filter(
                (project) =>
                    project.id !==
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
                        Portfolio
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                        Manage the projects and case studies
                        displayed on the ADM website.
                    </p>
                </div>

                <button
                    onClick={openCreate}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                >
                    <Plus size={18} />
                    Add Project
                </button>
            </section>

            {/* Stats */}

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Total Projects"
                    value={projects.length}
                />

                <StatCard
                    label="Published"
                    value={
                        projects.filter(
                            (project) =>
                                project.status ===
                                "Published"
                        ).length
                    }
                    valueClass="text-emerald-600"
                />

                <StatCard
                    label="Drafts"
                    value={
                        projects.filter(
                            (project) =>
                                project.status ===
                                "Draft"
                        ).length
                    }
                    valueClass="text-amber-600"
                />

                <StatCard
                    label="Featured"
                    value={
                        projects.filter(
                            (project) =>
                                project.featured
                        ).length
                    }
                    valueClass="text-blue-600"
                />
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
                            placeholder="Search projects..."
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
                                        | ProjectStatus
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

            {/* Project Grid */}

            {filteredProjects.length > 0 ? (
                <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredProjects.map(
                        (project) => (
                            <article
                                key={project.id}
                                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl"
                            >
                                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                                    <img
                                        src={
                                            project.image
                                        }
                                        alt={
                                            project.title
                                        }
                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                    />

                                    <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
                                        <span
                                            className={`rounded-full px-3 py-1 text-[10px] font-black backdrop-blur ${project.status ===
                                                    "Published"
                                                    ? "bg-emerald-50/95 text-emerald-700"
                                                    : "bg-amber-50/95 text-amber-700"
                                                }`}
                                        >
                                            {
                                                project.status
                                            }
                                        </span>

                                        {project.featured && (
                                            <span className="rounded-full bg-blue-600 px-3 py-1 text-[10px] font-black text-white shadow-lg">
                                                FEATURED
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-blue-600">
                                                {
                                                    project.category
                                                }
                                            </p>

                                            <h2 className="mt-1 truncate text-lg font-black text-slate-900">
                                                {
                                                    project.title
                                                }
                                            </h2>
                                        </div>

                                        <span className="shrink-0 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
                                            {
                                                project.year
                                            }
                                        </span>
                                    </div>

                                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                                        {
                                            project.description
                                        }
                                    </p>

                                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                                        <p className="truncate text-xs font-semibold text-slate-400">
                                            {
                                                project.client
                                            }
                                        </p>

                                        <div className="flex gap-1">
                                            <button
                                                title="Preview"
                                                className="rounded-xl p-2.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                            >
                                                <ExternalLink
                                                    size={
                                                        16
                                                    }
                                                />
                                            </button>

                                            <button
                                                title="Edit"
                                                onClick={() =>
                                                    openEdit(
                                                        project
                                                    )
                                                }
                                                className="rounded-xl p-2.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                                            >
                                                <Edit3
                                                    size={
                                                        16
                                                    }
                                                />
                                            </button>

                                            <button
                                                title="Delete"
                                                onClick={() =>
                                                    setDeleteTarget(
                                                        project
                                                    )
                                                }
                                                className="rounded-xl p-2.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
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
                            </article>
                        )
                    )}
                </section>
            ) : (
                <section className="rounded-2xl border border-slate-200 bg-white py-20 text-center shadow-sm">
                    <FolderKanban
                        size={40}
                        className="mx-auto text-slate-300"
                    />

                    <h2 className="mt-4 font-black text-slate-900">
                        No projects found
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Try changing your search or filter.
                    </p>
                </section>
            )}

            {/* Form Modal */}

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
                    <div className="my-auto w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-100 p-6">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                                    {editing
                                        ? "Portfolio"
                                        : "New Project"}
                                </p>

                                <h2 className="mt-1 text-xl font-black text-slate-900">
                                    {editing
                                        ? "Edit Project"
                                        : "Create Project"}
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
                                <Field
                                    label="Project Title"
                                >
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
                                        required
                                        placeholder="e.g. Enterprise AI Platform"
                                        className="input"
                                    />
                                </Field>

                                <Field label="Slug">
                                    <input
                                        value={
                                            slug
                                        }
                                        onChange={(
                                            event
                                        ) => {
                                            setSlug(
                                                slugify(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            );

                                            setSlugEdited(
                                                true
                                            );
                                        }}
                                        required
                                        placeholder="enterprise-ai-platform"
                                        className="input"
                                    />
                                </Field>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <Field label="Client">
                                    <input
                                        value={
                                            client
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setClient(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        required
                                        placeholder="Client or company"
                                        className="input"
                                    />
                                </Field>

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
                            </div>

                            <Field label="Cover Image URL">
                                <input
                                    value={
                                        image
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setImage(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    required
                                    placeholder="https://..."
                                    className="input"
                                />
                            </Field>

                            <Field label="Description">
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
                                    rows={4}
                                    required
                                    placeholder="Describe the project..."
                                    className="input min-h-28 resize-none py-3"
                                />
                            </Field>

                            <div className="grid gap-5 sm:grid-cols-2">
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
                                                    .value as ProjectStatus
                                            )
                                        }
                                        className="input"
                                    >
                                        <option value="Draft">
                                            Draft
                                        </option>

                                        <option value="Published">
                                            Published
                                        </option>
                                    </select>
                                </Field>

                                <Field label="Year">
                                    <input
                                        type="number"
                                        min="2000"
                                        max="2100"
                                        value={
                                            year
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setYear(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        className="input"
                                    />
                                </Field>
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
                                        Featured project
                                    </p>

                                    <p className="mt-0.5 text-xs text-slate-500">
                                        Highlight this project
                                        across ADM portfolio
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
                                    className="h-11 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
                                >
                                    {editing
                                        ? "Save Changes"
                                        : "Create Project"}
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
                            Delete project?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            This will remove{" "}
                            <strong className="text-slate-700">
                                {
                                    deleteTarget.title
                                }
                            </strong>{" "}
                            from the current portfolio list.
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
                                    deleteProject
                                }
                                className="h-11 rounded-xl bg-red-600 px-5 text-sm font-bold text-white hover:bg-red-700"
                            >
                                Delete Project
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