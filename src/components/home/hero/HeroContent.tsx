import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroContent() {
  return (
    <div className="space-y-8">

      <span className="inline-flex rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">
        AI-First Digital Agency
      </span>

      <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-7xl">
        Building{" "}
        <span className="text-blue-600">
          Intelligent Digital Experiences
        </span>{" "}
        For Tomorrow
      </h1>

      <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
        ADM helps businesses transform through AI, software engineering,
        automation, cloud solutions, branding, and enterprise digital
        experiences.
      </p>

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">

        <Link
          href="/consultation"
          className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:scale-105 sm:w-auto"
        >
          Book Consultation
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>

        <Link
          href="/portfolio"
          className="inline-flex w-full items-center justify-center rounded-xl border px-8 py-4 font-semibold transition hover:bg-muted sm:w-auto"
        >
          View Portfolio
        </Link>

      </div>

    </div>
  );
}