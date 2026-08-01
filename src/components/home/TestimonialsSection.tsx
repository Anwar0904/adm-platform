import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "CEO • Nexus Technologies",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    review:
      "ADM completely transformed our business. Their AI-powered solutions improved efficiency beyond our expectations.",
  },
  {
    id: 2,
    name: "Michael Anderson",
    role: "Founder • Quantum Labs",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    review:
      "Professional team, outstanding communication and an exceptional final product. Highly recommended.",
  },
  {
    id: 3,
    name: "Emily Carter",
    role: "Director • Lumina Health",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    review:
      "Working with ADM felt like working with our own engineering team. Incredible quality and attention to detail.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-32 flex justify-center">

      <div className="container">

        <div className="mb-16 text-center">

          <span className="rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">
            Testimonials
          </span>

          <h2 className="mt-6 text-5xl font-black">
            Trusted By Amazing Clients
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            We measure success through long-term partnerships and
            client satisfaction.
          </p>

        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {testimonials.map((item) => (
            <article
              key={item.id}
              className="group rounded-3xl border bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-blue-600 hover:shadow-2xl"
            >

              <div className="mb-6 flex">

                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}

              </div>

              <p className="leading-8 text-muted-foreground">
                "{item.review}"
              </p>

              <div className="mt-10 flex items-center gap-4">

                <div className="relative h-16 w-16 overflow-hidden rounded-full">

                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />

                </div>

                <div>

                  <h4 className="font-bold">
                    {item.name}
                  </h4>

                  <p className="text-sm text-muted-foreground">
                    {item.role}
                  </p>

                </div>

              </div>

            </article>
          ))}

        </div>

        <div className="mt-16 text-center">

          <Link
            href="/testimonials"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:scale-105 hover:shadow-xl"
          >
            View All Testimonials

            <ArrowRight className="h-5 w-5" />

          </Link>

        </div>

      </div>

    </section>
  );
}