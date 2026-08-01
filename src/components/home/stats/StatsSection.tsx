import Image from "next/image";

import { stats, features } from "./data";
import StatCard from "./StatCard";
import FeatureCard from "./FeatureCard";

export default function StatsSection() {
  return (
    <section className="bg-slate-50 py-32 flex justify-center">

      <div className="container grid gap-20 lg:grid-cols-2">

        <div>

          <span className="rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">
            Why ADM
          </span>

          <h2 className="mt-6 text-5xl font-black">
            Precision Engineering Meets Creative Innovation
          </h2>

          <p className="mt-8 text-lg leading-8 text-muted-foreground">
            We build AI-powered digital products that are
            scalable, secure, and designed for long-term
            business growth.
          </p>

          <div className="mt-12 space-y-8">

            {features.map((feature) => (
              <FeatureCard
                key={feature.title}
                {...feature}
              />
            ))}

          </div>

        </div>

        <div className="space-y-8">

          <div className="overflow-hidden rounded-[40px] shadow-xl">

            <Image
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80"
              alt="Team"
              width={800}
              height={700}
              className="h-[380px] w-full object-cover"
            />

          </div>

          <div className="grid gap-6 sm:grid-cols-3">

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

    </section>
  );
}