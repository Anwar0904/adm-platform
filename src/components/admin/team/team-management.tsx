"use client";

import { FormEvent, useMemo, useState } from "react";
import {
    Edit3,
    Mail,
    Plus,
    Search,
    Trash2,
    X,
} from "lucide-react";

type MemberStatus = "Active" | "Inactive";

type TeamMember = {
    id: string;
    name: string;
    role: string;
    department: string;
    email: string;
    bio: string;
    avatar: string;
    status: MemberStatus;
    featured: boolean;
};

const departments = [
    "Leadership",
    "Engineering",
    "Design",
    "Marketing",
    "AI & Data",
    "Cloud & DevOps",
];

const initialMembers: TeamMember[] = [
    {
        id: "1",
        name: "Sarah Johnson",
        role: "AI Research Lead",
        department: "AI & Data",
        email: "sarah@adm.com",
        bio: "Leads ADM's AI strategy, research and intelligent product initiatives.",
        avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&q=80",
        status: "Active",
        featured: true,
    },
    {
        id: "2",
        name: "Michael Chen",
        role: "Senior Full Stack Engineer",
        department: "Engineering",
        email: "michael@adm.com",
        bio: "Builds scalable web platforms and full-stack digital products.",
        avatar:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&q=80",
        status: "Active",
        featured: true,
    },
    {
        id: "3",
        name: "Emma Wilson",
        role: "UI/UX Director",
        department: "Design",
        email: "emma@adm.com",
        bio: "Shapes ADM's product experiences through research, systems and visual design.",
        avatar:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&q=80",
        status: "Active",
        featured: true,
    },
    {
        id: "4",
        name: "David Miller",
        role: "Cloud Architect",
        department: "Cloud & DevOps",
        email: "david@adm.com",
        bio: "Designs reliable cloud infrastructure and production deployment systems.",
        avatar:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&q=80",
        status: "Active",
        featured: false,
    },
];

