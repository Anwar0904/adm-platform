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
    <div className="flex gap-4">

      <CheckCircle2 className="mt-1 h-6 w-6 text-blue-600" />

      <div>

        <h4 className="font-bold">
          {title}
        </h4>

        <p className="mt-2 text-muted-foreground leading-7">
          {description}
        </p>

      </div>

    </div>
  );
}