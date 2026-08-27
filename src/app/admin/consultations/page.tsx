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

type LeadStatus =
    | "new"
    | "contacted"
    | "qualified"
    | "proposal"
    | "negotiation"
    | "converted"
    | "lost";

type LeadSource =
    | "website"
    | "referral"
    | "social_media"
    | "email"
    | "phone"
    | "other"
    | string;

interface User {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
}

interface Service {
    _id: string;
    name?: string;
    title?: string;
}

interface LeadNote {
    _id?: string;
    note: string;
    createdAt?: string;
    createdBy?: User | null;
}

interface Lead {
    _id: string;
    fullName: string;
    email: string;
    phone?: string;
    company?: string;
    website?: string;
    projectTitle?: string;
    projectType?: string;
    timeline?: string;
    preferredContact?: string;
    attachments?: string[];
    message?: string;
    budget?: {
        min?: number;
        max?: number;
        currency?: string;
        amount?: number;
        type?: string;
    } | null;
    notes?: LeadNote[];
    interestedServices?: Service[];
    assignedTo?: User | null;
    source?: LeadSource;
    status?: LeadStatus | string;
    contactedAt?: string;
    convertedAt?: string;
    createdBy?: User | null;
    updatedBy?: User | null;
    createdAt: string;
    updatedAt: string;
    isDeleted?: boolean;
    deletedAt?: string | null;
}

interface Consultation {
    _id: string;
    lead:
    | Lead
    | string
    | null;
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

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface ApiResult<T> {
    success: boolean;
    data: T;
    message?: string;
}

interface ConsultationListResponse {
    consultations: Consultation[];
    pagination: Pagination;
}

interface LeadListResponse {
    leads: Lead[];
    pagination: Pagination;
}

type ViewMode = "leads" | "consultations";

const leadStatusStyles: Record<string, string> = {
    new: "border-blue-100 bg-blue-50 text-blue-700",
    contacted:
        "border-indigo-100 bg-indigo-50 text-indigo-700",
    qualified:
        "border-violet-100 bg-violet-50 text-violet-700",
    proposal:
        "border-amber-100 bg-amber-50 text-amber-700",
    negotiation:
        "border-orange-100 bg-orange-50 text-orange-700",
    converted:
        "border-emerald-100 bg-emerald-50 text-emerald-700",
    lost: "border-red-100 bg-red-50 text-red-700",
};

const consultationStatusStyles: Record<
    ConsultationStatus,
    string
> = {
    scheduled:
        "border-blue-100 bg-blue-50 text-blue-700",
    completed:
        "border-emerald-100 bg-emerald-50 text-emerald-700",
    cancelled:
        "border-red-100 bg-red-50 text-red-700",
    rescheduled:
        "border-amber-100 bg-amber-50 text-amber-700",
};

const leadStatusOptions: LeadStatus[] = [
    "new",
    "contacted",
    "qualified",
    "proposal",
    "negotiation",
    "converted",
    "lost",
];

const meetingLabels: Record<
    MeetingType,
    string
> = {
    zoom: "Online",
    in_person: "In Person",
    phone: "Phone",
};

function getLeadName(
    lead?: Lead | null
) {
    return (
        lead?.fullName ||
        "Unknown lead"
    );
}

function formatDate(
    value?: string
) {
    if (!value) return "—";

    return new Intl.DateTimeFormat(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric",
        }
    ).format(new Date(value));
}

function formatDateTime(
    value?: string
) {
    if (!value) return "—";

    return new Intl.DateTimeFormat(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        }
    ).format(new Date(value));
}

function formatTime(
    value?: string
) {
    if (!value) return "—";

    return new Intl.DateTimeFormat(
        "en-US",
        {
            hour: "numeric",
            minute: "2-digit",
        }
    ).format(new Date(value));
}

function isToday(
    value?: string
) {
    if (!value) return false;

    const date = new Date(value);
    const now = new Date();

    return (
        date.getFullYear() ===
        now.getFullYear() &&
        date.getMonth() ===
        now.getMonth() &&
        date.getDate() ===
        now.getDate()
    );
}

function isUpcoming(
    consultation: Consultation
) {
    return (
        consultation.status ===
        "scheduled" &&
        new Date(
            consultation.scheduledAt
        ).getTime() >
        Date.now()
    );
}

function formatStatus(
    value?: string
) {
    if (!value) return "Unknown";

    return value
        .replaceAll("_", " ")
        .replace(
            /\b\w/g,
            (char) =>
                char.toUpperCase()
        );
}

