"use client";

import {
    FormEvent,
    useMemo,
    useState,
} from "react";
import {
    ArrowLeft,
    Eye,
    Image as ImageIcon,
    Save,
    Star,
    Tag,
    TrendingUp,
    X,
} from "lucide-react";
import Link from "next/link";

type BlogStatus =
    | "Published"
    | "Draft";

type BlogEditorProps = {
    blogId?: string;
};

const categories = [
    "Artificial Intelligence",
    "Web Development",
    "Next.js",
    "UI / UX",
    "Cloud",
    "DevOps",
    "Blockchain",
    "Digital Marketing",
    "Case Studies",
    "Company News",
];

const authors = [
    "Sarah Johnson",
    "Michael Chen",
    "Emma Wilson",
    "David Miller",
];

const dummyBlog = {
    id: "1",
    title:
        "Building Enterprise AI Applications in 2026",
    slug:
        "building-enterprise-ai-applications",
    excerpt:
        "Discover the architecture, tools and best practices behind scalable enterprise AI systems.",
    content:
        "Enterprise AI applications require thoughtful architecture, reliable data pipelines, secure infrastructure and carefully designed user experiences.\n\nModern teams are combining large language models, retrieval systems and traditional software engineering to build practical AI products.\n\nThe most successful systems focus not only on model capability but also on reliability, observability, security and measurable business outcomes.",
    category:
        "Artificial Intelligence",
    author: "Sarah Johnson",
    coverImage:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1400&q=80",
    status: "Published" as BlogStatus,
    featured: true,
    trending: true,
    readingTime: 8,
    publishedAt: "2026-07-25",
    tags: [
        "AI",
        "LLMs",
        "Enterprise",
    ],
};

