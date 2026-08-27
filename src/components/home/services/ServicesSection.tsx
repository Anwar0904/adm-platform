// src/components/home/services/ServicesSection.tsx

"use client";

import { useEffect, useState } from "react";
import ServiceCard from "./ServiceCard";

export type PublicService = {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description?: string;
  content?: string;
  icon?: string | null;
  banner?: string | { _id?: string; url?: string } | null;
  featuredImage?: string | { _id?: string; url?: string } | null;
  features?: {
    title: string;
    description: string;
  }[];
  faqs?: {
    question: string;
    answer: string;
  }[];
  status: string;
  featured?: boolean;
  sortOrder?: number;
};

function mediaUrl(
  value: PublicService["banner"] | PublicService["featuredImage"]
) {
  if (!value) return null;
  if (typeof value === "string") return value;
  return value.url ?? null;
}

export default function ServicesSection() {
  const [services, setServices] = useState<PublicService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadServices() {
      try {
        const response = await fetch("/api/public/services", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load services");
        }

        const result = await response.json();

        const data = Array.isArray(result.data)
          ? result.data
          : result.data?.services ?? [];

        if (mounted) {
          setServices(
            data
              .filter(
                (service: PublicService) =>
                  service &&
                  !["draft", "archived"].includes(
                    service.status
                  )
              )
              .sort(
                (
                  a: PublicService,
                  b: PublicService
                ) =>
                  (a.sortOrder ?? 0) -
                  (b.sortOrder ?? 0)
              )
          );
        }
      } catch (error) {
        console.error("ServicesSection:", error);

        if (mounted) {
          setServices([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadServices();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16 lg:mb-20">
          <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-700 sm:text-sm">
            What We Do
          </span>

          <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:mt-6 lg:text-5xl">
            Digital Services Built For Growth
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8">
            From AI automation to enterprise software, ADM
            delivers practical digital solutions that help
            businesses innovate faster.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white"
              >
                <div className="h-52 animate-pulse bg-slate-100 sm:h-56" />
                <div className="space-y-4 p-6 sm:p-7">
                  <div className="h-7 w-2/3 animate-pulse rounded-lg bg-slate-100" />
                  <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : services.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-6 lg:gap-8">
            {services.map((service, index) => (
              <div
                key={service._id}
                className={
                  index < 2
                    ? "lg:col-span-3"
                    : "lg:col-span-2"
                }
              >
                <ServiceCard
                  service={{
                    ...service,
                    image:
                      mediaUrl(
                        service.featuredImage
                      ) ??
                      mediaUrl(
                        service.banner
                      ),
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
            <h3 className="text-lg font-bold text-slate-900">
              Our services are being updated
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Please check back shortly.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}