export default function ConsultationsPage() {
    const [view, setView] =
        useState<ViewMode>("leads");

    const [leads, setLeads] =
        useState<Lead[]>([]);

    const [
        consultations,
        setConsultations,
    ] = useState<Consultation[]>([]);

    const [
        leadPagination,
        setLeadPagination,
    ] = useState<Pagination>({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
    });

    const [
        consultationPagination,
        setConsultationPagination,
    ] = useState<Pagination>({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
    });

    const [search, setSearch] =
        useState("");

    const [leadStatus, setLeadStatus] =
        useState("");

    const [
        consultationStatus,
        setConsultationStatus,
    ] = useState("");

    const [
        meetingType,
        setMeetingType,
    ] = useState("");

    const [
        leadSource,
        setLeadSource,
    ] = useState("");

    const [page, setPage] =
        useState(1);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");

    const [selectedLead, setSelectedLead] =
        useState<Lead | null>(null);

    const [
        selectedConsultation,
        setSelectedConsultation,
    ] =
        useState<Consultation | null>(
            null
        );

    const [
        showCreateConsultation,
        setShowCreateConsultation,
    ] = useState(false);

    const [
        showLeadNote,
        setShowLeadNote,
    ] = useState(false);

    const [
        showConsultationNote,
        setShowConsultationNote,
    ] = useState(false);

    const [actionLoading, setActionLoading] =
        useState(false);

    const activePagination =
        view === "leads"
            ? leadPagination
            : consultationPagination;

    const fetchLeads =
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

                if (leadStatus) {
                    params.set(
                        "status",
                        leadStatus
                    );
                }

                if (leadSource) {
                    params.set(
                        "source",
                        leadSource
                    );
                }

                const response =
                    await fetch(
                        `/api/leads?${params.toString()}`,
                        {
                            credentials:
                                "include",
                            cache: "no-store",
                        }
                    );

                const result =
                    (await response.json()) as ApiResult<LeadListResponse>;

                if (
                    !response.ok ||
                    !result.success
                ) {
                    throw new Error(
                        result.message ||
                        "Failed to load leads."
                    );
                }

                setLeads(
                    result.data.leads
                );

                setLeadPagination(
                    result.data.pagination
                );
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load leads."
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        }, [
            page,
            search,
            leadStatus,
            leadSource,
        ]);

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

                if (consultationStatus) {
                    params.set(
                        "status",
                        consultationStatus
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
                            credentials:
                                "include",
                            cache: "no-store",
                        }
                    );

                const result =
                    (await response.json()) as ApiResult<ConsultationListResponse>;

                if (
                    !response.ok ||
                    !result.success
                ) {
                    throw new Error(
                        result.message ||
                        "Failed to load consultations."
                    );
                }

                setConsultations(
                    result.data.consultations
                );

                setConsultationPagination(
                    result.data.pagination
                );
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load consultations."
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        }, [
            page,
            search,
            consultationStatus,
            meetingType,
        ]);

    useEffect(() => {
        const timer = setTimeout(
            () => {
                if (view === "leads") {
                    fetchLeads();
                } else {
                    fetchConsultations();
                }
            },
            300
        );

        return () =>
            clearTimeout(timer);
    }, [
        view,
        fetchLeads,
        fetchConsultations,
    ]);

    useEffect(() => {
        setPage(1);
        setSearch("");
        setError("");
    }, [view]);

    const refresh = () => {
        setRefreshing(true);

        if (view === "leads") {
            fetchLeads();
        } else {
            fetchConsultations();
        }
    };

    async function leadAction(
        id: string,
        action:
            | "status"
            | "assign"
            | "contacted"
            | "restore",
        value?: string
    ) {
        setActionLoading(true);

        try {
            let url =
                `/api/leads/${id}`;

            let body:
                | Record<string, unknown>
                | undefined;

            if (action === "status") {
                url += "/status";
                body = {
                    status: value,
                };
            }

            if (action === "assign") {
                url += "/assign";
                body = {
                    assignedTo: value,
                };
            }

            if (action === "contacted") {
                url += "/contacted";
            }

            if (action === "restore") {
                url += "/restore";
            }

            const response =
                await fetch(url, {
                    method: "PATCH",
                    headers: body
                        ? {
                            "Content-Type":
                                "application/json",
                        }
                        : undefined,
                    credentials:
                        "include",
                    body: body
                        ? JSON.stringify(body)
                        : undefined,
                });

            const result =
                (await response.json()) as ApiResult<Lead>;

            if (
                !response.ok ||
                !result.success
            ) {
                throw new Error(
                    result.message ||
                    "Lead action failed."
                );
            }

            const updated =
                result.data;

            setLeads((current) =>
                current.map((lead) =>
                    lead._id === id
                        ? updated
                        : lead
                )
            );

            if (
                selectedLead?._id === id
            ) {
                setSelectedLead(
                    updated
                );
            }
        } catch (err) {
            alert(
                err instanceof Error
                    ? err.message
                    : "Lead action failed."
            );
        } finally {
            setActionLoading(false);
        }
    }

    async function updateConsultationStatus(
        id: string,
        status: ConsultationStatus
    ) {
        setActionLoading(true);

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
                        credentials:
                            "include",
                        body: JSON.stringify({
                            status,
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
                    "Failed to update consultation."
                );
            }

            setSelectedConsultation(
                result.data
            );

            setConsultations(
                (current) =>
                    current.map(
                        (item) =>
                            item._id === id
                                ? result.data
                                : item
                    )
            );
        } catch (err) {
            alert(
                err instanceof Error
                    ? err.message
                    : "Failed to update consultation."
            );
        } finally {
            setActionLoading(false);
        }
    }

    async function addLeadNote(
        id: string,
        note: string
    ) {
        setActionLoading(true);

        try {
            const response =
                await fetch(
                    `/api/leads/${id}/notes`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        credentials:
                            "include",
                        body: JSON.stringify({
                            note,
                        }),
                    }
                );

            const result =
                (await response.json()) as ApiResult<Lead>;

            if (
                !response.ok ||
                !result.success
            ) {
                throw new Error(
                    result.message ||
                    "Failed to add note."
                );
            }

            setSelectedLead(
                result.data
            );

            setLeads((current) =>
                current.map((lead) =>
                    lead._id === id
                        ? result.data
                        : lead
                )
            );

            setShowLeadNote(false);
        } catch (err) {
            alert(
                err instanceof Error
                    ? err.message
                    : "Failed to add note."
            );
        } finally {
            setActionLoading(false);
        }
    }

    async function addConsultationNote(
        id: string,
        content: string
    ) {
        setActionLoading(true);

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
                        credentials:
                            "include",
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

            setSelectedConsultation(
                result.data
            );

            setConsultations(
                (current) =>
                    current.map(
                        (item) =>
                            item._id === id
                                ? result.data
                                : item
                    )
            );

            setShowConsultationNote(
                false
            );
        } catch (err) {
            alert(
                err instanceof Error
                    ? err.message
                    : "Failed to add note."
            );
        } finally {
            setActionLoading(false);
        }
    }

    const leadStats =
        useMemo(() => {
            return {
                total:
                    leadPagination.total,

                new: leads.filter(
                    (lead) =>
                        lead.status ===
                        "new"
                ).length,

                contacted: leads.filter(
                    (lead) =>
                        lead.status ===
                        "contacted"
                ).length,

                converted: leads.filter(
                    (lead) =>
                        lead.status ===
                        "converted"
                ).length,
            };
        }, [
            leads,
            leadPagination.total,
        ]);

    const consultationStats =
        useMemo(() => {
            return {
                total:
                    consultationPagination.total,

                today:
                    consultations.filter(
                        (item) =>
                            item.status ===
                            "scheduled" &&
                            isToday(
                                item.scheduledAt
                            )
                    ).length,

                upcoming:
                    consultations.filter(
                        isUpcoming
                    ).length,

                completed:
                    consultations.filter(
                        (item) =>
                            item.status ===
                            "completed"
                    ).length,
            };
        }, [
            consultations,
            consultationPagination.total,
        ]);

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-[1600px] space-y-6">
                <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                            <span>Admin</span>
                            <span>/</span>
                            <span className="text-slate-900">
                                CRM
                            </span>
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                            Leads & Consultations
                        </h1>

                        <p className="mt-1 max-w-2xl text-sm text-slate-500">
                            Manage incoming leads,
                            follow-ups, assignments,
                            consultations and client
                            communication from one place.
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={refresh}
                            disabled={refreshing}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
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

                        {view ===
                            "consultations" && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowCreateConsultation(
                                            true
                                        )
                                    }
                                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                                >
                                    <span className="text-lg">
                                        +
                                    </span>
                                    New Consultation
                                </button>
                            )}
                    </div>
                </header>

                <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
                    <button
                        type="button"
                        onClick={() =>
                            setView("leads")
                        }
                        className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${view === "leads"
                                ? "bg-slate-950 text-white"
                                : "text-slate-600 hover:bg-slate-50"
                            }`}
                    >
                        Leads
                        <span
                            className={`ml-2 rounded-md px-1.5 py-0.5 text-[10px] ${view ===
                                    "leads"
                                    ? "bg-white/15 text-white"
                                    : "bg-slate-100 text-slate-500"
                                }`}
                        >
                            {leadPagination.total}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setView(
                                "consultations"
                            )
                        }
                        className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${view ===
                                "consultations"
                                ? "bg-slate-950 text-white"
                                : "text-slate-600 hover:bg-slate-50"
                            }`}
                    >
                        Consultations
                        <span
                            className={`ml-2 rounded-md px-1.5 py-0.5 text-[10px] ${view ===
                                    "consultations"
                                    ? "bg-white/15 text-white"
                                    : "bg-slate-100 text-slate-500"
                                }`}
                        >
                            {
                                consultationPagination.total
                            }
                        </span>
                    </button>
                </div>

                {view === "leads" ? (
                    <>
                        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                            <StatCard
                                label="Total Leads"
                                value={
                                    leadStats.total
                                }
                                icon="users"
                            />
                            <StatCard
                                label="New"
                                value={
                                    leadStats.new
                                }
                                icon="spark"
                            />
                            <StatCard
                                label="Contacted"
                                value={
                                    leadStats.contacted
                                }
                                icon="phone"
                            />
                            <StatCard
                                label="Converted"
                                value={
                                    leadStats.converted
                                }
                                icon="check"
                            />
                        </section>

                        <LeadFilters
                            search={search}
                            setSearch={(value) => {
                                setPage(1);
                                setSearch(
                                    value
                                );
                            }}
                            status={
                                leadStatus
                            }
                            setStatus={(value) => {
                                setPage(1);
                                setLeadStatus(
                                    value
                                );
                            }}
                            source={
                                leadSource
                            }
                            setSource={(value) => {
                                setPage(1);
                                setLeadSource(
                                    value
                                );
                            }}
                        />

                        {error && (
                            <ErrorBox
                                message={
                                    error
                                }
                            />
                        )}

                        <LeadTable
                            leads={leads}
                            loading={loading}
                            onOpen={(lead) =>
                                setSelectedLead(
                                    lead
                                )
                            }
                        />
                    </>
                ) : (
                    <>
                        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                            <StatCard
                                label="Total"
                                value={
                                    consultationStats.total
                                }
                                icon="calendar"
                            />
                            <StatCard
                                label="Today"
                                value={
                                    consultationStats.today
                                }
                                icon="clock"
                            />
                            <StatCard
                                label="Upcoming"
                                value={
                                    consultationStats.upcoming
                                }
                                icon="upcoming"
                            />
                            <StatCard
                                label="Completed"
                                value={
                                    consultationStats.completed
                                }
                                icon="check"
                            />
                        </section>

                        <ConsultationFilters
                            search={search}
                            setSearch={(value) => {
                                setPage(1);
                                setSearch(
                                    value
                                );
                            }}
                            status={
                                consultationStatus
                            }
                            setStatus={(value) => {
                                setPage(1);
                                setConsultationStatus(
                                    value
                                );
                            }}
                            meetingType={
                                meetingType
                            }
                            setMeetingType={(
                                value
                            ) => {
                                setPage(1);
                                setMeetingType(
                                    value
                                );
                            }}
                        />

                        {error && (
                            <ErrorBox
                                message={
                                    error
                                }
                            />
                        )}

                        <ConsultationTable
                            consultations={
                                consultations
                            }
                            loading={loading}
                            onOpen={(
                                consultation
                            ) =>
                                setSelectedConsultation(
                                    consultation
                                )
                            }
                        />
                    </>
                )}

                {!loading &&
                    activePagination.total >
                    0 && (
                        <Pagination
                            page={page}
                            totalPages={
                                activePagination.totalPages
                            }
                            onPrevious={() =>
                                setPage(
                                    (value) =>
                                        Math.max(
                                            1,
                                            value -
                                            1
                                        )
                                )
                            }
                            onNext={() =>
                                setPage(
                                    (value) =>
                                        Math.min(
                                            activePagination.totalPages,
                                            value +
                                            1
                                        )
                                )
                            }
                        />
                    )}
            </div>

            {selectedLead && (
                <LeadDrawer
                    lead={selectedLead}
                    loading={actionLoading}
                    onClose={() =>
                        setSelectedLead(
                            null
                        )
                    }
                    onStatusChange={(
                        status
                    ) =>
                        leadAction(
                            selectedLead._id,
                            "status",
                            status
                        )
                    }
                    onAssign={(userId) =>
                        leadAction(
                            selectedLead._id,
                            "assign",
                            userId
                        )
                    }
                    onContacted={() =>
                        leadAction(
                            selectedLead._id,
                            "contacted"
                        )
                    }
                    onRestore={() =>
                        leadAction(
                            selectedLead._id,
                            "restore"
                        )
                    }
                    onAddNote={() =>
                        setShowLeadNote(
                            true
                        )
                    }
                />
            )}

            {selectedConsultation && (
                <ConsultationDrawer
                    consultation={
                        selectedConsultation
                    }
                    loading={actionLoading}
                    onClose={() =>
                        setSelectedConsultation(
                            null
                        )
                    }
                    onStatusChange={
                        updateConsultationStatus
                    }
                    onAddNote={() =>
                        setShowConsultationNote(
                            true
                        )
                    }
                />
            )}

            {showLeadNote &&
                selectedLead && (
                    <NoteModal
                        title="Add Lead Note"
                        placeholder="Write a note about this lead..."
                        loading={
                            actionLoading
                        }
                        onClose={() =>
                            setShowLeadNote(
                                false
                            )
                        }
                        onSubmit={(note) =>
                            addLeadNote(
                                selectedLead._id,
                                note
                            )
                        }
                    />
                )}

            {showConsultationNote &&
                selectedConsultation && (
                    <NoteModal
                        title="Add Consultation Note"
                        placeholder="Write a note about this consultation..."
                        loading={
                            actionLoading
                        }
                        onClose={() =>
                            setShowConsultationNote(
                                false
                            )
                        }
                        onSubmit={(content) =>
                            addConsultationNote(
                                selectedConsultation._id,
                                content
                            )
                        }
                    />
                )}

            {showCreateConsultation && (
                <CreateConsultationModal
                    leads={leads}
                    onClose={() =>
                        setShowCreateConsultation(
                            false
                        )
                    }
                    onCreated={() => {
                        setShowCreateConsultation(
                            false
                        );
                        setView(
                            "consultations"
                        );
                        setPage(1);
                        fetchConsultations();
                    }}
                />
            )}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Filters                                                                    */
