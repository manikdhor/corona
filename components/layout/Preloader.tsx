"use client";

interface PreloaderProps {
  logo?: string;
  name?: string;
}

export default function Preloader(_props: PreloaderProps = {}) {
  // Screen-blocking splash overlays cause jarring CLS and delay first paint.
  // Smooth route progression is handled seamlessly by RouteProgressBar.
  return null;
}
