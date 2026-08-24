"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

type ConsultationStatus =
    | "scheduled"
    | "completed"
    | "cancelled"
    | "rescheduled";

type MeetingType =
    | "zoom"
    | "in_person"
    | "phone";

interface Lead {
    _id: string;
    fullName?: string;
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    projectTitle?: string;
}

interface User {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
}

interface Consultation {
    _id: string;
    lead: Lead;
    assignedTo?: User | null;
    scheduledAt: string;
    duration: number;
    meetingType: MeetingType;
    meetingLink?: string;
    location?: string;
    agenda?: string;
    status: ConsultationStatus;
    notes?: {
        _id?: string;
        content: string;
        createdAt?: string;
        createdBy?: User;
    }[];
    createdAt: string;
    updatedAt: string;
}

interface ApiResult<T> {
    success: boolean;
    data: T;
    message?: string;
}

interface ConsultationListResponse {
    consultations: Consultation[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

const statusStyles: Record<
    ConsultationStatus,
    string
> = {
    scheduled:
        "bg-blue-50 text-blue-700 border-blue-100",
    completed:
        "bg-emerald-50 text-emerald-700 border-emerald-100",
    cancelled:
        "bg-red-50 text-red-700 border-red-100",
    rescheduled:
        "bg-amber-50 text-amber-700 border-amber-100",
};

const meetingLabels: Record<
    MeetingType,
    string
> = {
    zoom: "Online",
    in_person: "In Person",
    phone: "Phone",
};

function getLeadName(lead?: Lead) {
    return (
        lead?.fullName ||
        lead?.name ||
        "Unknown lead"
    );
}

function formatDate(date: string) {
    return new Intl.DateTimeFormat(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric",
        }
    ).format(new Date(date));
}

function formatTime(date: string) {
    return new Intl.DateTimeFormat(
        "en-US",
        {
            hour: "numeric",
            minute: "2-digit",
        }
    ).format(new Date(date));
}

function isToday(date: string) {
    const value = new Date(date);
    const now = new Date();

    return (
        value.getDate() === now.getDate() &&
        value.getMonth() === now.getMonth() &&
        value.getFullYear() ===
        now.getFullYear()
    );
}

function isUpcoming(
    consultation: Consultation
) {
    return (
        consultation.status === "scheduled" &&
        new Date(
            consultation.scheduledAt
        ) > new Date()
    );
}

export default function ConsultationsPage() {
    const [consultations, setConsultations] =
        useState<Consultation[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [status, setStatus] =
        useState("");

    const [meetingType, setMeetingType] =
        useState("");

    const [page, setPage] =
        useState(1);

    const [totalPages, setTotalPages] =
        useState(1);

    const [selected, setSelected] =
        useState<Consultation | null>(
            null
        );

    const [showCreate, setShowCreate] =
        useState(false);

    const [showNote, setShowNote] =
        useState(false);

    const [refreshing, setRefreshing] =
        useState(false);

    const fetchConsultations =
        useCallback(async () => {
            try {
                setLoading(true);
                setError("");

                const params =
                    new URLSearchParams();

                params.set(
                    "page",
                    String(page)
                );

                params.set("limit", "10");

                if (search.trim()) {
                    params.set(
                        "search",
                        search.trim()
                    );
                }

                if (status) {
                    params.set(
                        "status",
                        status
                    );
                }

                if (meetingType) {
                    params.set(
                        "meetingType",
                        meetingType
                    );
                }

                const response =
                    await fetch(
                        `/api/consultations?${params.toString()}`,
                        {
                            method: "GET",
                            credentials: "include",
                            cache: "no-store",
                        }
                    );

                const result =
                    (await response.json()) as ApiResult<ConsultationListResponse>;

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.message ||
                        "Failed to load consultations."
                    );
                }

                setConsultations(
                    result.data.consultations
                );

                setTotalPages(
                    result.data.pagination
                        .totalPages || 1
                );
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Something went wrong."
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        }, [
            page,
            search,
            status,
            meetingType,
        ]);

    useEffect(() => {
        const timer = setTimeout(
            fetchConsultations,
            300
        );

        return () =>
            clearTimeout(timer);
    }, [fetchConsultations]);

    const refresh = () => {
        setRefreshing(true);
        fetchConsultations();
    };

    const stats = useMemo(() => {
        const scheduled =
            consultations.filter(
                (item) =>
                    item.status ===
                    "scheduled"
            ).length;

        const today =
            consultations.filter(
                (item) =>
                    item.status ===
                    "scheduled" &&
                    isToday(
                        item.scheduledAt
                    )
            ).length;

        const completed =
            consultations.filter(
                (item) =>
                    item.status ===
                    "completed"
            ).length;

        const upcoming =
            consultations.filter(
                isUpcoming
            ).length;

        return {
            scheduled,
            today,
            completed,
            upcoming,
        };
    }, [consultations]);

    async function updateStatus(
        id: string,
        nextStatus: ConsultationStatus
    ) {
        try {
            const response =
                await fetch(
                    `/api/consultations/${id}/status`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        credentials: "include",
                        body: JSON.stringify({
                            status: nextStatus,
                        }),
                    }
                );

            const result =
                (await response.json()) as ApiResult<Consultation>;

            if (
                !response.ok ||
                !result.success
            ) {
                throw new Error(
                    result.message ||
                    "Failed to update status."
                );
            }

            setSelected(
                result.data
            );

            setConsultations(
                (current) =>
                    current.map((item) =>
                        item._id === id
                            ? result.data
                            : item
                    )
            );
        } catch (err) {
            alert(
                err instanceof Error
                    ? err.message
                    : "Failed to update status."
            );
        }
    }

