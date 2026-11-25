"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Edit3, Plus, Search, Star, Trash2, X } from "lucide-react";
import { PERMISSIONS } from "@/constants/permissions";
import { canAccessAdminPermission } from "@/lib/permissions/admin-access";
import { requestTestimonialWrite } from "@/lib/admin/testimonials-api";

type Status = "published" | "draft" | "archived";
type Media = { _id?: string; url?: string; secureUrl?: string; secure_url?: string };
type Testimonial = {
    _id: string;
    clientName: string;
    designation?: string;
    company?: string;
    message: string;
    avatar?: string | Media | null;
    rating: number;
    status: Status;
    featured: boolean;
    createdAt: string;
};
type TestimonialInput = Omit<Testimonial, "_id" | "createdAt">;
type AuthUser = { role?: { name?: string | null; permissions?: string[] } };
type ApiResult<T> = { success?: boolean; message?: string; data?: T; errors?: unknown };

const emptyInput: TestimonialInput = {
    clientName: "", designation: "", company: "", message: "", avatar: "",
    rating: 5, status: "published", featured: false,
};

function mediaId(value: Testimonial["avatar"]): string {
    if (typeof value === "string") return value;
    return value?._id ?? "";
}

function mediaUrl(value: Testimonial["avatar"]): string | null {
    if (!value || typeof value === "string") return null;
    return value.url ?? value.secureUrl ?? value.secure_url ?? null;
}

function asTestimonial(value: unknown): Testimonial | null {
    if (!value || typeof value !== "object") return null;
    const item = value as Partial<Testimonial> & { id?: string };
    const id = item._id ?? item.id;
    if (!id || typeof item.clientName !== "string" || typeof item.message !== "string") return null;
    return {
        _id: id,
        clientName: item.clientName,
        designation: item.designation ?? "",
        company: item.company ?? "",
        message: item.message,
        avatar: item.avatar ?? null,
        rating: Number(item.rating ?? 0),
        status: item.status === "draft" || item.status === "archived" ? item.status : "published",
        featured: item.featured === true,
        createdAt: item.createdAt ?? "",
    };
}

async function readApiError(response: Response, result: ApiResult<unknown>) {
    if (response.status === 401) return "Your session has expired. Sign in again.";
    if (response.status === 403) return "You do not have permission to perform this action.";
    if (response.status === 400) {
        const fieldErrors = result.errors && typeof result.errors === "object" && "fieldErrors" in result.errors
            ? Object.values((result.errors as { fieldErrors?: Record<string, string[]> }).fieldErrors ?? {}).flat()
            : [];
        return fieldErrors.length ? fieldErrors.join(" ") : result.message ?? "Check the testimonial fields and try again.";
    }
    return result.message ?? "The request could not be completed. Please try again.";
}

