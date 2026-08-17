"use client";

import Image from "next/image";
import { motion } from "framer-motion";



import { FaLinkedin, FaTwitter } from "react-icons/fa";

import type { Author } from "@/lib/dummy/blog";

interface Props {
    author: Author;
}

export default function AuthorCard({
    author,
}: Props) {
    return (
        <section className="bg-slate-50 py-20">
            <div className="container mx-auto max-w-5xl px-4">
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
                    className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm lg:p-12"
                >
                    <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:text-left">
                        <Image
                            src={
                                author.avatar
                            }
                            alt={
                                author.name
                            }
                            width={
                                150
                            }
                            height={
                                150
                            }
                            className="h-36 w-36 rounded-full object-cover"
                        />

                        <div className="flex-1">
                            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                                Written By
                            </p>

                            <h2 className="mt-3 text-3xl font-black text-slate-900">
                                {
                                    author.name
                                }
                            </h2>

                            <p className="mt-2 text-lg font-medium text-slate-500">
                                {
                                    author.role
                                }
                            </p>

                            <p className="mt-6 leading-8 text-slate-600">
                                {
                                    author.bio
                                }
                            </p>

                            <div className="mt-8 flex justify-center gap-4 lg:justify-start">
                                <a
                                    href={
                                        author.linkedin
                                    }
                                    className="rounded-full border border-slate-200 p-3 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white"
                                >
                                    <FaLinkedin
                                        size={
                                            20
                                        }
                                    />
                                </a>

                                <a
                                    href={
                                        author.twitter
                                    }
                                    className="rounded-full border border-slate-200 p-3 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white"
                                >
                                    <FaTwitter
                                        size={
                                            20
                                        }
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}