    async function addNote(
        id: string,
        content: string
    ) {
        try {
            const response =
                await fetch(
                    `/api/consultations/${id}/notes`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        credentials: "include",
                        body: JSON.stringify({
                            content,
                        }),
                    }
                );

            const result =
                (await response.json()) as ApiResult<Consultation>;

            if (
                !response.ok ||
                !result.success
            ) {
                throw new Error(
                    result.message ||
                    "Failed to add note."
                );
            }

            setSelected(
                result.data
            );

            setConsultations(
                (current) =>
                    current.map((item) =>
                        item._id === id
                            ? result.data
                            : item
                    )
            );

            setShowNote(false);
        } catch (err) {
            alert(
                err instanceof Error
                    ? err.message
                    : "Failed to add note."
            );
        }
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-[1600px] space-y-6">
                {/* Header */}
                <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                            <span>Admin</span>
                            <span>/</span>
                            <span className="text-slate-900">
                                Consultations
                            </span>
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                            Consultation Management
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Manage scheduled meetings,
                            leads and consultation activity.
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={refresh}
                            disabled={refreshing}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
                        >
                            <svg
                                className={`h-4 w-4 ${refreshing
                                        ? "animate-spin"
                                        : ""
                                    }`}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M20 11a8.1 8.1 0 0 0-15.5-3M4 5v4h4M4 13a8.1 8.1 0 0 0 15.5 3M20 19v-4h-4" />
                            </svg>
                            Refresh
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setShowCreate(true)
                            }
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                        >
                            <span className="text-lg leading-none">
                                +
                            </span>
                            New Consultation
                        </button>
                    </div>
                </header>

                {/* Stats */}
                <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    <StatCard
                        label="Scheduled"
                        value={stats.scheduled}
                        icon="calendar"
                    />

                    <StatCard
                        label="Today"
                        value={stats.today}
                        icon="clock"
                    />

                    <StatCard
                        label="Upcoming"
                        value={stats.upcoming}
                        icon="upcoming"
                    />

                    <StatCard
                        label="Completed"
                        value={stats.completed}
                        icon="check"
                    />
                </section>

                {/* Filters */}
                <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
                    <div className="flex flex-col gap-3 xl:flex-row">
                        <div className="relative min-w-0 flex-1">
                            <svg
                                className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <circle
                                    cx="11"
                                    cy="11"
                                    r="7"
                                />
                                <path d="m20 20-4-4" />
                            </svg>

                            <input
                                value={search}
                                onChange={(event) => {
                                    setPage(1);
                                    setSearch(
                                        event.target.value
                                    );
                                }}
                                placeholder="Search consultations..."
                                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                            />
                        </div>

                        <select
                            value={status}
                            onChange={(event) => {
                                setPage(1);
                                setStatus(
                                    event.target.value
                                );
                            }}
                            className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-slate-400"
                        >
                            <option value="">
                                All statuses
                            </option>
                            <option value="scheduled">
                                Scheduled
                            </option>
                            <option value="completed">
                                Completed
                            </option>
                            <option value="rescheduled">
                                Rescheduled
                            </option>
                            <option value="cancelled">
                                Cancelled
                            </option>
                        </select>

                        <select
                            value={meetingType}
                            onChange={(event) => {
                                setPage(1);
                                setMeetingType(
                                    event.target.value
                                );
                            }}
                            className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-slate-400"
                        >
                            <option value="">
                                All meeting types
                            </option>
                            <option value="zoom">
                                Online
                            </option>
                            <option value="in_person">
                                In Person
                            </option>
                            <option value="phone">
                                Phone
                            </option>
                        </select>
                    </div>
                </section>

                {/* Error */}
                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Table */}
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/80">
                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Lead
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Schedule
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Meeting
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Assigned
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Status
                                    </th>

                                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    Array.from({
                                        length: 6,
                                    }).map((_, index) => (
                                        <SkeletonRow
                                            key={index}
                                        />
                                    ))
                                ) : consultations.length ===
                                    0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-5 py-16 text-center"
                                        >
                                            <div className="mx-auto flex max-w-sm flex-col items-center">
                                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                                                    <svg
                                                        className="h-6 w-6"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.7"
                                                    >
                                                        <rect
                                                            x="3"
                                                            y="4"
                                                            width="18"
                                                            height="17"
                                                            rx="2"
                                                        />
                                                        <path d="M16 2v4M8 2v4M3 9h18" />
                                                    </svg>
                                                </div>

                                                <h3 className="font-semibold text-slate-900">
                                                    No consultations found
                                                </h3>

                                                <p className="mt-1 text-sm text-slate-500">
                                                    Try changing your filters
                                                    or create a new consultation.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    consultations.map(
                                        (consultation) => (
                                            <ConsultationRow
                                                key={
                                                    consultation._id
                                                }
                                                consultation={
                                                    consultation
                                                }
                                                onOpen={() =>
                                                    setSelected(
                                                        consultation
                                                    )
                                                }
                                            />
                                        )
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {!loading &&
                        consultations.length > 0 && (
                            <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm text-slate-500">
                                    Page{" "}
                                    <span className="font-medium text-slate-700">
                                        {page}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-medium text-slate-700">
                                        {totalPages}
                                    </span>
                                </p>

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        disabled={
                                            page <= 1
                                        }
                                        onClick={() =>
                                            setPage(
                                                (value) =>
                                                    value - 1
                                            )
                                        }
                                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Previous
                                    </button>

                                    <button
                                        type="button"
                                        disabled={
                                            page >=
                                            totalPages
                                        }
                                        onClick={() =>
                                            setPage(
                                                (value) =>
                                                    value + 1
                                            )
                                        }
                                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                </section>
            </div>

            {/* Details Drawer */}
            {selected && (
                <ConsultationDrawer
                    consultation={selected}
                    onClose={() =>
                        setSelected(null)
                    }
                    onStatusChange={
                        updateStatus
                    }
                    onAddNote={() =>
                        setShowNote(true)
                    }
                />
            )}

            {/* Note Modal */}
            {showNote &&
                selected && (
                    <NoteModal
                        onClose={() =>
                            setShowNote(false)
                        }
                        onSubmit={(content) =>
                            addNote(
                                selected._id,
                                content
                            )
                        }
                    />
                )}

            {/* Create Modal */}
            {showCreate && (
                <CreateConsultationModal
                    onClose={() =>
                        setShowCreate(false)
                    }
                    onCreated={() => {
                        setShowCreate(false);
                        setPage(1);
                        fetchConsultations();
                    }}
                />
            )}
        </div>
    );
}

function StatCard({
    label,
    value,
    icon,
}: {
    label: string;
    value: number;
    icon: string;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-medium text-slate-500 sm:text-sm">
                        {label}
                    </p>

                    <p className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">
                        {value}
                    </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    {icon === "check" ? (
                        <span>✓</span>
                    ) : icon === "clock" ? (
                        <span>◷</span>
                    ) : icon ===
                        "upcoming" ? (
                        <span>↗</span>
                    ) : (
                        <span>▣</span>
                    )}
                </div>
            </div>
        </div>
    );
}

function ConsultationRow({
    consultation,
    onOpen,
}: {
    consultation: Consultation;
    onOpen: () => void;
}) {
    const lead =
        consultation.lead;

    return (
        <tr className="group transition hover:bg-slate-50/70">
            <td className="px-5 py-4">
                <button
                    type="button"
                    onClick={onOpen}
                    className="text-left"
                >
                    <p className="font-semibold text-slate-900 group-hover:text-slate-700">
                        {getLeadName(lead)}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                        {lead?.email ||
                            "No email"}
                    </p>

                    {lead?.company && (
                        <p className="mt-1 text-xs text-slate-400">
                            {lead.company}
                        </p>
                    )}
                </button>
            </td>

            <td className="px-5 py-4">
                <p className="text-sm font-medium text-slate-900">
                    {formatDate(
                        consultation.scheduledAt
                    )}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                    {formatTime(
                        consultation.scheduledAt
                    )}{" "}
                    · {consultation.duration} min
                </p>

                {isToday(
                    consultation.scheduledAt
                ) && (
                        <span className="mt-1.5 inline-flex rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                            TODAY
                        </span>
                    )}
            </td>

            <td className="px-5 py-4">
                <p className="text-sm font-medium text-slate-800">
                    {
                        meetingLabels[
                        consultation
                            .meetingType
                        ]
                    }
                </p>

                {consultation.meetingType ===
                    "zoom" &&
                    consultation.meetingLink && (
                        <a
                            href={
                                consultation.meetingLink
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 inline-block text-xs font-medium text-blue-600 hover:underline"
                        >
                            Open meeting
                        </a>
                    )}

                {consultation.meetingType ===
                    "in_person" &&
                    consultation.location && (
                        <p className="mt-1 text-xs text-slate-500">
                            {consultation.location}
                        </p>
                    )}
            </td>

            <td className="px-5 py-4">
                {consultation.assignedTo ? (
                    <div>
                        <p className="text-sm font-medium text-slate-800">
                            {
                                consultation
                                    .assignedTo.name
                            }
                        </p>

                        <p className="text-xs text-slate-500">
                            {
                                consultation
                                    .assignedTo.email
                            }
                        </p>
                    </div>
                ) : (
                    <span className="text-sm text-slate-400">
                        Unassigned
                    </span>
                )}
            </td>

            <td className="px-5 py-4">
                <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[
                        consultation.status
                        ]
                        }`}
                >
                    {consultation.status}
                </span>
            </td>

            <td className="px-5 py-4 text-right">
                <button
                    type="button"
                    onClick={onOpen}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 opacity-100 transition hover:border-slate-300 hover:bg-white"
                >
                    View
                </button>
            </td>
        </tr>
    );
}

function SkeletonRow() {
    return (
        <tr>
            {Array.from({
                length: 6,
            }).map((_, index) => (
                <td
                    key={index}
                    className="px-5 py-5"
                >
                    <div className="animate-pulse space-y-2">
                        <div className="h-3 w-28 rounded bg-slate-200" />
                        <div className="h-2.5 w-20 rounded bg-slate-100" />
                    </div>
                </td>
            ))}
        </tr>
    );
}

function ConsultationDrawer({
    consultation,
    onClose,
    onStatusChange,
    onAddNote,
}: {
    consultation: Consultation;
    onClose: () => void;
    onStatusChange: (
        id: string,
        status: ConsultationStatus
    ) => void;
    onAddNote: () => void;
}) {
    const lead =
        consultation.lead;

    return (
        <div className="fixed inset-0 z-50">
            <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"
            />

            <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                            Consultation
                        </p>

                        <h2 className="mt-1 text-lg font-bold text-slate-950">
                            {getLeadName(lead)}
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-500 hover:bg-slate-100"
                    >
                        ×
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 sm:p-6">
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <span
                                    className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusStyles[
                                        consultation.status
                                        ]
                                        }`}
                                >
                                    {
                                        consultation.status
                                    }
                                </span>

                                <select
                                    value={
                                        consultation.status
                                    }
                                    onChange={(event) =>
                                        onStatusChange(
                                            consultation._id,
                                            event.target
                                                .value as ConsultationStatus
                                        )
                                    }
                                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium outline-none"
                                >
                                    <option value="scheduled">
                                        Scheduled
                                    </option>
                                    <option value="rescheduled">
                                        Rescheduled
                                    </option>
                                    <option value="completed">
                                        Completed
                                    </option>
                                    <option value="cancelled">
                                        Cancelled
                                    </option>
                                </select>
                            </div>
                        </div>

                        <DetailSection title="Lead Information">
                            <Detail
                                label="Name"
                                value={getLeadName(
                                    lead
                                )}
                            />

                            <Detail
                                label="Email"
                                value={
                                    lead?.email ||
                                    "—"
                                }
                            />

                            <Detail
                                label="Phone"
                                value={
                                    lead?.phone ||
                                    "—"
                                }
                            />

                            <Detail
                                label="Company"
                                value={
                                    lead?.company ||
                                    "—"
                                }
                            />

                            <Detail
                                label="Project"
                                value={
                                    lead?.projectTitle ||
                                    "—"
                                }
                            />
                        </DetailSection>

                        <DetailSection title="Meeting">
                            <Detail
                                label="Date"
                                value={formatDate(
                                    consultation.scheduledAt
                                )}
                            />

                            <Detail
                                label="Time"
                                value={`${formatTime(
                                    consultation.scheduledAt
                                )} · ${consultation.duration
                                    } minutes`}
                            />

                            <Detail
                                label="Type"
                                value={
                                    meetingLabels[
                                    consultation
                                        .meetingType
                                    ]
                                }
                            />

                            {consultation.meetingLink && (
                                <Detail
                                    label="Meeting Link"
                                    value={
                                        <a
                                            href={
                                                consultation.meetingLink
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                            className="font-medium text-blue-600 hover:underline"
                                        >
                                            Open meeting
                                        </a>
                                    }
                                />
                            )}

                            {consultation.location && (
                                <Detail
                                    label="Location"
                                    value={
                                        consultation.location
                                    }
                                />
                            )}
                        </DetailSection>

                        <DetailSection title="Assignment">
                            <Detail
                                label="Assigned To"
                                value={
                                    consultation.assignedTo
                                        ? consultation
                                            .assignedTo
                                            .name
                                        : "Unassigned"
                                }
                            />
                        </DetailSection>

                        {consultation.agenda && (
                            <DetailSection title="Agenda">
                                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                                    {
                                        consultation.agenda
                                    }
                                </p>
                            </DetailSection>
                        )}

                        <DetailSection title="Notes">
                            <div className="space-y-3">
                                {consultation.notes &&
                                    consultation.notes.length >
                                    0 ? (
                                    consultation.notes.map(
                                        (
                                            note,
                                            index
                                        ) => (
                                            <div
                                                key={
                                                    note._id ||
                                                    index
                                                }
                                                className="rounded-xl border border-slate-200 p-3"
                                            >
                                                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                                                    {
                                                        note.content
                                                    }
                                                </p>

                                                <p className="mt-2 text-[11px] text-slate-400">
                                                    {note.createdAt
                                                        ? formatDate(
                                                            note.createdAt
                                                        )
                                                        : ""}
                                                </p>
                                            </div>
                                        )
                                    )
                                ) : (
                                    <p className="text-sm text-slate-400">
                                        No notes yet.
                                    </p>
                                )}

                                <button
                                    type="button"
                                    onClick={onAddNote}
                                    className="w-full rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm font-medium text-slate-600 hover:border-slate-400 hover:bg-slate-50"
                                >
                                    + Add Note
                                </button>
                            </div>
                        </DetailSection>
                    </div>
                </div>

                <div className="border-t border-slate-200 p-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                        Close
                    </button>
                </div>
            </aside>
        </div>
    );
}

function DetailSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section>
            <h3 className="mb-3 text-sm font-bold text-slate-900">
                {title}
            </h3>

            <div className="space-y-3">
                {children}
            </div>
        </section>
    );
}

