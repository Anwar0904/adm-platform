import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";
import HeroIllustration from "./HeroIllustration";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden py-20 sm:py-24 lg:py-28 flex items-center justify-center">
      <HeroBackground />

      <div className="container relative z-10 grid gap-12 md:gap-16 lg:grid-cols-2 items-center">
        <HeroContent />
        <HeroIllustration />
      </div>
    </section>
  );
}