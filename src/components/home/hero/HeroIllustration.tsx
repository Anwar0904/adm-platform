import Image from "next/image";

export default function HeroIllustration() {
  return (
    <div className="relative">

      <div className="absolute inset-0 rounded-[40px] bg-blue-500/20 blur-3xl" />

      <div className="relative aspect-square overflow-hidden rounded-[40px] border bg-white shadow-2xl">

        <Image
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTy5vblLpCKcR3_xl62UyN0Bjc4bIFFzHOkdpBvzcyPFw&s=10"
          alt="ADM Dashboard"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition duration-700 hover:scale-105"
          priority
        />

      </div>

    </div>
  );
}