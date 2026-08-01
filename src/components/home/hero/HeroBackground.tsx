export default function HeroBackground() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-slate-100" />

      <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[150px]" />

      <div className="absolute bottom-0 right-0 h-[600px] w-[600px] rounded-full bg-sky-400/20 blur-[180px]" />
    </>
  );
}