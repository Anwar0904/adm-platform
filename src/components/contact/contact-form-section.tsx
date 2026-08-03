"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    ContactFormSchema,
    ContactFormSchemaType,
} from "@/validators/contact-form.validator";
import { motion } from "framer-motion";

import { Send } from "lucide-react";

import { contactServices } from "@/lib/dummy/contact-services";

import { useCreateLead } from "@/hooks/useCreateLead";

export default function ContactFormSection() {



    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ContactFormSchemaType>({
        resolver: zodResolver(
            ContactFormSchema
        ),

        defaultValues: {
            interestedServices: [],
        },
    });

    const createLeadMutation =
        useCreateLead();

    const onSubmit = async (
        data: ContactFormSchemaType
    ) => {
        const budgetMap: Record<
            string,
            { amount: number; currency: "USD"; type: "fixed" | "range" } | undefined
        > = {
            "<5000": {
                amount: 5000,
                currency: "USD",
                type: "fixed",
            },

            "5000-10000": {
                amount: 10000,
                currency: "USD",
                type: "range",
            },

            "10000-25000": {
                amount: 25000,
                currency: "USD",
                type: "range",
            },

            "25000+": {
                amount: 50000,
                currency: "USD",
                type: "range",
            },

            custom: undefined,
        };

        const budgetValue = data.budget
            ? budgetMap[data.budget]
            : undefined;

        createLeadMutation.mutate({
            fullName: data.fullName,
            email: data.email,
            phone: data.phone || undefined,
            company: data.company || undefined,
            website: data.website || undefined,
            interestedServices: data.interestedServices,
            budget: budgetValue,
            message: data.message,
        });
    };

    return (
        <section
            id="contact-form"
            className="py-24 lg:py-32"
        >
            <div className="container mx-auto px-4 lg:px-8">

                <div className="grid gap-14 lg:grid-cols-[1fr_1.35fr]">
                    {/* Left Side */}

                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col justify-center"
                    >
                        <span className="inline-flex w-fit rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">
                            Send Project Inquiry
                        </span>

                        <h2 className="mt-6 text-4xl font-black leading-tight text-slate-900 lg:text-6xl">
                            Let's Build
                            <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                                Something Great
                            </span>
                        </h2>

                        <p className="mt-8 text-lg leading-9 text-slate-600">
                            Tell us about your project and our team will contact you
                            within 24 hours with ideas, recommendations and the next
                            steps.
                        </p>

                        <div className="mt-12 space-y-5">
                            <div className="rounded-2xl bg-slate-50 p-5">
                                <h4 className="font-bold text-slate-900">
                                    ✔ Free Consultation
                                </h4>

                                <p className="mt-2 text-slate-600">
                                    No commitment required.
                                </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-5">
                                <h4 className="font-bold text-slate-900">
                                    ✔ Tailored Proposal
                                </h4>

                                <p className="mt-2 text-slate-600">
                                    Custom roadmap & quotation.
                                </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-5">
                                <h4 className="font-bold text-slate-900">
                                    ✔ Fast Response
                                </h4>

                                <p className="mt-2 text-slate-600">
                                    Usually within one business day.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side */}

                    <motion.form
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        onSubmit={handleSubmit(onSubmit)}
                        className="rounded-[34px] border border-slate-200 bg-white p-8 shadow-xl lg:p-10"
                    >
                        {/* Row 1 */}

                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-semibold">
                                    Full Name
                                </label>

                                <input
                                    {...register("fullName")}
                                    placeholder="John Doe"
                                    className="h-14 w-full rounded-2xl border border-slate-200 px-5 outline-none transition focus:border-blue-600"
                                />
                                {errors.fullName && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {errors.fullName.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    {...register("email")}
                                    placeholder="john@example.com"
                                    className="h-14 w-full rounded-2xl border border-slate-200 px-5 outline-none transition focus:border-blue-600"
                                />
                            </div>
                        </div>

                        {/* Row 2 */}

                        <div className="mt-6 grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-semibold">
                                    Phone
                                </label>

                                <input
                                    {...register("phone")}
                                    placeholder="+92..."
                                    className="h-14 w-full rounded-2xl border border-slate-200 px-5 outline-none transition focus:border-blue-600"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold">
                                    Company
                                </label>

                                <input
                                    {...register("company")}
                                    placeholder="Company Name"
                                    className="h-14 w-full rounded-2xl border border-slate-200 px-5 outline-none transition focus:border-blue-600"
                                />
                            </div>
                        </div>

                        {/* Website */}

                        <div className="mt-6">
                            <label className="mb-2 block text-sm font-semibold">
                                Website
                            </label>

                            <input
                                {...register("website")}
                                placeholder="https://"
                                className="h-14 w-full rounded-2xl border border-slate-200 px-5 outline-none transition focus:border-blue-600"
                            />
                        </div>

                        {/* Services */}

                        <div className="mt-8">
                            <label className="mb-4 block text-sm font-semibold">
                                Interested Services
                            </label>

                            <div className="grid gap-3 sm:grid-cols-2">
                                {contactServices.map((service) => (
                                    <label
                                        key={service.id}
                                        className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-blue-500"
                                    >
                                        <input
                                            type="checkbox"
                                            value={service.id}
                                            {...register("interestedServices")}
                                            className="h-5 w-5 rounded"
                                        />

                                        <span className="text-sm font-medium">
                                            {service.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Budget */}

                        <div className="mt-8">
                            <label className="mb-2 block text-sm font-semibold">
                                Estimated Budget
                            </label>

                            <select
                                {...register("budget")}
                                className="h-14 w-full rounded-2xl border border-slate-200 px-5 outline-none transition focus:border-blue-600"
                            >
                                <option value="">Select Budget</option>
                                <option value="<5000">Less than $5K</option>
                                <option value="5000-10000">$5K – $10K</option>
                                <option value="10000-25000">$10K – $25K</option>
                                <option value="25000+">$25K+</option>
                                <option value="custom">Custom</option>
                            </select>
                        </div>

                        {/* Message */}

                        <div className="mt-8">
                            <label className="mb-2 block text-sm font-semibold">
                                Project Details
                            </label>

                            <textarea
                                rows={6}
                                {...register("message")}
                                placeholder="Tell us about your project..."
                                className="w-full rounded-2xl border border-slate-200 p-5 outline-none transition focus:border-blue-600"
                            />
                        </div>

                        {/* Button */}

                        <button
                            type="submit"
                            disabled={createLeadMutation.isPending}
                            className="mt-10 flex h-14 w-full items-center justify-center rounded-2xl bg-blue-600 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {createLeadMutation.isPending
                                ? "Sending..."
                                : "Send Inquiry"}

                            {!createLeadMutation.isPending && (
                                <Send
                                    size={18}
                                    className="ml-3"
                                />
                            )}
                        </button>
                    </motion.form>
                </div>

            </div>
        </section>
    );
}