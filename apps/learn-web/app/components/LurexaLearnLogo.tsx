import Link from "next/link";

export function LurexaLearnLogo({ inverse = false }: { inverse?: boolean }) {
  const wordmark = inverse ? "text-white" : "text-slate-950";
  const label = inverse ? "text-sky-200" : "text-indigo-700";

  return (
    <Link href="/" className="inline-flex items-center gap-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2" aria-label="Lurexa Learn home">
      <span className="relative grid h-9 w-9 place-items-center" aria-hidden="true">
        <span className="absolute h-4 w-4 -translate-x-1 -translate-y-1 rotate-45 rounded-[3px] bg-indigo-500" />
        <span className="absolute h-3 w-3 translate-x-2 -translate-y-1 rotate-45 rounded-[3px] bg-sky-300" />
        <span className="absolute h-3 w-3 translate-y-2 rotate-45 rounded-[3px] bg-teal-300" />
      </span>
      <span className="leading-none"><span className={`block text-lg font-bold tracking-tight ${wordmark}`}>lurexa</span><span className={`mt-1 block text-[10px] font-bold tracking-[0.2em] ${label}`}>LEARN</span></span>
    </Link>
  );
}
