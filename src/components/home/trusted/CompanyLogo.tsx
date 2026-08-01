type Props = {
  name: string;
};

export default function CompanyLogo({ name }: Props) {
  return (
    <div
      className="
      flex
      h-20
      min-w-[180px]
      items-center
      justify-center
      rounded-2xl
      border
      bg-white
      px-8
      shadow-sm
      transition-all
      duration-300
      hover:-translate-y-1
      hover:border-blue-500
      hover:shadow-lg
    "
    >
      <span className="text-xl font-extrabold tracking-wider text-slate-700">
        {name}
      </span>
    </div>
  );
}