export default function BlogEditor({
    blogId,
}: BlogEditorProps) {
    const isEditing = Boolean(blogId);

    const [title, setTitle] =
        useState(
            isEditing
                ? dummyBlog.title
                : ""
        );

    const [slug, setSlug] =
        useState(
            isEditing
                ? dummyBlog.slug
                : ""
        );

    const [excerpt, setExcerpt] =
        useState(
            isEditing
                ? dummyBlog.excerpt
                : ""
        );

    const [content, setContent] =
        useState(
            isEditing
                ? dummyBlog.content
                : ""
        );

    const [category, setCategory] =
        useState(
            isEditing
                ? dummyBlog.category
                : categories[0]
        );

    const [author, setAuthor] =
        useState(
            isEditing
                ? dummyBlog.author
                : authors[0]
        );

    const [status, setStatus] =
        useState<BlogStatus>(
            isEditing
                ? dummyBlog.status
                : "Draft"
        );

    const [featured, setFeatured] =
        useState(
            isEditing
                ? dummyBlog.featured
                : false
        );

    const [trending, setTrending] =
        useState(
            isEditing
                ? dummyBlog.trending
                : false
        );

    const [readingTime, setReadingTime] =
        useState(
            isEditing
                ? dummyBlog.readingTime
                : 5
        );

    const [coverImage, setCoverImage] =
        useState(
            isEditing
                ? dummyBlog.coverImage
                : ""
        );

    const [publishedAt, setPublishedAt] =
        useState(
            isEditing
                ? dummyBlog.publishedAt
                : new Date()
                    .toISOString()
                    .slice(0, 10)
        );

    const [tagInput, setTagInput] =
        useState("");

    const [tags, setTags] =
        useState<string[]>(
            isEditing
                ? dummyBlog.tags
                : []
        );

    const [preview, setPreview] =
        useState(false);

    const generatedSlug = useMemo(() => {
        return title
            .toLowerCase()
            .trim()
            .replace(
                /[^a-z0-9\s-]/g,
                ""
            )
            .replace(
                /\s+/g,
                "-"
            )
            .replace(
                /-+/g,
                "-"
            );
    }, [title]);

    function generateSlug() {
        setSlug(generatedSlug);
    }

    function addTag(
        event?: FormEvent
    ) {
        event?.preventDefault();

        const tag =
            tagInput.trim();

        if (
            !tag ||
            tags.includes(tag)
        ) {
            return;
        }

        setTags((current) => [
            ...current,
            tag,
        ]);

        setTagInput("");
    }

    function removeTag(
        tag: string
    ) {
        setTags((current) =>
            current.filter(
                (item) =>
                    item !== tag
            )
        );
    }

    function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        const payload = {
            title: title.trim(),
            slug: slug.trim(),
            excerpt: excerpt.trim(),
            content: content.trim(),
            category,
            author,
            status,
            featured,
            trending,
            readingTime,
            coverImage:
                coverImage.trim(),
            publishedAt,
            tags,
        };

        console.log(
            "BLOG PAYLOAD",
            payload
        );

        /*
         * Connect this payload to:
         *
         * POST /api/blogs
         *
         * or
         *
         * PATCH /api/blogs/:id
         *
         * once the Blog backend service is wired.
         */

        alert(
            isEditing
                ? "Blog updated successfully."
                : "Blog created successfully."
        );
    }

    return (
        <div className="mx-auto max-w-7xl">
            {/* Header */}

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/blogs"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                    >
                        <ArrowLeft
                            size={18}
                        />
                    </Link>

                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                            Content Management
                        </p>

                        <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                            {isEditing
                                ? "Edit Blog"
                                : "Create Blog"}
                        </h1>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() =>
                            setPreview(
                                true
                            )
                        }
                        className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                    >
                        <Eye
                            size={17}
                        />
                        Preview
                    </button>

                    <button
                        form="blog-editor-form"
                        type="submit"
                        className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                    >
                        <Save
                            size={17}
                        />
                        Save Blog
                    </button>
                </div>
            </div>

            <form
                id="blog-editor-form"
                onSubmit={
                    handleSubmit
                }
                className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]"
            >
                {/* Main */}

                <main className="space-y-6">
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <Field label="Blog Title">
                            <input
                                required
                                value={title}
                                onChange={(
                                    event
                                ) =>
                                    setTitle(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                placeholder="Enter a compelling blog title"
                                className="input text-lg font-bold"
                            />
                        </Field>

                        <div className="mt-5">
                            <Field label="Slug">
                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <input
                                        required
                                        value={
                                            slug
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setSlug(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder="blog-post-slug"
                                        className="input flex-1"
                                    />

                                    <button
                                        type="button"
                                        onClick={
                                            generateSlug
                                        }
                                        className="h-11 shrink-0 rounded-xl bg-slate-100 px-4 text-xs font-black text-slate-600 hover:bg-slate-200"
                                    >
                                        Generate
                                    </button>
                                </div>

                                <p className="mt-2 text-xs text-slate-400">
                                    /blogs/
                                    {slug ||
                                        "your-blog-slug"}
                                </p>
                            </Field>
                        </div>

                        <div className="mt-5">
                            <Field label="Excerpt">
                                <textarea
                                    required
                                    rows={4}
                                    value={
                                        excerpt
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setExcerpt(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    maxLength={
                                        300
                                    }
                                    placeholder="Short description displayed in blog cards and metadata..."
                                    className="input min-h-28 resize-none py-3"
                                />

                                <div className="mt-1 text-right text-xs text-slate-400">
                                    {
                                        excerpt.length
                                    }
                                    /300
                                </div>
                            </Field>
                        </div>
                    </section>

                    {/* Content */}

                    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                            <h2 className="text-sm font-black text-slate-900">
                                Article Content
                            </h2>

                            <p className="mt-1 text-xs text-slate-400">
                                Write the main article
                                content.
                            </p>
                        </div>

                        <div className="p-5 sm:p-6">
                            <textarea
                                required
                                value={
                                    content
                                }
                                onChange={(
                                    event
                                ) =>
                                    setContent(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                placeholder="Start writing your article..."
                                className="min-h-[500px] w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                            />
                        </div>
                    </section>

                    {/* Cover */}

                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <Field label="Cover Image URL">
                            <div className="relative">
                                <ImageIcon
                                    size={18}
                                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    value={
                                        coverImage
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setCoverImage(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="https://..."
                                    className="input pl-11"
                                />
                            </div>
                        </Field>

                        {coverImage && (
                            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                                <img
                                    src={
                                        coverImage
                                    }
                                    alt="Cover preview"
                                    className="aspect-[16/7] w-full object-cover"
                                />
                            </div>
                        )}
                    </section>
                </main>

                {/* Sidebar */}

                <aside className="space-y-6">
                    {/* Publishing */}

                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="text-sm font-black text-slate-900">
                            Publishing
                        </h2>

                        <div className="mt-5 space-y-4">
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
                                                .value as BlogStatus
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

                            <Field label="Published Date">
                                <input
                                    type="date"
                                    value={
                                        publishedAt
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setPublishedAt(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    className="input"
                                />
                            </Field>

                            <Field label="Reading Time">
                                <div className="relative">
                                    <input
                                        type="number"
                                        min={
                                            1
                                        }
                                        max={
                                            120
                                        }
                                        value={
                                            readingTime
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setReadingTime(
                                                Number(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            )
                                        }
                                        className="input pr-20"
                                    />

                                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                                        min read
                                    </span>
                                </div>
                            </Field>
                        </div>
                    </section>

                    {/* Classification */}

                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="text-sm font-black text-slate-900">
                            Classification
                        </h2>

                        <div className="mt-5 space-y-4">
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

                            <Field label="Author">
                                <select
                                    value={
                                        author
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setAuthor(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    className="input"
                                >
                                    {authors.map(
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
                    </section>

                    {/* Tags */}

                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-2">
                            <Tag
                                size={16}
                                className="text-blue-600"
                            />

                            <h2 className="text-sm font-black text-slate-900">
                                Tags
                            </h2>
                        </div>

                        <div className="mt-4 flex gap-2">
                            <input
                                value={
                                    tagInput
                                }
                                onChange={(
                                    event
                                ) =>
                                    setTagInput(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                onKeyDown={(
                                    event
                                ) => {
                                    if (
                                        event.key ===
                                        "Enter"
                                    ) {
                                        addTag();
                                    }
                                }}
                                placeholder="Add tag..."
                                className="input min-w-0 flex-1"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    addTag()
                                }
                                className="h-11 rounded-xl bg-slate-100 px-4 text-xs font-black text-slate-700 hover:bg-slate-200"
                            >
                                Add
                            </button>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {tags.map(
                                (tag) => (
                                    <span
                                        key={
                                            tag
                                        }
                                        className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700"
                                    >
                                        #
                                        {tag}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeTag(
                                                    tag
                                                )
                                            }
                                            className="ml-1 rounded-full hover:bg-blue-100"
                                        >
                                            <X
                                                size={
                                                    13
                                                }
                                            />
                                        </button>
                                    </span>
                                )
                            )}
                        </div>
                    </section>

                    {/* Visibility */}

                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="text-sm font-black text-slate-900">
                            Visibility
                        </h2>

                        <div className="mt-4 space-y-2">
                            <Toggle
                                checked={
                                    featured
                                }
                                onChange={
                                    setFeatured
                                }
                                icon={
                                    <Star
                                        size={
                                            16
                                        }
                                    />
                                }
                                title="Featured article"
                                description="Highlight this article on the blog."
                            />

                            <Toggle
                                checked={
                                    trending
                                }
                                onChange={
                                    setTrending
                                }
                                icon={
                                    <TrendingUp
                                        size={
                                            16
                                        }
                                    />
                                }
                                title="Trending article"
                                description="Show this article in trending content."
                            />
                        </div>
                    </section>

                    {/* Mobile Save */}

                    <button
                        type="submit"
                        form="blog-editor-form"
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 xl:hidden"
                    >
                        <Save size={17} />
                        Save Blog
                    </button>
                </aside>
            </form>

            {/* Preview */}

            {preview && (
                <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm sm:p-8">
                    <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-8">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                                    Article Preview
                                </p>

                                <p className="mt-1 text-sm font-semibold text-slate-500">
                                    Public blog appearance
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    setPreview(
                                        false
                                    )
                                }
                                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <article className="p-6 sm:p-10 lg:p-14">
                            {coverImage && (
                                <img
                                    src={
                                        coverImage
                                    }
                                    alt=""
                                    className="mb-8 aspect-[16/7] w-full rounded-2xl object-cover"
                                />
                            )}

                            <div className="flex flex-wrap gap-2">
                                <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                                    {category}
                                </span>

                                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                                    {
                                        readingTime
                                    }{" "}
                                    min read
                                </span>
                            </div>

                            <h1 className="mt-5 text-3xl font-black leading-tight text-slate-900 sm:text-5xl">
                                {title ||
                                    "Untitled Blog"}
                            </h1>

                            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-500">
                                {
                                    excerpt
                                }
                            </p>

                            <div className="mt-8 border-t border-slate-100 pt-8">
                                {content
                                    .split(
                                        "\n"
                                    )
                                    .filter(
                                        Boolean
                                    )
                                    .map(
                                        (
                                            paragraph,
                                            index
                                        ) => (
                                            <p
                                                key={
                                                    index
                                                }
                                                className="mb-6 text-base leading-8 text-slate-700"
                                            >
                                                {
                                                    paragraph
                                                }
                                            </p>
                                        )
                                    )}
                            </div>
                        </article>
                    </div>
                </div>
            )}
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

function Toggle({
    checked,
    onChange,
    icon,
    title,
    description,
}: {
    checked: boolean;
    onChange: (
        value: boolean
    ) => void;
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <button
            type="button"
            onClick={() =>
                onChange(!checked)
            }
            className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${checked
                    ? "border-blue-200 bg-blue-50"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
        >
            <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${checked
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
            >
                {icon}
            </span>

            <span className="min-w-0 flex-1">
                <span className="block text-xs font-black text-slate-800">
                    {title}
                </span>

                <span className="mt-0.5 block text-[11px] leading-4 text-slate-400">
                    {description}
                </span>
            </span>

            <span
                className={`relative h-5 w-9 shrink-0 rounded-full transition ${checked
                        ? "bg-blue-600"
                        : "bg-slate-200"
                    }`}
            >
                <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition ${checked
                            ? "left-[18px]"
                            : "left-0.5"
                        }`}
                />
            </span>
        </button>
    );
}