export default function TeamManagement() {
    const [members, setMembers] =
        useState<TeamMember[]>(initialMembers);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] =
        useState<"All" | MemberStatus>("All");

    const [departmentFilter, setDepartmentFilter] =
        useState("All");

    const [showForm, setShowForm] =
        useState(false);

    const [editing, setEditing] =
        useState<TeamMember | null>(null);

    const [deleteTarget, setDeleteTarget] =
        useState<TeamMember | null>(null);

    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [department, setDepartment] =
        useState(departments[0]);
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [avatar, setAvatar] = useState("");
    const [status, setStatus] =
        useState<MemberStatus>("Active");
    const [featured, setFeatured] =
        useState(false);

    const filteredMembers = useMemo(() => {
        const query =
            search.trim().toLowerCase();

        return members.filter((member) => {
            const matchesSearch =
                !query ||
                member.name
                    .toLowerCase()
                    .includes(query) ||
                member.role
                    .toLowerCase()
                    .includes(query) ||
                member.email
                    .toLowerCase()
                    .includes(query) ||
                member.department
                    .toLowerCase()
                    .includes(query);

            const matchesStatus =
                statusFilter === "All" ||
                member.status === statusFilter;

            const matchesDepartment =
                departmentFilter === "All" ||
                member.department ===
                departmentFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesDepartment
            );
        });
    }, [
        members,
        search,
        statusFilter,
        departmentFilter,
    ]);

    function resetForm() {
        setName("");
        setRole("");
        setDepartment(departments[0]);
        setEmail("");
        setBio("");
        setAvatar("");
        setStatus("Active");
        setFeatured(false);
        setEditing(null);
    }

    function openCreate() {
        resetForm();
        setShowForm(true);
    }

    function openEdit(member: TeamMember) {
        setEditing(member);
        setName(member.name);
        setRole(member.role);
        setDepartment(member.department);
        setEmail(member.email);
        setBio(member.bio);
        setAvatar(member.avatar);
        setStatus(member.status);
        setFeatured(member.featured);
        setShowForm(true);
    }

    function closeForm() {
        setShowForm(false);
        resetForm();
    }

    function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        const values = {
            name: name.trim(),
            role: role.trim(),
            department,
            email: email.trim(),
            bio: bio.trim(),
            avatar: avatar.trim(),
            status,
            featured,
        };

        if (
            !values.name ||
            !values.role ||
            !values.email ||
            !values.bio ||
            !values.avatar
        ) {
            return;
        }

        if (editing) {
            setMembers((current) =>
                current.map((member) =>
                    member.id === editing.id
                        ? {
                            ...member,
                            ...values,
                        }
                        : member
                )
            );
        } else {
            setMembers((current) => [
                {
                    id: crypto.randomUUID(),
                    ...values,
                },
                ...current,
            ]);
        }

        closeForm();
    }

    function deleteMember() {
        if (!deleteTarget) return;

        setMembers((current) =>
            current.filter(
                (member) =>
                    member.id !==
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
                        Organization
                    </p>

                    <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
                        Team
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                        Manage the people who represent
                        ADM across the website.
                    </p>
                </div>

                <button
                    onClick={openCreate}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                >
                    <Plus size={18} />
                    Add Member
                </button>
            </section>

            {/* Stats */}

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Total Members"
                    value={members.length}
                />

                <StatCard
                    label="Active"
                    value={
                        members.filter(
                            (member) =>
                                member.status ===
                                "Active"
                        ).length
                    }
                    valueClass="text-emerald-600"
                />

                <StatCard
                    label="Inactive"
                    value={
                        members.filter(
                            (member) =>
                                member.status ===
                                "Inactive"
                        ).length
                    }
                    valueClass="text-amber-600"
                />

                <StatCard
                    label="Featured"
                    value={
                        members.filter(
                            (member) =>
                                member.featured
                        ).length
                    }
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
                                    event.target.value
                                )
                            }
                            placeholder="Search team members..."
                            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                        />
                    </div>

                    <select
                        value={
                            departmentFilter
                        }
                        onChange={(event) =>
                            setDepartmentFilter(
                                event.target.value
                            )
                        }
                        className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-600 outline-none focus:border-blue-500"
                    >
                        <option value="All">
                            All Departments
                        </option>

                        {departments.map(
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
                            "Active",
                            "Inactive",
                        ].map((filter) => (
                            <button
                                key={filter}
                                onClick={() =>
                                    setStatusFilter(
                                        filter as
                                        | "All"
                                        | MemberStatus
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

            {/* Members */}

            {filteredMembers.length > 0 ? (
                <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredMembers.map(
                        (member) => (
                            <article
                                key={member.id}
                                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="relative">
                                        <img
                                            src={
                                                member.avatar
                                            }
                                            alt={
                                                member.name
                                            }
                                            className="h-20 w-20 rounded-2xl object-cover ring-4 ring-slate-50"
                                        />

                                        <span
                                            className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${member.status ===
                                                    "Active"
                                                    ? "bg-emerald-500"
                                                    : "bg-slate-300"
                                                }`}
                                        />
                                    </div>

                                    <div className="flex gap-1">
                                        <button
                                            onClick={() =>
                                                openEdit(
                                                    member
                                                )
                                            }
                                            className="rounded-xl p-2.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                                            title="Edit"
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
                                                    member
                                                )
                                            }
                                            className="rounded-xl p-2.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                                            title="Delete"
                                        >
                                            <Trash2
                                                size={
                                                    16
                                                }
                                            />
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h2 className="text-lg font-black text-slate-900">
                                                {
                                                    member.name
                                                }
                                            </h2>

                                            <p className="mt-1 text-sm font-bold text-blue-600">
                                                {
                                                    member.role
                                                }
                                            </p>
                                        </div>

                                        {member.featured && (
                                            <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black text-blue-700">
                                                FEATURED
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-3 inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
                                        {
                                            member.department
                                        }
                                    </p>

                                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-500">
                                        {
                                            member.bio
                                        }
                                    </p>

                                    <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-400">
                                        <Mail
                                            size={
                                                14
                                            }
                                        />

                                        <span className="truncate">
                                            {
                                                member.email
                                            }
                                        </span>
                                    </div>
                                </div>
                            </article>
                        )
                    )}
                </section>
            ) : (
                <section className="rounded-2xl border border-slate-200 bg-white py-20 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                        <Plus size={24} />
                    </div>

                    <h2 className="mt-4 font-black text-slate-900">
                        No team members found
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Try changing your filters or search.
                    </p>
                </section>
            )}

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
                    <div className="my-auto w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-100 p-6">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                                    Team
                                </p>

                                <h2 className="mt-1 text-xl font-black text-slate-900">
                                    {editing
                                        ? "Edit Team Member"
                                        : "Add Team Member"}
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
                                <Field label="Full Name">
                                    <input
                                        value={
                                            name
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setName(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        required
                                        placeholder="e.g. Anwar Ul Haq"
                                        className="input"
                                    />
                                </Field>

                                <Field label="Role">
                                    <input
                                        value={
                                            role
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setRole(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        required
                                        placeholder="e.g. Senior Developer"
                                        className="input"
                                    />
                                </Field>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <Field label="Department">
                                    <select
                                        value={
                                            department
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setDepartment(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        className="input"
                                    >
                                        {departments.map(
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

                                <Field label="Email">
                                    <input
                                        type="email"
                                        value={
                                            email
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setEmail(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        required
                                        placeholder="member@adm.com"
                                        className="input"
                                    />
                                </Field>
                            </div>

                            <Field label="Avatar URL">
                                <input
                                    value={
                                        avatar
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setAvatar(
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

                            <Field label="Biography">
                                <textarea
                                    value={
                                        bio
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setBio(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    required
                                    rows={4}
                                    placeholder="Short professional biography..."
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
                                                    .value as MemberStatus
                                            )
                                        }
                                        className="input"
                                    >
                                        <option value="Active">
                                            Active
                                        </option>

                                        <option value="Inactive">
                                            Inactive
                                        </option>
                                    </select>
                                </Field>

                                <label className="flex cursor-pointer items-center gap-3 self-end rounded-xl border border-slate-200 p-4">
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
                                            Featured member
                                        </p>

                                        <p className="mt-0.5 text-xs text-slate-500">
                                            Show this member in
                                            prominent team
                                            sections.
                                        </p>
                                    </div>
                                </label>
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
                                    className="h-11 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
                                >
                                    {editing
                                        ? "Save Changes"
                                        : "Create Member"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}

            {deleteTarget && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                            <Trash2 size={21} />
                        </div>

                        <h2 className="mt-5 text-xl font-black text-slate-900">
                            Delete team member?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            This will remove{" "}
                            <strong className="text-slate-700">
                                {
                                    deleteTarget.name
                                }
                            </strong>{" "}
                            from the current team list.
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
                                    deleteMember
                                }
                                className="h-11 rounded-xl bg-red-600 px-5 text-sm font-bold text-white hover:bg-red-700"
                            >
                                Delete Member
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