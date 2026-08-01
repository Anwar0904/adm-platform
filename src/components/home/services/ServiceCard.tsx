import Image from "next/image";
import Link from "next/link";
import * as Icons from "lucide-react";

import { ServiceItem } from "./types";

type Props = {
  service: ServiceItem;
};

export default function ServiceCard({ service }: Props) {
  const Icon = Icons[service.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }> || Icons.Box;

  return (
    <article
      className="
      group
      overflow-hidden
      rounded-3xl
      border
      bg-white
      transition-all
      duration-500
      hover:-translate-y-2
      hover:shadow-2xl
      hover:border-blue-500
    "
    >
      <div className="relative h-60 overflow-hidden">

        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        <div className="absolute left-6 top-6 rounded-2xl bg-white/90 p-3 backdrop-blur">

          <Icon className="h-7 w-7 text-blue-600" />

        </div>

      </div>

      <div className="space-y-5 p-8">

        <h3 className="text-2xl font-bold">
          {service.title}
        </h3>

        <p className="leading-7 text-muted-foreground">
          {service.description}
        </p>

        <Link
          href="/services"
          className="inline-flex items-center gap-2 font-semibold text-blue-600 transition group-hover:gap-3"
        >
          Learn More

          <Icons.ArrowRight className="h-5 w-5" />

        </Link>

      </div>
    </article>
  );
}