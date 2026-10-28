export default function Loading() {
  return (
    <div className="relative w-full min-h-[50vh] flex flex-col items-center justify-center py-24 px-4 bg-transparent animate-fade-in">
      {/* Top glowing gold stream indicator */}
      <div className="fixed top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-gold-500 via-gold-300 to-gold-600 shadow-[0_0_12px_rgba(201,169,110,0.85)] animate-pulse z-[99999]" />

      {/* Subtle luxury brand spinner */}
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 rounded-full border border-gold-500/25 flex items-center justify-center bg-navy-950/5">
          <div className="h-5 w-5 rounded-full border-2 border-gold-500 border-t-transparent animate-spin" />
        </div>
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.25em] text-gold-600/75">
          Corona Properties
        </p>
      </div>
    </div>
  );
}
