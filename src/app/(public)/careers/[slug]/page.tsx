import { cache } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { CAREERS_CANONICAL_URL } from "@/config/site";
import { EMPLOYMENT_TYPE, Workplace } from "@/enums";
import CareerService from "@/services/career.service";

const getCareer = cache(async (slug: string) => {
  await connection();
  return CareerService.getPublicCareer(slug);
});

type RouteProps = {
  params: Promise<{ slug: string }>;
};

function careerUrl(slug: string) {
  return `${CAREERS_CANONICAL_URL}/${encodeURIComponent(slug)}`;
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { slug } = await params;
  const career = await getCareer(slug);

  if (!career) {
    return {
      title: "Position unavailable | Careers at ADM",
      robots: { index: false, follow: false },
    };
  }

  const canonical = careerUrl(career.slug);
  const title = career.seo?.metaTitle?.trim() || `${career.title} | Careers at ADM`;
  const description = career.seo?.metaDescription?.trim() || career.description.slice(0, 160);

  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title: career.seo?.ogTitle?.trim() || title,
      description: career.seo?.ogDescription?.trim() || description,
      siteName: "Arazi Digital Media",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

const employmentLabels: Record<string, string> = {
  [EMPLOYMENT_TYPE.FULL_TIME]: "Full-time",
  [EMPLOYMENT_TYPE.PART_TIME]: "Part-time",
  [EMPLOYMENT_TYPE.CONTRACT]: "Contract",
  [EMPLOYMENT_TYPE.INTERNSHIP]: "Internship",
  [EMPLOYMENT_TYPE.REMOTE]: "Remote",
};

const workplaceLabels: Record<string, string> = {
  [Workplace.ONSITE]: "On-site",
  [Workplace.REMOTE]: "Remote",
  [Workplace.HYBRID]: "Hybrid",
};

function toEmploymentSchema(value: string): string | undefined {
  const values: Record<string, string> = {
    [EMPLOYMENT_TYPE.FULL_TIME]: "FULL_TIME",
    [EMPLOYMENT_TYPE.PART_TIME]: "PART_TIME",
    [EMPLOYMENT_TYPE.CONTRACT]: "CONTRACTOR",
    [EMPLOYMENT_TYPE.INTERNSHIP]: "INTERN",
  };
  return values[value];
}

function getJobPostingSchema(career: NonNullable<Awaited<ReturnType<typeof getCareer>>>) {
  const workplace = career.workplace;
  const structuredData: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: career.title,
    description: career.description,
    datePosted: career.createdAt.toISOString(),
    hiringOrganization: {
      "@type": "Organization",
      name: "Arazi Digital Media",
    },
    url: careerUrl(career.slug),
  };

  const employmentType = toEmploymentSchema(career.employmentType);
  if (employmentType) structuredData.employmentType = employmentType;
  if (career.expiresAt) structuredData.validThrough = career.expiresAt.toISOString();

  if (workplace === Workplace.REMOTE) {
    structuredData.jobLocationType = "TELECOMMUTE";
  } else if (career.location.trim()) {
    structuredData.jobLocation = {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: career.location,
      },
    };
  }

  return JSON.stringify(structuredData).replace(/</g, "\\u003c");
}

function splitParagraphs(value: string) {
  return value.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
}

export default async function CareerDetailRoute({ params }: RouteProps) {
  const { slug } = await params;
  const career = await getCareer(slug);

  if (!career) notFound();

  const employmentType = employmentLabels[career.employmentType] ?? career.employmentType;
  const workplace = workplaceLabels[career.workplace] ?? career.workplace;
  const details = [...new Set([career.department, employmentType, workplace, career.location, career.experience, career.openings > 1 ? `${career.openings} openings` : undefined])]
    .filter((value): value is string => Boolean(value?.trim()));

  return (
    <div className="bg-surface text-text">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: getJobPostingSchema(career) }}
      />
      <section aria-labelledby="position-heading" className="bg-surface-alt">
        <div className="mx-auto max-w-[1440px] px-5 pb-12 pt-12 sm:px-8 sm:pb-16 sm:pt-16 lg:px-12 lg:pb-20">
          <Link href="/careers" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-text-muted transition-colors hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300">
            <ArrowLeft aria-hidden="true" size={16} />
            All careers
          </Link>
          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.22em] text-brand-300">Position at ADM</p>
          <h1 id="position-heading" className="mt-4 max-w-5xl text-[clamp(2.5rem,6vw,5rem)] font-medium leading-[1.03] tracking-[-0.055em]">
            {career.title}
          </h1>
          <ul aria-label="Position details" className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-text-muted sm:text-base">
            {details.map((value, index) => (
              <li key={`${value}-${index}`} className="flex items-center gap-2">
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[#55AD35]" />
                {value}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-20 lg:px-12 lg:py-20">
        <article className="min-w-0">
          <section aria-labelledby="position-overview-heading">
            <h2 id="position-overview-heading" className="text-2xl font-medium tracking-tight sm:text-3xl">About this position</h2>
            <div className="mt-5 max-w-3xl space-y-4 text-base leading-8 text-text-muted sm:text-lg sm:leading-9">
              {splitParagraphs(career.description).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </div>
          </section>

          {career.responsibilities?.length > 0 && (
            <section aria-labelledby="responsibilities-heading" className="mt-12 border-t border-border pt-8">
              <h2 id="responsibilities-heading" className="text-2xl font-medium tracking-tight sm:text-3xl">Responsibilities</h2>
              <ul className="mt-5 max-w-3xl space-y-3 text-base leading-7 text-text-muted">
                {career.responsibilities.map((item, index) => <li key={`${index}-${item}`} className="flex gap-3"><span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#55AD35]" />{item}</li>)}
              </ul>
            </section>
          )}

          {career.requirements?.length > 0 && (
            <section aria-labelledby="requirements-heading" className="mt-12 border-t border-border pt-8">
              <h2 id="requirements-heading" className="text-2xl font-medium tracking-tight sm:text-3xl">What the role requires</h2>
              <ul className="mt-5 max-w-3xl space-y-3 text-base leading-7 text-text-muted">
                {career.requirements.map((item, index) => <li key={`${index}-${item}`} className="flex gap-3"><span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#55AD35]" />{item}</li>)}
              </ul>
            </section>
          )}

          {career.benefits?.length > 0 && (
            <section aria-labelledby="role-details-heading" className="mt-12 border-t border-border pt-8">
              <h2 id="role-details-heading" className="text-2xl font-medium tracking-tight sm:text-3xl">Additional information</h2>
              <ul className="mt-5 max-w-3xl space-y-3 text-base leading-7 text-text-muted">
                {career.benefits.map((item, index) => <li key={`${index}-${item}`} className="flex gap-3"><span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#55AD35]" />{item}</li>)}
              </ul>
            </section>
          )}
        </article>

        <aside className="h-fit border-t border-border pt-6 lg:sticky lg:top-28 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-soft">Application information</p>
          <p className="mt-4 text-sm leading-7 text-text-muted">
            The website does not accept application submissions or resume uploads. To ask ADM about this position, use the contact page and include the role title in your message.
          </p>
          <Link href="/contact" className="site-button-primary mt-6 min-h-12 w-full px-5 py-3">
            Contact ADM about this role
            <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
        </aside>
      </div>
    </div>
  );
}