/* -------------------------------------------------------------------------- */

function LeadFilters({
    search,
    setSearch,
    status,
    setStatus,
    source,
    setSource,
}: {
    search: string;
    setSearch: (value: string) => void;
    status: string;
    setStatus: (value: string) => void;
    source: string;
    setSource: (value: string) => void;
}) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
            <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px]">
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder="Search name, email, company..."
                />

                <select
                    value={status}
                    onChange={(event) =>
                        setStatus(
                            event.target.value
                        )
                    }
                    className="input"
                >
                    <option value="">
                        All statuses
                    </option>

                    {leadStatusOptions.map(
                        (item) => (
                            <option
                                key={item}
                                value={item}
                            >
                                {formatStatus(
                                    item
                                )}
                            </option>
                        )
                    )}
                </select>

                <select
                    value={source}
                    onChange={(event) =>
                        setSource(
                            event.target.value
                        )
                    }
                    className="input"
                >
                    <option value="">
                        All sources
                    </option>
                    <option value="website">
                        Website
                    </option>
                    <option value="referral">
                        Referral
                    </option>
                    <option value="social_media">
                        Social Media
                    </option>
                    <option value="email">
                        Email
                    </option>
                    <option value="phone">
                        Phone
                    </option>
                    <option value="other">
                        Other
                    </option>
                </select>
            </div>
        </section>
    );
}

