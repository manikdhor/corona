"use client";

const HERO_SLIDES = [
  "/image-01.webp",
  "/image-02.webp",
  "/image-03.webp",
];

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-navy-900">
      <div className="absolute inset-0">
        {HERO_SLIDES.map((src, i) => (
          <img key={i} src={src} alt="" className="absolute inset-0 h-full w-full object-cover object-top"
            style={{ opacity: i === 0 ? 1 : 0, animation: `heroFade 20s ease-in-out ${i * 6.6}s infinite` }} />
        ))}
      </div>

      <style jsx>{`
        @keyframes heroFade {
          0%, 100% { opacity: 0; }
          15%, 40% { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
