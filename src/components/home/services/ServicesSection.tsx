import { services } from "./data";
import ServiceCard from "./ServiceCard";

export default async function ServicesSection() {
  const data = services;

  const featured = data.filter((x) => x.featured);
  const normal = data.filter((x) => !x.featured);

  return (
    <section className="py-32 flex items-center justify-center">

      <div className="container">

        <div className="mx-auto mb-20 max-w-3xl text-center">

          <span className="rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">
            What We Do
          </span>

          <h2 className="mt-6 text-5xl font-black">
            Digital Services Built For Growth
          </h2>

          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            From AI automation to enterprise software,
            ADM delivers solutions that help
            businesses innovate faster.
          </p>

        </div>

        <div className="grid gap-8 lg:grid-cols-6">

          {featured.map((service) => (
            <div
              key={service.id}
              className="lg:col-span-3"
            >
              <ServiceCard service={service} />
            </div>
          ))}

          {normal.map((service) => (
            <div
              key={service.id}
              className="lg:col-span-2"
            >
              <ServiceCard service={service} />
            </div>
          ))}

        </div>

      </div>

    </section>
  );
}