function ConsultationFilters({
    search,
    setSearch,
    status,
    setStatus,
    meetingType,
    setMeetingType,
}: {
    search: string;
    setSearch: (value: string) => void;
    status: string;
    setStatus: (value: string) => void;
    meetingType: string;
    setMeetingType: (value: string) => void;
}) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
            <div className="grid gap-3 lg:grid-cols-[1fr_190px_190px]">
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder="Search consultations, leads..."
                />

                <select
                    value={status}
                    onChange={(event) =>
                        setStatus(
                            event.target.value
                        )
                    }
                    className="input"
                >
                    <option value="">
                        All statuses
                    </option>
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

                <select
                    value={meetingType}
                    onChange={(event) =>
                        setMeetingType(
                            event.target.value
                        )
                    }
                    className="input"
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
    );
}

function SearchInput({
    value,
    onChange,
    placeholder,
}: {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
}) {
    return (
        <div className="relative">
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
                value={value}
                onChange={(event) =>
                    onChange(
                        event.target.value
                    )
                }
                placeholder={placeholder}
                className="input pl-10"
            />
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Lead table                                                                 */
/* -------------------------------------------------------------------------- */

function LeadTable({
    leads,
    loading,
    onOpen,
}: {
    leads: Lead[];
    loading: boolean;
    onOpen: (lead: Lead) => void;
}) {
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px]">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/80">
                            <TableHead>
                                Lead
                            </TableHead>
                            <TableHead>
                                Project
                            </TableHead>
                            <TableHead>
                                Source
                            </TableHead>
                            <TableHead>
                                Assigned
                            </TableHead>
                            <TableHead>
                                Status
                            </TableHead>
                            <TableHead>
                                Created
                            </TableHead>
                            <TableHead align="right">
                                Action
                            </TableHead>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            Array.from({
                                length: 7,
                            }).map(
                                (_, index) => (
                                    <SkeletonRow
                                        key={
                                            index
                                        }
                                        columns={
                                            7
                                        }
                                    />
                                )
                            )
                        ) : leads.length ===
                            0 ? (
                            <EmptyRow
                                columns={7}
                                title="No leads found"
                                description="Try changing your filters or search."
                            />
                        ) : (
                            leads.map(
                                (lead) => (
                                    <tr
                                        key={
                                            lead._id
                                        }
                                        className="group transition hover:bg-slate-50/70"
                                    >
                                        <td className="px-5 py-4">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onOpen(
                                                        lead
                                                    )
                                                }
                                                className="text-left"
                                            >
                                                <p className="font-semibold text-slate-900">
                                                    {
                                                        lead.fullName
                                                    }
                                                </p>
                                                <p className="mt-0.5 text-xs text-slate-500">
                                                    {
                                                        lead.email
                                                    }
                                                </p>
                                                {lead.company && (
                                                    <p className="mt-1 text-xs text-slate-400">
                                                        {
                                                            lead.company
                                                        }
                                                    </p>
                                                )}
                                            </button>
                                        </td>

                                        <td className="px-5 py-4">
                                            <p className="text-sm font-medium text-slate-800">
                                                {lead.projectTitle ||
                                                    "—"}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-400">
                                                {lead.projectType ||
                                                    "No project type"}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="text-sm capitalize text-slate-600">
                                                {formatStatus(
                                                    lead.source
                                                )}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            {lead.assignedTo ? (
                                                <div>
                                                    <p className="text-sm font-medium text-slate-800">
                                                        {
                                                            lead
                                                                .assignedTo
                                                                .name
                                                        }
                                                    </p>
                                                    <p className="text-xs text-slate-400">
                                                        {
                                                            lead
                                                                .assignedTo
                                                                .email
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
                                            <StatusBadge
                                                status={
                                                    lead.status ||
                                                    "new"
                                                }
                                                styles={
                                                    leadStatusStyles
                                                }
                                            />
                                        </td>

                                        <td className="px-5 py-4">
                                            <p className="text-sm text-slate-700">
                                                {formatDate(
                                                    lead.createdAt
                                                )}
                                            </p>
                                            {lead.contactedAt && (
                                                <p className="mt-1 text-xs text-emerald-600">
                                                    Contacted
                                                </p>
                                            )}
                                        </td>

                                        <td className="px-5 py-4 text-right">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onOpen(
                                                        lead
                                                    )
                                                }
                                                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-white"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                )
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

/* -------------------------------------------------------------------------- */
/* Consultation table                                                         */
/* -------------------------------------------------------------------------- */

function ConsultationTable({
    consultations,
    loading,
    onOpen,
}: {
    consultations: Consultation[];
    loading: boolean;
    onOpen: (
        consultation: Consultation
    ) => void;
}) {
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/80">
                            <TableHead>
                                Lead
                            </TableHead>
                            <TableHead>
                                Schedule
                            </TableHead>
                            <TableHead>
                                Meeting
                            </TableHead>
                            <TableHead>
                                Assigned
                            </TableHead>
                            <TableHead>
                                Status
                            </TableHead>
                            <TableHead align="right">
                                Action
                            </TableHead>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            Array.from({
                                length: 7,
                            }).map(
                                (_, index) => (
                                    <SkeletonRow
                                        key={
                                            index
                                        }
                                        columns={
                                            6
                                        }
                                    />
                                )
                            )
                        ) : consultations.length ===
                            0 ? (
                            <EmptyRow
                                columns={6}
                                title="No consultations found"
                                description="Try changing your filters or schedule a new consultation."
                            />
                        ) : (
                            consultations.map(
                                (
                                    consultation
                                ) => {
                                    const lead =
                                        typeof consultation.lead ===
                                            "object"
                                            ? consultation.lead
                                            : null;

                                    return (
                                        <tr
                                            key={
                                                consultation._id
                                            }
                                            className="group transition hover:bg-slate-50/70"
                                        >
                                            <td className="px-5 py-4">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onOpen(
                                                            consultation
                                                        )
                                                    }
                                                    className="text-left"
                                                >
                                                    <p className="font-semibold text-slate-900">
                                                        {getLeadName(
                                                            lead
                                                        )}
                                                    </p>

                                                    <p className="mt-0.5 text-xs text-slate-500">
                                                        {lead?.email ||
                                                            "No email"}
                                                    </p>

                                                    {lead?.company && (
                                                        <p className="mt-1 text-xs text-slate-400">
                                                            {
                                                                lead.company
                                                            }
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
                                                    ·{" "}
                                                    {
                                                        consultation.duration
                                                    }{" "}
                                                    min
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
                                                            {
                                                                consultation.location
                                                            }
                                                        </p>
                                                    )}
                                            </td>

                                            <td className="px-5 py-4">
                                                {consultation.assignedTo ? (
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-800">
                                                            {
                                                                consultation
                                                                    .assignedTo
                                                                    .name
                                                            }
                                                        </p>
                                                        <p className="text-xs text-slate-400">
                                                            {
                                                                consultation
                                                                    .assignedTo
                                                                    .email
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
                                                <StatusBadge
                                                    status={
                                                        consultation.status
                                                    }
                                                    styles={
                                                        consultationStatusStyles
                                                    }
                                                />
                                            </td>

                                            <td className="px-5 py-4 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onOpen(
                                                            consultation
                                                        )
                                                    }
                                                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-white"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                }
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

/* -------------------------------------------------------------------------- */
/* Lead drawer                                                                */
/* -------------------------------------------------------------------------- */

function LeadDrawer({
    lead,
    loading,
    onClose,
    onStatusChange,
    onAssign,
    onContacted,
    onRestore,
    onAddNote,
}: {
    lead: Lead;
    loading: boolean;
    onClose: () => void;
    onStatusChange: (
        status: string
    ) => void;
    onAssign: (
        userId: string
    ) => void;
    onContacted: () => void;
    onRestore: () => void;
    onAddNote: () => void;
}) {
    return (
        <DrawerShell
            title="Lead"
            subtitle={lead.fullName}
            onClose={onClose}
        >
            <div className="space-y-6">
                <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <StatusBadge
                            status={
                                lead.status ||
                                "new"
                            }
                            styles={
                                leadStatusStyles
                            }
                        />

                        <select
                            value={
                                lead.status ||
                                "new"
                            }
                            disabled={loading}
                            onChange={(event) =>
                                onStatusChange(
                                    event.target
                                        .value
                                )
                            }
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium outline-none"
                        >
                            {leadStatusOptions.map(
                                (status) => (
                                    <option
                                        key={
                                            status
                                        }
                                        value={
                                            status
                                        }
                                    >
                                        {formatStatus(
                                            status
                                        )}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        {!lead.contactedAt && (
                            <button
                                type="button"
                                disabled={
                                    loading
                                }
                                onClick={
                                    onContacted
                                }
                                className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                            >
                                Mark Contacted
                            </button>
                        )}

                        {lead.isDeleted && (
                            <button
                                type="button"
                                disabled={
                                    loading
                                }
                                onClick={
                                    onRestore
                                }
                                className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 disabled:opacity-50"
                            >
                                Restore Lead
                            </button>
                        )}
                    </div>
                </section>

                <DetailSection title="Contact Information">
                    <Detail
                        label="Name"
                        value={
                            lead.fullName
                        }
                    />
                    <Detail
                        label="Email"
                        value={
                            <a
                                href={`mailto:${lead.email}`}
                                className="text-blue-600 hover:underline"
                            >
                                {
                                    lead.email
                                }
                            </a>
                        }
                    />
                    <Detail
                        label="Phone"
                        value={
                            lead.phone ? (
                                <a
                                    href={`tel:${lead.phone}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    {
                                        lead.phone
                                    }
                                </a>
                            ) : (
                                "—"
                            )
                        }
                    />
                    <Detail
                        label="Company"
                        value={
                            lead.company ||
                            "—"
                        }
                    />
                    <Detail
                        label="Website"
                        value={
                            lead.website ? (
                                <a
                                    href={
                                        lead.website.startsWith(
                                            "http"
                                        )
                                            ? lead.website
                                            : `https://${lead.website}`
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    Open website
                                </a>
                            ) : (
                                "—"
                            )
                        }
                    />
                </DetailSection>

                <DetailSection title="Project">
                    <Detail
                        label="Title"
                        value={
                            lead.projectTitle ||
                            "—"
                        }
                    />
                    <Detail
                        label="Type"
                        value={
                            lead.projectType ||
                            "—"
                        }
                    />
                    <Detail
                        label="Timeline"
                        value={
                            lead.timeline ||
                            "—"
                        }
                    />
                    <Detail
                        label="Preferred Contact"
                        value={
                            lead.preferredContact ||
                            "—"
                        }
                    />
                </DetailSection>

                <DetailSection title="Lead Details">
                    <Detail
                        label="Source"
                        value={formatStatus(
                            lead.source
                        )}
                    />
                    <Detail
                        label="Created"
                        value={formatDateTime(
                            lead.createdAt
                        )}
                    />
                    <Detail
                        label="Contacted"
                        value={
                            lead.contactedAt
                                ? formatDateTime(
                                    lead.contactedAt
                                )
                                : "Not contacted"
                        }
                    />
                    <Detail
                        label="Converted"
                        value={
                            lead.convertedAt
                                ? formatDateTime(
                                    lead.convertedAt
                                )
                                : "—"
                        }
                    />
                </DetailSection>

                {lead.budget && (
                    <DetailSection title="Budget">
                        <Detail
                            label="Minimum"
                            value={
                                lead.budget.min !==
                                    undefined
                                    ? `${lead.budget.currency || "USD"} ${lead.budget.min}`
                                    : "—"
                            }
                        />
                        <Detail
                            label="Maximum"
                            value={
                                lead.budget.max !==
                                    undefined
                                    ? `${lead.budget.currency || "USD"} ${lead.budget.max}`
                                    : "—"
                            }
                        />
                    </DetailSection>
                )}

                {lead.message && (
                    <DetailSection title="Message">
                        <p className="whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                            {
                                lead.message
                            }
                        </p>
                    </DetailSection>
                )}

                <DetailSection title="Assignment">
                    <Detail
                        label="Assigned To"
                        value={
                            lead.assignedTo
                                ? lead
                                    .assignedTo
                                    .name
                                : "Unassigned"
                        }
                    />

                    {lead.assignedTo && (
                        <Detail
                            label="Email"
                            value={
                                lead
                                    .assignedTo
                                    .email
                            }
                        />
                    )}
                </DetailSection>

                <DetailSection title="Notes">
                    <div className="space-y-3">
                        {lead.notes &&
                            lead.notes.length >
                            0 ? (
                            lead.notes.map(
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
                                                note.note
                                            }
                                        </p>

                                        <p className="mt-2 text-[11px] text-slate-400">
                                            {formatDateTime(
                                                note.createdAt
                                            )}
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
                            onClick={
                                onAddNote
                            }
                            className="w-full rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm font-medium text-slate-600 hover:border-slate-400 hover:bg-slate-50"
                        >
                            + Add Note
                        </button>
                    </div>
                </DetailSection>
            </div>
        </DrawerShell>
    );
}

/* -------------------------------------------------------------------------- */
/* Consultation drawer                                                        */
/* -------------------------------------------------------------------------- */

function ConsultationDrawer({
    consultation,
    loading,
    onClose,
    onStatusChange,
    onAddNote,
}: {
    consultation: Consultation;
    loading: boolean;
    onClose: () => void;
    onStatusChange: (
        id: string,
        status: ConsultationStatus
    ) => void;
    onAddNote: () => void;
}) {
    const lead =
        typeof consultation.lead ===
            "object"
            ? consultation.lead
            : null;

    return (
        <DrawerShell
            title="Consultation"
            subtitle={getLeadName(
                lead
            )}
            onClose={onClose}
        >
            <div className="space-y-6">
                <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <StatusBadge
                            status={
                                consultation.status
                            }
                            styles={
                                consultationStatusStyles
                            }
                        />

                        <select
                            value={
                                consultation.status
                            }
                            disabled={loading}
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
                </section>

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
                    {consultation.assignedTo && (
                        <Detail
                            label="Email"
                            value={
                                consultation
                                    .assignedTo
                                    .email
                            }
                        />
                    )}
                </DetailSection>

                {consultation.agenda && (
                    <DetailSection title="Agenda">
                        <p className="whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
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
                                            {formatDateTime(
                                                note.createdAt
                                            )}
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
                            onClick={
                                onAddNote
                            }
                            className="w-full rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm font-medium text-slate-600 hover:border-slate-400 hover:bg-slate-50"
                        >
                            + Add Note
                        </button>
                    </div>
                </DetailSection>
            </div>
        </DrawerShell>
    );
}

/* -------------------------------------------------------------------------- */
/* Create consultation                                                        */
/* -------------------------------------------------------------------------- */

function CreateConsultationModal({
    leads,
    onClose,
    onCreated,
}: {
    leads: Lead[];
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

    const [searchLead, setSearchLead] =
        useState("");

    const filteredLeads =
        useMemo(() => {
            if (!searchLead.trim()) {
                return leads;
            }

            const value =
                searchLead.toLowerCase();

            return leads.filter(
                (item) =>
                    item.fullName
                        .toLowerCase()
                        .includes(value) ||
                    item.email
                        .toLowerCase()
                        .includes(value) ||
                    item.company
                        ?.toLowerCase()
                        .includes(value)
            );
        }, [
            leads,
            searchLead,
        ]);

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
            !meetingLink.trim()
        ) {
            alert(
                "Meeting link is required."
            );
            return;
        }

        if (
            meetingType ===
            "in_person" &&
            !location.trim()
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
                        credentials:
                            "include",
                        body: JSON.stringify({
                            lead,
                            scheduledAt:
                                new Date(
                                    scheduledAt
                                ).toISOString(),
                            duration:
                                Number(
                                    duration
                                ),
                            meetingType,
                            meetingLink:
                                meetingType ===
                                    "zoom"
                                    ? meetingLink
                                    : "",
                            location:
                                meetingType ===
                                    "in_person"
                                    ? location
                                    : "",
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
        <ModalShell
            title="New Consultation"
            subtitle="Schedule a meeting for an existing lead."
            onClose={onClose}
        >
            <form
                onSubmit={submit}
            >
                <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
                    <Field
                        label="Lead"
                        required
                        className="sm:col-span-2"
                    >
                        <input
                            value={
                                searchLead
                            }
                            onChange={(
                                event
                            ) => {
                                setSearchLead(
                                    event
                                        .target
                                        .value
                                );
                                setLead(
                                    ""
                                );
                            }}
                            placeholder="Search lead by name, email or company..."
                            className="input"
                        />

                        {searchLead &&
                            !lead && (
                                <div className="mt-2 max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                                    {filteredLeads.length >
                                        0 ? (
                                        filteredLeads
                                            .slice(
                                                0,
                                                8
                                            )
                                            .map(
                                                (
                                                    item
                                                ) => (
                                                    <button
                                                        key={
                                                            item._id
                                                        }
                                                        type="button"
                                                        onClick={() => {
                                                            setLead(
                                                                item._id
                                                            );
                                                            setSearchLead(
                                                                item.fullName
                                                            );
                                                        }}
                                                        className="block w-full border-b border-slate-100 px-4 py-3 text-left last:border-0 hover:bg-slate-50"
                                                    >
                                                        <p className="text-sm font-semibold text-slate-900">
                                                            {
                                                                item.fullName
                                                            }
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            {
                                                                item.email
                                                            }
                                                        </p>
                                                    </button>
                                                )
                                            )
                                    ) : (
                                        <p className="px-4 py-3 text-sm text-slate-500">
                                            No leads found.
                                        </p>
                                    )}
                                </div>
                            )}

                        {lead && (
                            <p className="mt-2 text-xs font-medium text-emerald-600">
                                Lead selected
                            </p>
                        )}
                    </Field>

                    <Field
                        label="Date & Time"
                        required
                    >
                        <input
                            type="datetime-local"
                            value={
                                scheduledAt
                            }
                            onChange={(
                                event
                            ) =>
                                setScheduledAt(
                                    event
                                        .target
                                        .value
                                )
                            }
                            className="input"
                        />
                    </Field>

                    <Field label="Duration">
                        <select
                            value={
                                duration
                            }
                            onChange={(
                                event
                            ) =>
                                setDuration(
                                    event
                                        .target
                                        .value
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
                            value={
                                meetingType
                            }
                            onChange={(
                                event
                            ) =>
                                setMeetingType(
                                    event
                                        .target
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
                                    value={
                                        meetingLink
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setMeetingLink(
                                            event
                                                .target
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
                                    value={
                                        location
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setLocation(
                                            event
                                                .target
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
                            value={
                                agenda
                            }
                            onChange={(
                                event
                            ) =>
                                setAgenda(
                                    event
                                        .target
                                        .value
                                )
                            }
                            placeholder="What will be discussed?"
                            className="input resize-none"
                        />
                    </Field>
                </div>

                <ModalFooter
                    onClose={onClose}
                    saving={saving}
                    submitLabel="Create Consultation"
                />
            </form>
        </ModalShell>
    );
}

/* -------------------------------------------------------------------------- */
/* Generic UI                                                                 */
/* -------------------------------------------------------------------------- */

function DrawerShell({
    title,
    subtitle,
    onClose,
    children,
}: {
    title: string;
    subtitle: string;
    onClose: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="fixed inset-0 z-50">
            <button
                type="button"
                aria-label="Close drawer"
                onClick={onClose}
                className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"
            />

            <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                            {title}
                        </p>

                        <h2 className="mt-1 text-lg font-bold text-slate-950">
                            {subtitle}
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
                    {children}
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

function ModalShell({
    title,
    subtitle,
    onClose,
    children,
}: {
    title: string;
    subtitle: string;
    onClose: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-sm">
            <div className="my-8 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
                    <div>
                        <h2 className="text-lg font-bold text-slate-950">
                            {title}
                        </h2>

                        <p className="mt-0.5 text-xs text-slate-500">
                            {subtitle}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-xl text-slate-400 hover:text-slate-700"
                    >
                        ×
                    </button>
                </div>

                {children}
            </div>
        </div>
    );
}

function NoteModal({
    title,
    placeholder,
    loading,
    onClose,
    onSubmit,
}: {
    title: string;
    placeholder: string;
    loading: boolean;
    onClose: () => void;
    onSubmit: (
        value: string
    ) => void;
}) {
    const [value, setValue] =
        useState("");

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
            <form
                onSubmit={(event) => {
                    event.preventDefault();

                    if (
                        value.trim()
                    ) {
                        onSubmit(
                            value.trim()
                        );
                    }
                }}
                className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-950">
                        {title}
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
                    value={value}
                    onChange={(event) =>
                        setValue(
                            event.target
                                .value
                        )
                    }
                    rows={6}
                    autoFocus
                    placeholder={
                        placeholder
                    }
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
                            loading ||
                            !value.trim()
                        }
                        className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                    >
                        {loading
                            ? "Saving..."
                            : "Add Note"}
                    </button>
                </div>
            </form>
        </div>
    );
}

function ModalFooter({
    onClose,
    saving,
    submitLabel,
}: {
    onClose: () => void;
    saving: boolean;
    submitLabel: string;
}) {
    return (
        <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4 sm:px-6">
            <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
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
                    : submitLabel}
            </button>
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
                    {icon ===
                        "check"
                        ? "✓"
                        : icon ===
                            "clock"
                            ? "◷"
                            : icon ===
                                "upcoming"
                                ? "↗"
                                : icon ===
                                    "phone"
                                    ? "☎"
                                    : icon ===
                                        "spark"
                                        ? "✦"
                                        : icon ===
                                            "users"
                                            ? "♙"
                                            : "▣"}
                </div>
            </div>
        </div>
    );
}

function StatusBadge({
    status,
    styles,
}: {
    status: string;
    styles: Record<
        string,
        string
    >;
}) {
    return (
        <span
            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${styles[status] ||
                "border-slate-200 bg-slate-50 text-slate-600"
                }`}
        >
            {formatStatus(
                status
            )}
        </span>
    );
}

function Pagination({
    page,
    totalPages,
    onPrevious,
    onNext,
}: {
    page: number;
    totalPages: number;
    onPrevious: () => void;
    onNext: () => void;
}) {
    return (
        <div className="flex flex-col gap-3 border-t border-slate-200 px-1 py-2 sm:flex-row sm:items-center sm:justify-between">
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
                    onClick={
                        onPrevious
                    }
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Previous
                </button>

                <button
                    type="button"
                    disabled={
                        page >=
                        totalPages
                    }
                    onClick={onNext}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

function TableHead({
    children,
    align = "left",
}: {
    children: React.ReactNode;
    align?: "left" | "right";
}) {
    return (
        <th
            className={`px-5 py-4 text-${align} text-xs font-semibold uppercase tracking-wide text-slate-500`}
        >
            {children}
        </th>
    );
}

function SkeletonRow({
    columns,
}: {
    columns: number;
}) {
    return (
        <tr>
            {Array.from({
                length: columns,
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

function EmptyRow({
    columns,
    title,
    description,
}: {
    columns: number;
    title: string;
    description: string;
}) {
    return (
        <tr>
            <td
                colSpan={
                    columns
                }
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
                        {title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        {description}
                    </p>
                </div>
            </td>
        </tr>
    );
}

function ErrorBox({
    message,
}: {
    message: string;
}) {
    return (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {message}
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