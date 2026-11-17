import Image from "next/image";
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

const disciplines = ["Technology", "Marketing", "AI", "Data"];

const principles = [
  {
    number: "01",
    title: "Connect perspectives",
    description:
      "Technology, marketing, AI and data each bring a different lens to a digital challenge.",
  },
  {
    number: "02",
    title: "Build for real needs",
    description:
      "Start with the business problem and the people who will use the solution.",
  },
  {
    number: "03",
    title: "Keep learning",
    description:
      "Digital tools and practices change; thoughtful work makes room to question and improve.",
  },
] as const;

function formatLabel(value: string | undefined) {
  if (!value) return "";
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function CareerRow({ career }: { career: CareerListing }) {
  const employmentType =
    employmentLabels[career.employmentType] ?? formatLabel(career.employmentType);
  const workplace = workplaceLabels[career.workplace] ?? formatLabel(career.workplace);
  const details = [
    career.department,
    employmentType,
    workplace,
    career.location,
    career.experience,
  ].filter((value): value is string => Boolean(value?.trim()));

  return (
    <article className="grid gap-5 border-b border-border py-7 first:border-t sm:py-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10">
      <div className="min-w-0">
        <h3 className="text-xl font-semibold leading-snug tracking-[-0.03em] text-text sm:text-2xl lg:text-[1.75rem]">
          <Link
            href={`/careers/${career.slug}`}
            className="rounded-sm transition-colors hover:text-brand-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
          >
            {career.title}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-3 max-w-3xl whitespace-pre-line text-sm leading-7 text-text-muted sm:text-base">
          {career.description}
        </p>
        {details.length > 0 && (
          <ul
            aria-label="Position details"
            className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-text-soft sm:text-sm"
          >
            {details.map((value, index) => (
              <li key={`${value}-${index}`} className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-1 w-1 rounded-full bg-cyan-400"
                />
                {value}
              </li>
            ))}
          </ul>
        )}
      </div>
      <Link
        href={`/careers/${career.slug}`}
        aria-label={`View details for ${career.title}`}
        className="inline-flex min-h-11 w-fit items-center gap-2 border-b border-brand-300 pb-1 text-sm font-semibold text-brand-300 transition-colors hover:border-text hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
      >
        View position
        <ArrowUpRight aria-hidden="true" size={16} />
      </Link>
    </article>
  );
}

export default function CareersPage({ careers }: { careers: CareerListing[] }) {
  return (
    <div className="overflow-hidden bg-surface text-text">
      <section
        aria-labelledby="careers-heading"
        className="bg-surface pb-14 pt-10 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-16"
      >
        <div className="mx-auto grid max-w-[1440px] items-center gap-9 px-5 sm:px-8 lg:grid-cols-[0.94fr_1.06fr] lg:gap-14 lg:px-12">
          <div className="py-2 lg:py-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-300">
              Careers at ADM
            </p>
            <h1
              id="careers-heading"
              className="mt-5 max-w-2xl text-[clamp(3.15rem,8.4vw,7rem)] font-medium leading-[0.91] tracking-[-0.07em] text-text"
            >
              Make your next move <span className="text-brand-300">matter.</span>
            </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-text-muted sm:mt-8 sm:text-lg sm:leading-8">
              Arazi Digital Media is a global Technology, Marketing, AI and Data
              company. Explore the work behind the ideas shaping the digital
              economy.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-4 sm:mt-9">
              <a
                href="#opportunities"
                className="site-button-primary min-h-12 px-6 py-3"
              >
                Explore opportunities
                <ArrowDown aria-hidden="true" size={16} />
              </a>
              <Link
                href="/about"
                className="inline-flex min-h-11 items-center text-sm font-semibold text-text-muted underline decoration-border underline-offset-4 transition-colors hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-300"
              >
                Discover ADM
              </Link>
            </div>
            <p className="mt-10 border-l-2 border-cyan-400 pl-4 text-sm font-medium leading-6 text-text-muted sm:mt-12">
              Building What&apos;s Next for the Digital Economy.
            </p>
          </div>

          <figure className="relative aspect-[4/3] min-h-[17rem] overflow-hidden bg-surface-muted sm:aspect-[5/4] lg:aspect-[0.94]">
            <Image
              src="/home/team.jpeg"
              alt="Colleagues collaborating around a table in a bright office"
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 52vw"
              className="object-cover object-[center_48%]"
            />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent px-5 pb-5 pt-16 text-xs font-semibold uppercase tracking-[0.16em] text-white sm:px-7 sm:pb-7">
              <span>Different perspectives, shared work</span>
              <span className="hidden text-right sm:block">Arazi Digital Media</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section
        aria-labelledby="working-heading"
        className="bg-surface-alt py-14 sm:py-20 lg:py-28"
      >
        <div className="mx-auto grid max-w-[1440px] items-center gap-9 px-5 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20 lg:px-12">
          <figure className="relative order-2 aspect-[4/3] overflow-hidden bg-surface-muted lg:order-1 lg:aspect-[1.08]">
            <Image
              src="/home/laptop.jpeg"
              alt="Laptop with a digital dashboard on a shared work table"
              fill
              sizes="(max-width: 1023px) 100vw, 48vw"
              className="object-cover object-center"
            />
          </figure>
          <div className="order-1 lg:order-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-300">
              01 / Working at ADM
            </p>
            <h2
              id="working-heading"
              className="mt-4 max-w-xl text-3xl font-medium leading-[1.08] tracking-[-0.05em] text-text sm:text-4xl lg:text-5xl"
            >
              Four disciplines, connected by the work.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-text-muted sm:text-lg sm:leading-8">
              Our projects bring technology, marketing, AI and data together
              around digital products, services and business challenges. Each
              discipline contributes its own way of seeing the problem.
            </p>
            <ul
              aria-label="ADM disciplines"
              className="mt-7 grid grid-cols-2 border-y border-border sm:mt-9 sm:grid-cols-4"
            >
              {disciplines.map((discipline) => (
                <li
                  key={discipline}
                  className="border-b border-border py-4 text-base font-medium tracking-tight text-text last:border-b-0 even:pl-4 sm:border-b-0 sm:border-r sm:py-5 sm:pl-4 sm:text-lg sm:first:pl-0 sm:last:border-r-0"
                >
                  {discipline}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="collaboration-heading"
        className="bg-surface py-14 sm:py-20 lg:py-28"
      >
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-5 border-b border-border pb-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-16 lg:pb-11">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-300">
                02 / Culture and collaboration
              </p>
              <h2
                id="collaboration-heading"
                className="mt-4 max-w-xl text-3xl font-medium leading-[1.08] tracking-[-0.05em] text-text sm:text-4xl lg:text-5xl"
              >
                Good digital work starts with good questions.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-text-muted sm:text-lg sm:leading-8 lg:justify-self-end">
              Digital challenges rarely belong to one discipline alone. The
              work calls for understanding the problem, bringing relevant
              perspectives together and considering how a solution will be
              used.
            </p>
          </div>

          <div className="grid md:grid-cols-3">
            {principles.map((principle, index) => (
              <article
                key={principle.number}
                className={`border-b border-border py-6 sm:py-8 md:border-b-0 md:pr-7 lg:pr-12 ${
                  index > 0 ? "md:border-l md:pl-6 lg:pl-10" : ""
                }`}
              >
                <p className="text-xs font-semibold tracking-[0.16em] text-brand-300">
                  {principle.number}
                </p>
                <h3 className="mt-4 text-xl font-medium tracking-tight text-text sm:text-2xl">
                  {principle.title}
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-7 text-text-muted sm:text-base">
                  {principle.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="opportunities"
        aria-labelledby="opportunities-heading"
        className="scroll-mt-20 bg-surface-alt py-14 sm:py-20 lg:py-28"
      >
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-4 border-b border-border pb-7 sm:pb-9 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-300">
                03 / Opportunities
              </p>
              <h2
                id="opportunities-heading"
                className="mt-4 text-3xl font-medium tracking-[-0.05em] text-text sm:text-4xl lg:text-5xl"
              >
                Current positions
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-text-muted sm:text-base">
              Explore published positions and the experience requested for each
              role.
            </p>
          </div>

          {careers.length > 0 ? (
            <div>
              {careers.map((career) => (
                <CareerRow key={career.slug} career={career} />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 py-9 sm:py-12 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-10">
              <div className="border-l-2 border-cyan-400 pl-5 sm:pl-7">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-300">
                  The next opportunity
                </p>
                <h3 className="mt-3 text-2xl font-medium leading-tight tracking-[-0.04em] text-text sm:text-3xl">
                  There&apos;s no open position at the moment.
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-text-muted sm:text-base sm:leading-8">
                  For a general talent enquiry, get in touch through our contact
                  page. The website does not currently accept recruitment
                  applications or resume uploads.
                </p>
              </div>
              <Link
                href="/contact"
                className="site-button-primary min-h-12 w-fit px-6 py-3"
              >
                Make a talent enquiry
                <ArrowUpRight aria-hidden="true" size={16} />
              </Link>
            </div>
          )}
        </div>
      </section>

      <section
        aria-labelledby="careers-closing-heading"
        className="relative isolate min-h-[27rem] overflow-hidden bg-surface sm:min-h-[34rem] lg:min-h-[42rem]"
      >
        <Image
          src="/home/building.jpeg"
          alt="A glass city tower framed by the surrounding skyline"
          fill
          sizes="100vw"
          className="-z-20 object-cover object-[center_46%]"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-slate-950/65" />
        <div className="relative mx-auto flex min-h-[27rem] max-w-[1440px] items-end px-5 py-10 sm:min-h-[34rem] sm:px-8 sm:py-14 lg:min-h-[42rem] lg:px-12 lg:py-16">
          <div className="max-w-3xl border-l-2 border-cyan-400 pl-5 text-white sm:pl-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
              Arazi Digital Media
            </p>
            <h2
              id="careers-closing-heading"
              className="mt-4 text-3xl font-medium leading-[1.05] tracking-[-0.05em] sm:text-4xl lg:text-6xl"
            >
              The digital economy is still taking shape.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/85 sm:text-lg sm:leading-8">
              Our work brings people and disciplines together to help move it
              forward.
            </p>
            <Link
              href="/about"
              className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white underline decoration-white/60 underline-offset-4 transition-colors hover:decoration-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Get to know ADM
              <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