export default function TestimonialsManagement() {
    const [items, setItems] = useState<Testimonial[]>([]);
    const [permissions, setPermissions] = useState<string[] | null>(null);
    const [roleName, setRoleName] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");
    const [editing, setEditing] = useState<Testimonial | null>(null);
    const [deleting, setDeleting] = useState<Testimonial | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState<TestimonialInput>(emptyInput);

    const canCreate = canAccessAdminPermission(permissions ?? [], PERMISSIONS.TESTIMONIAL_CREATE, roleName);
    const canUpdate = canAccessAdminPermission(permissions ?? [], PERMISSIONS.TESTIMONIAL_UPDATE, roleName);
    const canDelete = canAccessAdminPermission(permissions ?? [], PERMISSIONS.TESTIMONIAL_DELETE, roleName);

    useEffect(() => {
        let active = true;
        const fetchPageData = async () => {
            const [authResponse, listResponse] = await Promise.all([
                fetch("/api/auth/me", { cache: "no-store" }),
                fetch("/api/testimonials?limit=100", { cache: "no-store" }),
            ]);
            const authResult = await authResponse.json() as ApiResult<AuthUser>;
            if (!authResponse.ok || !authResult.data?.role || !Array.isArray(authResult.data.role.permissions)) {
                throw new Error(authResponse.status === 401 ? "Your session has expired. Sign in again." : "Unable to verify your permissions.");
            }
            if (!listResponse.ok) {
                const listResult = await listResponse.json() as ApiResult<unknown>;
                throw new Error(await readApiError(listResponse, listResult));
            }
            const listResult = await listResponse.json() as ApiResult<{ testimonials?: unknown[] }>;
            return { authResult, testimonials: (listResult.data?.testimonials ?? []).map(asTestimonial).filter((item): item is Testimonial => item !== null) };
        };

        void fetchPageData().then(({ authResult, testimonials }) => {
            if (!active) return;
            setError("");
            setPermissions(authResult.data?.role?.permissions ?? []);
            setRoleName(authResult.data?.role?.name ?? null);
            setItems(testimonials);
        }).catch((loadError: unknown) => {
            if (active) setError(loadError instanceof Error ? loadError.message : "Unable to load testimonials.");
        }).finally(() => {
            if (active) setLoading(false);
        });

        return () => { active = false; };
    }, []);

    const filtered = useMemo(() => {
        const needle = search.trim().toLowerCase();
        return items.filter((item) =>
            (statusFilter === "all" || item.status === statusFilter) &&
            (!needle || [item.clientName, item.designation, item.company, item.message]
                .some((value) => value?.toLowerCase().includes(needle))),
        );
    }, [items, search, statusFilter]);

    function openCreate() {
        setEditing(null);
        setForm(emptyInput);
        setError("");
        setNotice("");
        setShowForm(true);
    }

    function openEdit(item: Testimonial) {
        setEditing(item);
        setForm({
            clientName: item.clientName,
            designation: item.designation ?? "",
            company: item.company ?? "",
            message: item.message,
            avatar: mediaId(item.avatar),
            rating: item.rating,
            status: item.status,
            featured: item.featured,
        });
        setError("");
        setNotice("");
        setShowForm(true);
    }

    async function save(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (saving || (editing ? !canUpdate : !canCreate)) return;
        setSaving(true);
        setError("");
        setNotice("");
        const payload = {
            ...form,
            clientName: form.clientName.trim(),
            designation: form.designation?.trim() ?? "",
            company: form.company?.trim() ?? "",
            message: form.message.trim(),
            avatar: typeof form.avatar === "string" && form.avatar.trim() ? form.avatar.trim() : null,
        };
        try {
            const responseData = await requestTestimonialWrite<unknown>(
                editing ? `/api/testimonials/${editing._id}` : "/api/testimonials",
                editing ? "PATCH" : "POST",
                payload,
            );
            const persisted = asTestimonial(responseData);
            if (!persisted) {
                setError("The server did not confirm a saved testimonial. Refresh and check the list.");
                return;
            }
            setItems((current) => editing
                ? current.map((item) => item._id === persisted._id ? persisted : item)
                : [persisted, ...current]);
            setEditing(null);
            setForm(emptyInput);
            setShowForm(false);
            setNotice(editing ? "Testimonial updated." : "Testimonial created.");
        } catch (saveError) {
            setError(saveError instanceof Error ? saveError.message : "Unable to save the testimonial. Check your connection and try again.");
        } finally {
            setSaving(false);
        }
    }

    async function remove() {
        if (!deleting || !canDelete) return;
        setSaving(true);
        setError("");
        setNotice("");
        try {
            const response = await fetch(`/api/testimonials/${deleting._id}`, { method: "DELETE", cache: "no-store" });
            const result = await response.json() as ApiResult<unknown>;
            if (!response.ok || !result.success) {
                setError(await readApiError(response, result));
                return;
            }
            setItems((current) => current.filter((item) => item._id !== deleting._id));
            setDeleting(null);
            setNotice("Testimonial deleted.");
        } catch {
            setError("Unable to delete the testimonial. Check your connection and try again.");
        } finally {
            setSaving(false);
        }
    }

    const published = items.filter((item) => item.status === "published").length;
    const drafts = items.filter((item) => item.status === "draft").length;
    const average = items.length ? (items.reduce((sum, item) => sum + item.rating, 0) / items.length).toFixed(1) : "0.0";

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold text-blue-600">Social Proof</p>
                    <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900">Testimonials</h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Manage client feedback and testimonials displayed across ADM.</p>
                </div>
                {canCreate && <button onClick={openCreate} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-lg hover:bg-blue-700"><Plus size={18} />Add Testimonial</button>}
            </section>

            {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            {notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{notice}</p>}

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Total" value={items.length} />
                <StatCard label="Published" value={published} />
                <StatCard label="Drafts" value={drafts} />
                <StatCard label="Average Rating" value={average} icon={<Star size={18} className="fill-current text-blue-600" />} />
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
                    <div className="relative"><Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input aria-label="Search testimonials" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search testimonials..." className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white" /></div>
                    <div className="flex gap-2 overflow-x-auto">{(["all", "published", "draft", "archived"] as const).map((filter) => <button key={filter} onClick={() => setStatusFilter(filter)} className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold capitalize ${statusFilter === filter ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{filter}</button>)}</div>
                </div>
            </section>

            {loading ? <p role="status" className="rounded-2xl bg-white py-16 text-center text-slate-500">Loading testimonials…</p> : filtered.length ? (
                <section className="grid gap-5 lg:grid-cols-2">{filtered.map((item) => <article key={item._id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-4">{mediaUrl(item.avatar) ? <img src={mediaUrl(item.avatar) ?? undefined} alt="" className="h-14 w-14 rounded-2xl object-cover" /> : <div aria-hidden="true" className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 font-bold text-blue-700">{item.clientName.charAt(0).toUpperCase()}</div>}
                            <div className="min-w-0"><h2 className="truncate font-black text-slate-900">{item.clientName}</h2><p className="mt-0.5 truncate text-sm font-semibold text-blue-600">{item.designation || "Client"}</p><p className="mt-0.5 truncate text-xs text-slate-400">{item.company}</p></div>
                        </div>
                        <div className="flex gap-1">{canUpdate && <button aria-label={`Edit ${item.clientName}`} onClick={() => openEdit(item)} className="rounded-xl p-2.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600"><Edit3 size={17} /></button>}{canDelete && <button aria-label={`Delete ${item.clientName}`} onClick={() => setDeleting(item)} className="rounded-xl p-2.5 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={17} /></button>}</div>
                    </div>
                    <blockquote className="mt-5 text-sm leading-7 text-slate-600">“{item.message}”</blockquote>
                    <footer className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4"><span className="flex gap-1 text-amber-400" aria-label={`${item.rating} out of 5 stars`}>{Array.from({ length: item.rating }, (_, index) => <Star key={index} size={15} className="fill-current" />)}</span><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold capitalize text-slate-600">{item.status}{item.featured ? " · featured" : ""}</span></footer>
                </article>)}</section>
            ) : <section className="rounded-2xl border border-slate-200 bg-white py-20 text-center shadow-sm"><h2 className="font-black text-slate-900">{items.length ? "No testimonials found" : "No testimonials yet"}</h2><p className="mt-2 text-sm text-slate-500">{items.length ? "Try changing your search or filter." : "Permitted testimonials will appear here after they are created."}</p></section>}

            {showForm && (canCreate || (editing && canUpdate)) && !deleting && (
                <TestimonialFormDialog
                    key={editing?._id ?? "new"}
                    value={form}
                    editing={editing !== null}
                    saving={saving}
                    error={error}
                    onClose={() => { setEditing(null); setShowForm(false); setForm(emptyInput); setError(""); }}
                    onChange={setForm}
                    onSubmit={save}
                />
            )}

            {deleting && <div className="fixed inset-0 z-[110] grid place-items-center bg-slate-950/50 p-4"><section role="dialog" aria-modal="true" aria-labelledby="delete-title" className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"><div className="grid h-12 w-12 place-items-center rounded-xl bg-red-50 text-red-600"><Trash2 size={21} /></div><h2 id="delete-title" className="mt-5 text-xl font-black text-slate-900">Delete testimonial?</h2><p className="mt-2 text-sm text-slate-500">This removes it from the managed testimonials list.</p><div className="mt-6 flex justify-end gap-3"><button onClick={() => setDeleting(null)} className="h-11 rounded-xl border px-5 text-sm font-bold">Cancel</button><button disabled={saving} onClick={() => void remove()} className="h-11 rounded-xl bg-red-600 px-5 text-sm font-bold text-white disabled:opacity-50">{saving ? "Deleting…" : "Delete"}</button></div></section></div>}
        </div>
    );
}

function TestimonialFormDialog({ value, editing, saving, error, onClose, onChange, onSubmit }: {
    value: TestimonialInput;
    editing: boolean;
    saving: boolean;
    error: string;
    onClose: () => void;
    onChange: (value: TestimonialInput) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
    function set<K extends keyof TestimonialInput>(key: K, next: TestimonialInput[K]) {
        onChange({ ...value, [key]: next });
    }
    return <div className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-slate-950/50 p-4"><section role="dialog" aria-modal="true" aria-labelledby="testimonial-form-title" className="my-auto w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-100 p-6"><div><p className="text-xs font-bold uppercase tracking-widest text-blue-600">Testimonials</p><h2 id="testimonial-form-title" className="mt-1 text-xl font-black text-slate-900">{editing ? "Edit Testimonial" : "Add Testimonial"}</h2></div><button aria-label="Close form" onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"><X size={19} /></button></header>
        <form onSubmit={onSubmit} className="space-y-5 p-6">
            {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <div className="grid gap-5 sm:grid-cols-2"><Field label="Client Name"><input required minLength={2} maxLength={100} value={value.clientName} onChange={(event) => set("clientName", event.target.value)} className="input" /></Field><Field label="Designation"><input maxLength={150} value={value.designation ?? ""} onChange={(event) => set("designation", event.target.value)} className="input" /></Field></div>
            <div className="grid gap-5 sm:grid-cols-2"><Field label="Company"><input maxLength={150} value={value.company ?? ""} onChange={(event) => set("company", event.target.value)} className="input" /></Field><Field label="Rating"><select value={value.rating} onChange={(event) => set("rating", Number(event.target.value))} className="input">{[1, 2, 3, 4, 5].map((rating) => <option key={rating} value={rating}>{rating} / 5</option>)}</select></Field></div>
            <Field label="Avatar Media ID (optional)"><input value={mediaId(value.avatar)} onChange={(event) => set("avatar", event.target.value || "")} pattern="[a-fA-F0-9]{24}" title="Enter a 24-character media record ID." placeholder="Paste an existing media record ID" className="input" /></Field>
            <Field label="Testimonial"><textarea required minLength={10} maxLength={2000} rows={5} value={value.message} onChange={(event) => set("message", event.target.value)} className="input min-h-36 resize-y py-3" /></Field>
            <div className="grid gap-5 sm:grid-cols-2"><Field label="Status"><select value={value.status} onChange={(event) => set("status", event.target.value as Status)} className="input"><option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option></select></Field><label className="flex items-center gap-3 self-end rounded-xl border border-slate-200 p-4"><input type="checkbox" checked={value.featured} onChange={(event) => set("featured", event.target.checked)} /><span className="text-sm font-bold text-slate-800">Featured</span></label></div>
            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end"><button type="button" onClick={onClose} className="h-11 rounded-xl border px-5 text-sm font-bold">Cancel</button><button disabled={saving} type="submit" className="h-11 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white disabled:opacity-50">{saving ? "Saving…" : editing ? "Save Changes" : "Create Testimonial"}</button></div>
        </form>
    </section></div>;
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon?: React.ReactNode }) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm font-medium text-slate-500">{label}</p><div className="mt-2 flex items-center gap-2"><p className="text-3xl font-black text-slate-900">{value}</p>{icon}</div></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return <div><label className="mb-2 block text-sm font-bold text-slate-700">{label}</label>{children}</div>;
}