function Detail({
    label,
    value,
}: {
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1 border-b border-slate-100 pb-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <span className="text-xs font-medium text-slate-400">
                {label}
            </span>

            <span className="text-right text-sm font-medium text-slate-700">
                {value}
            </span>
        </div>
    );
}

function NoteModal({
    onClose,
    onSubmit,
}: {
    onClose: () => void;
    onSubmit: (
        content: string
    ) => void;
}) {
    const [content, setContent] =
        useState("");

    const [saving, setSaving] =
        useState(false);

    async function submit(
        event: React.FormEvent
    ) {
        event.preventDefault();

        if (!content.trim()) return;

        setSaving(true);

        try {
            await onSubmit(
                content.trim()
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
            <form
                onSubmit={submit}
                className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-950">
                        Add Consultation Note
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-xl text-slate-400"
                    >
                        ×
                    </button>
                </div>

                <textarea
                    value={content}
                    onChange={(event) =>
                        setContent(
                            event.target.value
                        )
                    }
                    rows={6}
                    autoFocus
                    placeholder="Write a note about this consultation..."
                    className="mt-5 w-full resize-none rounded-xl border border-slate-200 p-4 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                />

                <div className="mt-4 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={
                            saving ||
                            !content.trim()
                        }
                        className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                    >
                        {saving
                            ? "Saving..."
                            : "Add Note"}
                    </button>
                </div>
            </form>
        </div>
    );
}

function CreateConsultationModal({
    onClose,
    onCreated,
}: {
    onClose: () => void;
    onCreated: () => void;
}) {
    const [lead, setLead] =
        useState("");

    const [scheduledAt, setScheduledAt] =
        useState("");

    const [duration, setDuration] =
        useState("30");

    const [meetingType, setMeetingType] =
        useState<MeetingType>("zoom");

    const [meetingLink, setMeetingLink] =
        useState("");

    const [location, setLocation] =
        useState("");

    const [agenda, setAgenda] =
        useState("");

    const [saving, setSaving] =
        useState(false);

    async function submit(
        event: React.FormEvent
    ) {
        event.preventDefault();

        if (!lead || !scheduledAt) {
            alert(
                "Lead and schedule are required."
            );
            return;
        }

        if (
            meetingType === "zoom" &&
            !meetingLink
        ) {
            alert(
                "Meeting link is required."
            );
            return;
        }

        if (
            meetingType ===
            "in_person" &&
            !location
        ) {
            alert(
                "Location is required."
            );
            return;
        }

        setSaving(true);

        try {
            const response =
                await fetch(
                    "/api/consultations",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        credentials: "include",
                        body: JSON.stringify({
                            lead,
                            scheduledAt:
                                new Date(
                                    scheduledAt
                                ).toISOString(),
                            duration:
                                Number(duration),
                            meetingType,
                            meetingLink,
                            location,
                            agenda,
                        }),
                    }
                );

            const result =
                (await response.json()) as ApiResult<Consultation>;

            if (
                !response.ok ||
                !result.success
            ) {
                throw new Error(
                    result.message ||
                    "Failed to create consultation."
                );
            }

            onCreated();
        } catch (err) {
            alert(
                err instanceof Error
                    ? err.message
                    : "Failed to create consultation."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="fixed inset-0 z-[55] flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-sm">
            <form
                onSubmit={submit}
                className="my-8 w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
            >
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
                    <div>
                        <h2 className="text-lg font-bold text-slate-950">
                            New Consultation
                        </h2>

                        <p className="mt-0.5 text-xs text-slate-500">
                            Schedule a meeting for an existing lead.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-xl text-slate-400"
                    >
                        ×
                    </button>
                </div>

                <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
                    <Field
                        label="Lead ID"
                        required
                        className="sm:col-span-2"
                    >
                        <input
                            value={lead}
                            onChange={(event) =>
                                setLead(
                                    event.target.value
                                )
                            }
                            placeholder="Enter lead ID"
                            className="input"
                        />
                    </Field>

                    <Field
                        label="Date & Time"
                        required
                    >
                        <input
                            type="datetime-local"
                            value={scheduledAt}
                            onChange={(event) =>
                                setScheduledAt(
                                    event.target.value
                                )
                            }
                            className="input"
                        />
                    </Field>

                    <Field label="Duration">
                        <select
                            value={duration}
                            onChange={(event) =>
                                setDuration(
                                    event.target.value
                                )
                            }
                            className="input"
                        >
                            <option value="15">
                                15 minutes
                            </option>
                            <option value="30">
                                30 minutes
                            </option>
                            <option value="45">
                                45 minutes
                            </option>
                            <option value="60">
                                60 minutes
                            </option>
                            <option value="90">
                                90 minutes
                            </option>
                            <option value="120">
                                2 hours
                            </option>
                        </select>
                    </Field>

                    <Field label="Meeting Type">
                        <select
                            value={meetingType}
                            onChange={(event) =>
                                setMeetingType(
                                    event.target
                                        .value as MeetingType
                                )
                            }
                            className="input"
                        >
                            <option value="zoom">
                                Online
                            </option>
                            <option value="in_person">
                                In Person
                            </option>
                            <option value="phone">
                                Phone
                            </option>
                        </select>
                    </Field>

                    {meetingType ===
                        "zoom" && (
                            <Field
                                label="Meeting Link"
                                required
                            >
                                <input
                                    value={meetingLink}
                                    onChange={(event) =>
                                        setMeetingLink(
                                            event.target
                                                .value
                                        )
                                    }
                                    placeholder="https://..."
                                    className="input"
                                />
                            </Field>
                        )}

                    {meetingType ===
                        "in_person" && (
                            <Field
                                label="Location"
                                required
                            >
                                <input
                                    value={location}
                                    onChange={(event) =>
                                        setLocation(
                                            event.target
                                                .value
                                        )
                                    }
                                    placeholder="Office location"
                                    className="input"
                                />
                            </Field>
                        )}

                    <Field
                        label="Agenda"
                        className="sm:col-span-2"
                    >
                        <textarea
                            rows={5}
                            value={agenda}
                            onChange={(event) =>
                                setAgenda(
                                    event.target.value
                                )
                            }
                            placeholder="What will be discussed?"
                            className="input resize-none"
                        />
                    </Field>
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4 sm:px-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                    >
                        {saving
                            ? "Creating..."
                            : "Create Consultation"}
                    </button>
                </div>
            </form>
        </div>
    );
}

function Field({
    label,
    required,
    children,
    className = "",
}: {
    label: string;
    required?: boolean;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <label
            className={`block ${className}`}
        >
            <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                {label}
                {required && (
                    <span className="ml-1 text-red-500">
                        *
                    </span>
                )}
            </span>

            {children}
        </label>
    );
}