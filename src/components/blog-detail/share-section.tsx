"use client";

import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import {
    Link2,
    Share2
} from "lucide-react";

import { FaLinkedin, FaFacebook, FaTwitter } from "react-icons/fa";

import { toast } from "sonner";

import type { BlogPost } from "@/lib/dummy/blog";

interface Props {
    blog: BlogPost;
}

export default function ShareSection({
    blog,
}: Props) {
    const [shareUrl, setShareUrl] =
        useState("");

    useEffect(() => {
        setShareUrl(
            window.location.href
        );
    }, []);

    const copyLink = async () => {
        const currentUrl =
            shareUrl || blog.slug;

        await navigator.clipboard.writeText(
            currentUrl
        );

        toast.success(
            "Article link copied."
        );
    };

    const encodedTitle =
        encodeURIComponent(blog.title);

    const encodedUrl =
        shareUrl
            ? encodeURIComponent(shareUrl)
            : "";

    return (
        <section className="py-20">
            <div className="container mx-auto max-w-4xl px-4">
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 30,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{
                        once: true,
                    }}
                    className="rounded-[32px] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 shadow-sm"
                >
                    <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
                        <div>
                            <div className="flex items-center gap-3">
                                <Share2 className="text-blue-600" />

                                <h3 className="text-2xl font-black text-slate-900">
                                    Share this
                                    article
                                </h3>
                            </div>

                            <p className="mt-3 text-slate-600">
                                Help others
                                discover
                                this article.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <a
                                href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
                                target="_blank"
                                className="rounded-full border border-slate-200 p-4 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white"
                            >
                                <FaTwitter size={20} />
                            </a>

                            <a
                                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                                target="_blank"
                                className="rounded-full border border-slate-200 p-4 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white"
                            >
                                <FaLinkedin size={20} />
                            </a>

                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                                target="_blank"
                                className="rounded-full border border-slate-200 p-4 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white"
                            >
                                <FaFacebook size={20} />
                            </a>

                            <button
                                onClick={
                                    copyLink
                                }
                                className="rounded-full border border-slate-200 p-4 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white"
                            >
                                <Link2 size={20} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}