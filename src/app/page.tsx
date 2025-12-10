import Squares from "@/components/Squares";

const stats = [
  { label: "Hours of building", value: "36" },
  { label: "Total prizes", value: "$10k" },
  { label: "Builders", value: "300+" },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <Squares
        className="absolute inset-0 h-full w-full"
        speed={0.5}
        squareSize={40}
        direction="diagonal"
        borderColor="#fff"
        hoverFillColor="#222"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/75 to-black" aria-hidden />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center gap-10 px-6 py-24 text-center sm:gap-12 sm:px-12">
        <p className="text-xs font-semibold uppercase tracking-[0.6em] text-zinc-300">
          CarbonX Hackathon
        </p>
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            Build climate tech that scales impact.
          </h1>
          <p className="text-lg text-zinc-300 sm:text-xl">
            Join 300+ engineers, designers, and founders for a 36-hour sprint focused on carbon capture,
            sustainable AI, and resilient energy systems.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <a
            className="rounded-full bg-white/90 px-8 py-3 text-sm font-semibold uppercase tracking-wide text-black transition hover:bg-white"
            href="#register"
          >
            Register interest
          </a>
          <a
            className="rounded-full border border-white/30 px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:border-white hover:text-white"
            href="#about"
          >
            View tracks
          </a>
        </div>

        <dl className="grid w-full gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="space-y-1">
              <dt className="text-xs uppercase tracking-[0.3em] text-zinc-400">{stat.label}</dt>
              <dd className="text-3xl font-semibold">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </main>
    </div>
  );
}
