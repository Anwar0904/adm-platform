import Image from "next/image";

import { stats, features } from "./data";
import StatCard from "./StatCard";
import FeatureCard from "./FeatureCard";

export default function StatsSection() {
  return (
    <section className="flex justify-center bg-slate-50 px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
      <div className="container w-full">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16 xl:gap-24">

          {/* Content */}
          <div className="min-w-0">
            <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-xs font-semibold text-blue-700 sm:px-5 sm:text-sm">
              Why ADM
            </span>

            <h2 className="mt-5 max-w-2xl text-3xl font-black leading-tight tracking-tight text-slate-900 sm:mt-6 sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-6xl">
              Precision Engineering Meets Creative Innovation
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:mt-8 sm:text-lg sm:leading-8">
              We build AI-powered digital products that are scalable,
              secure, and designed for long-term business growth.
            </p>

            <div className="mt-9 space-y-7 sm:mt-12 sm:space-y-8">
              {features.map((feature) => (
                <FeatureCard
                  key={feature.title}
                  {...feature}
                />
              ))}
            </div>
          </div>

          {/* Visual + Stats */}
          <div className="min-w-0 space-y-6 sm:space-y-8">
            <div className="relative overflow-hidden rounded-3xl shadow-xl sm:rounded-[40px]">
              <Image
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80"
                alt="ADM team collaborating on digital solutions"
                width={1200}
                height={900}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-[280px] w-full object-cover sm:h-[360px] lg:h-[400px]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
              {stats.map((item) => (
                <StatCard
                  key={item.id}
                  number={item.number}
                  label={item.label}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}