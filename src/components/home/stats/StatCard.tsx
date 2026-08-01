"use client";

import CountUp from "react-countup";

type Props = {
  number: string;
  label: string;
};

export default function StatCard({
  number,
  label,
}: Props) {
  const value = parseInt(number);

  return (
    <div
      className="
      rounded-3xl
      border
      bg-white
      p-8
      shadow-sm
      transition
      hover:-translate-y-2
      hover:border-blue-600
      hover:shadow-xl
    "
    >
      <h3 className="text-5xl font-black text-blue-600">
        <CountUp end={value} duration={2} />

        {number.replace(/[0-9]/g, "")}
      </h3>

      <p className="mt-3 text-muted-foreground">
        {label}
      </p>
    </div>
  );
}