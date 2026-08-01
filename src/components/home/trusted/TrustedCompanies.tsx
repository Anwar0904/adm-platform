import CompanyLogo from "./CompanyLogo";
import { trustedCompanies } from "./data";

const companies = [
  ...trustedCompanies,
  ...trustedCompanies,
];

export default function TrustedCompanies() {
  return (
    <section className="overflow-hidden border-y bg-slate-50 py-20 flex items-center flex-col">

      <div className="container mb-10">

        <p className="text-center text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
          Trusted By Innovative Companies
        </p>

      </div>

      <div className="group relative overflow-hidden">

        <div
          className="
          flex
          w-max
          gap-8
          animate-[marquee_35s_linear_infinite]
          group-hover:[animation-play-state:paused]
        "
        >
          {companies.map((company, index) => (
            <CompanyLogo
              key={`${company.id}-${index}`}
              name={company.name}
            />
          ))}
        </div>

      </div>

    </section>
  );
}