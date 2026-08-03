"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type RelatedService = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  image: string;
  category: string;
};

const dummyServices: RelatedService[] = [
  {
    id: "1",
    title: "AI Automation",
    slug: "ai-automation",
    category: "Artificial Intelligence",
    shortDescription:
      "Automate repetitive business workflows using modern AI agents and intelligent systems.",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "2",
    title: "Custom Software",
    slug: "custom-software-development",
    category: "Software",
    shortDescription:
      "Scalable enterprise-grade software engineered specifically for your business.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "3",
    title: "Cloud & DevOps",
    slug: "cloud-devops",
    category: "Infrastructure",
    shortDescription:
      "Cloud-native architecture with CI/CD, Kubernetes, monitoring and security.",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80",
  },
];
export function RelatedServices() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="mb-3 inline-flex rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
              Continue Exploring
            </span>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Related Services
            </h2>

            <p className="mt-4 max-w-2xl text-lg text-slate-600">
              Expand your digital ecosystem with complementary solutions that
              work seamlessly together.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 font-semibold text-blue-600 transition hover:gap-3"
          >
            View All Services
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {dummyServices.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 backdrop-blur">
                  {service.category}
                </span>
              </div>

              <div className="space-y-5 p-7">
                <h3 className="text-2xl font-bold text-slate-900 transition group-hover:text-blue-600">
                  {service.title}
                </h3>

                <p className="leading-7 text-slate-600">
                  {service.shortDescription}
                </p>

                <div className="flex items-center gap-2 font-semibold text-blue-600">
                  Learn More

                  <ArrowRight className="h-5 w-5 transition group-hover:translate-x-2" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}