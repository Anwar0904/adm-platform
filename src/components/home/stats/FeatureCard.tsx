import { CheckCircle2 } from "lucide-react";

type Props = {
  title: string;
  description: string;
};

export default function FeatureCard({
  title,
  description,
}: Props) {
  return (
    <div className="flex items-start gap-3 sm:gap-4">
      <div className="mt-0.5 shrink-0 rounded-full bg-blue-100 p-1">
        <CheckCircle2 className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6" />
      </div>

      <div className="min-w-0">
        <h4 className="text-base font-bold text-slate-900 sm:text-lg">
          {title}
        </h4>

        <p className="mt-1.5 max-w-xl text-sm leading-6 text-slate-600 sm:mt-2 sm:text-base sm:leading-7">
          {description}
        </p>
      </div>
    </div>
  );
}