const ecosystemUrl = process.env.NEXT_PUBLIC_LUREXA_ECOSYSTEM_URL ?? "https://lurexa.com";

const guides = [
  ["Getting started", "Understand the Lurexa ecosystem and its trusted learning model."],
  ["For educators", "Set up classes, build meaningful practice, and act on learning evidence."],
  ["For builders", "Use the shared Core and Mind contracts without duplicating learner data."],
];

export default function DocumentationHome() {
  return <main className="min-h-screen bg-slate-50 text-slate-950"><header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8"><a href={ecosystemUrl} className="text-lg font-bold tracking-tight">✦ Lurexa <span className="text-indigo-600">Docs</span></a><a href={ecosystemUrl} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-700">Ecosystem</a></div></header><section className="mx-auto max-w-6xl px-5 py-16 sm:px-8"><p className="text-xs font-bold tracking-[.18em] text-indigo-600">LUREXA DOCUMENTATION</p><h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">Build learning experiences on a shared foundation.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">Guidance for educators, product teams, and contributors building the Lurexa ecosystem responsibly.</p><div className="mt-12 grid gap-4 md:grid-cols-3">{guides.map(([title,description],index)=><a key={title} href={ecosystemUrl} className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md"><p className="text-sm font-bold text-indigo-600">0{index+1}</p><h2 className="mt-10 text-xl font-bold">{title}</h2><p className="mt-3 text-sm leading-6 text-slate-600">{description}</p><span className="mt-7 block text-sm font-bold text-indigo-600">Explore →</span></a>)}</div></section></main>;
}