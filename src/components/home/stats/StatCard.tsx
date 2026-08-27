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
  const value = parseInt(number, 10);
  const suffix = number.replace(/[0-9]/g, "");

  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-blue-500
        hover:shadow-lg
        sm:rounded-3xl
        sm:p-6
        lg:p-7
      "
    >
      <h3 className="text-3xl font-black tracking-tight text-blue-600 sm:text-4xl lg:text-5xl">
        <CountUp
          end={value}
          duration={2}
          enableScrollSpy
          scrollSpyOnce
        />
        {suffix}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500 sm:mt-3">
        {label}
      </p>
    </div>
  );
}