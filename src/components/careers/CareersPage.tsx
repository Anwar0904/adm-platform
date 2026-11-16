import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import type { PublicCareerListing } from "@/services/career.service";

type CareerListing = PublicCareerListing;

const workplaceLabels: Record<string, string> = {
  onsite: "On-site",
  remote: "Remote",
  hybrid: "Hybrid",
};

const employmentLabels: Record<string, string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  internship: "Internship",
  remote: "Remote",
};

function formatLabel(value: string | undefined) {
  if (!value) return "";
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function CareerRow({ career }: { career: CareerListing }) {
  const employmentType = employmentLabels[career.employmentType] ?? formatLabel(career.employmentType);
  const workplace = workplaceLabels[career.workplace] ?? formatLabel(career.workplace);

  return (
    <article className="grid gap-5 border-b border-border py-7 first:border-t sm:py-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-10">
      <div className="min-w-0">
        <h3 className="text-2xl font-medium tracking-tight text-text sm:text-3xl">
          <Link
            href={`/careers/${career.slug}`}
            className="rounded-sm transition-colors hover:text-brand-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
          >
            {career.title}
          </Link>
        </h3>
        <p className="mt-3 max-w-3xl line-clamp-3 whitespace-pre-line text-sm leading-7 text-text-muted sm:text-base">
          {career.description}
        </p>
        <ul aria-label="Position details" className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-text-soft sm:text-sm">
          {[career.department, employmentType, workplace, career.location, career.experience]
            .filter((value): value is string => Boolean(value?.trim()))
            .map((value, index) => (
              <li key={`${value}-${index}`} className="flex items-center gap-2">
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[#55AD35]" />
                {value}
              </li>
            ))}
        </ul>
      </div>
      <Link
        href={`/careers/${career.slug}`}
        aria-label={`View details for ${career.title}`}
        className="inline-flex min-h-11 w-fit items-center gap-2 border-b border-brand-300 pb-1 text-sm font-semibold text-brand-300 transition-colors hover:border-brand-200 hover:text-brand-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
      >
        View position
        <ArrowUpRight aria-hidden="true" size={16} />
      </Link>
    </article>
  );
}

export default function CareersPage({ careers }: { careers: CareerListing[] }) {
  return (
    <div className="bg-surface text-text">
      <section aria-labelledby="careers-heading" className="relative overflow-hidden bg-surface">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 pb-16 pt-16 sm:px-8 sm:pb-20 sm:pt-20 lg:grid-cols-[1.35fr_0.65fr] lg:items-end lg:gap-16 lg:px-12 lg:pb-28 lg:pt-28">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-300">
              Careers at ADM
            </p>
            <h1 id="careers-heading" className="mt-6 max-w-4xl text-[clamp(3rem,8vw,7.25rem)] font-medium leading-[0.96] tracking-[-0.065em] text-text">
              Build What&apos;s Next <span className="text-brand-300">With Us.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-text-muted sm:text-xl sm:leading-9">
              Arazi Digital Media brings technology, marketing, AI and data together to help shape what&apos;s next for the digital economy.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
              <a href="#opportunities" className="site-button-primary min-h-12 px-6 py-3">
                Explore opportunities
                <ArrowDown aria-hidden="true" size={16} />
              </a>
              <Link href="/about" className="inline-flex min-h-11 items-center text-sm font-semibold text-text-muted underline decoration-border underline-offset-4 transition-colors hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300">
                Discover ADM
              </Link>
            </div>
          </div>

          <aside aria-label="ADM company positioning" className="border-l border-border pl-6 sm:pl-8 lg:mb-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-soft">Our work spans</p>
            <ul className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 text-lg font-medium tracking-tight sm:text-xl">
              {["Technology", "Marketing", "AI", "Data"].map((discipline) => (
                <li key={discipline} className="flex items-center gap-3">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#55AD35]" />
                  {discipline}
                </li>
              ))}
            </ul>
            <p className="mt-8 max-w-sm text-sm leading-7 text-text-soft">
              Building What&apos;s Next for the Digital Economy.
            </p>
          </aside>
        </div>
        <div aria-hidden="true" className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </section>

      <section aria-labelledby="working-heading" className="bg-surface-alt py-16 sm:py-20 lg:py-28">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-5 sm:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20 lg:px-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-soft">01 / Working at ADM</p>
            <h2 id="working-heading" className="mt-5 max-w-md text-3xl font-medium leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              Many disciplines. Connected work.
            </h2>
          </div>
          <div className="max-w-3xl lg:pt-7">
            <p className="text-lg leading-8 text-text-muted sm:text-xl sm:leading-9">
              ADM&apos;s work sits where technology, marketing, AI and data meet. Roles contribute to digital solutions and business challenges from different professional perspectives.
            </p>
            <p className="mt-5 text-base leading-7 text-text-soft sm:text-lg sm:leading-8">
              Explore the open positions below to see the responsibilities and experience requested for each role.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="collaboration-heading" className="bg-surface py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-soft">02 / Culture and collaboration</p>
              <h2 id="collaboration-heading" className="mt-5 max-w-xl text-3xl font-medium leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                Good digital work starts with good questions.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-text-muted sm:text-lg sm:leading-9 lg:justify-self-end">
              Digital challenges rarely belong to one discipline alone. The work calls for understanding the problem, bringing relevant perspectives together and considering how a solution will be used.
            </p>
          </div>

          <div className="mt-10 grid border-y border-border sm:mt-14 md:grid-cols-3">
            {[
              ["01", "Connect perspectives", "Technology, marketing, AI and data each add a different lens to a digital challenge."],
              ["02", "Build for real needs", "Start with the business problem and the people who will use the solution."],
              ["03", "Keep learning", "Digital tools and practices change; thoughtful work makes room to question and improve."],
            ].map(([number, title, description]) => (
              <article key={number} className="border-b border-border py-6 sm:px-6 sm:py-8 md:border-b-0 md:border-r md:first:pl-0 md:last:border-r-0 md:last:pr-0">
                <p className="text-xs font-semibold tracking-[0.16em] text-[#55AD35]">{number}</p>
                <h3 className="mt-5 text-xl font-medium tracking-tight text-text sm:text-2xl">{title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-7 text-text-muted sm:text-base">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="opportunities" aria-labelledby="opportunities-heading" className="scroll-mt-20 bg-surface-alt py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-5 border-b border-border pb-7 sm:pb-9 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-soft">03 / Opportunities</p>
              <h2 id="opportunities-heading" className="mt-4 text-3xl font-medium tracking-[-0.04em] sm:text-4xl lg:text-5xl">Current positions</h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-text-muted sm:text-base">
              Vacancies shown here are published positions currently open at ADM.
            </p>
          </div>

          {careers.length > 0 ? (
            <div>
              {careers.map((career) => <CareerRow key={career.slug} career={career} />)}
            </div>
          ) : (
            <div className="grid gap-7 py-10 sm:py-14 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <h3 className="text-2xl font-medium tracking-tight text-text sm:text-3xl">There&apos;s no open position at the moment.</h3>
                <p className="mt-4 max-w-2xl text-base leading-8 text-text-muted sm:text-lg">
                  For a general talent enquiry, get in touch through our contact page. The website does not currently accept recruitment applications or resume uploads.
                </p>
              </div>
              <Link href="/contact" className="site-button-primary min-h-12 w-fit px-6 py-3">
                Make a talent enquiry
                <ArrowUpRight aria-hidden="true" size={16} />
              </Link>
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="careers-closing-heading" className="bg-surface py-16 sm:py-20 lg:py-24">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-5 sm:px-8 md:flex-row md:items-end md:justify-between lg:px-12">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-soft">Arazi Digital Media</p>
            <h2 id="careers-closing-heading" className="mt-4 text-3xl font-medium leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              Building What&apos;s Next for the Digital Economy.
            </h2>
          </div>
          <Link href="/portfolio" className="inline-flex min-h-11 w-fit items-center gap-2 text-sm font-semibold text-brand-300 transition-colors hover:text-brand-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300">
            Explore selected work
            <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
