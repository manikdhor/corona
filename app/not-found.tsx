import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-navy">
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-gold/10 blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-gold/5 blur-3xl animate-float" style={{ animationDelay: "2s" }} />

      <div className="container-luxury relative z-10 text-center">
        <p className="font-serif text-[10rem] md:text-[14rem] font-bold text-gradient-gold leading-none">
          404
        </p>
        <h1 className="mt-4 font-serif text-display-md font-bold text-cream">
          Page Not Found
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-cream/70">
          The page you're looking for seems to have moved or no longer exists.
          Let's get you back on track.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button href="/" variant="gold" showArrow>
            Back to Home
          </Button>
          <Button href="/properties" variant="outline-light">
            Browse Properties
          </Button>
        </div>
      </div>
    </section>
  );
}
