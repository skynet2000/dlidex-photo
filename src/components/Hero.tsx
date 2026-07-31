import { useEffect, useState } from "react"
import { ArrowRight, Camera, CalendarCheck } from "lucide-react"
import { siteConfig } from "@/data"

// 占位渐变背景，无真实大图时的优雅替代
const heroGradients = [
  "from-amber-900/30 via-stone-900/50 to-neutral-950",
  "from-rose-900/20 via-stone-900/50 to-neutral-950",
  "from-sky-900/20 via-stone-900/50 to-neutral-950",
]

export function Hero() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroGradients.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${heroGradients[current]} transition-all duration-[2000ms]`}
      />
      {/* Gold glow accents */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(40rem_30rem_at_20%_-10%,rgba(201,169,110,0.12),transparent_55%),radial-gradient(35rem_25rem_at_90%_15%,rgba(201,169,110,0.08),transparent_55%)]" />
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="animate-fade-in-up">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Camera className="h-5 w-5 text-[#c9a96e]" />
            <span className="text-sm tracking-[0.3em] text-[#c9a96e] uppercase">
              Photographer
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extralight tracking-wide mb-6">
            {siteConfig.name}
          </h1>

          <p className="text-lg md:text-xl text-neutral-300 font-light tracking-wide mb-10 max-w-2xl mx-auto">
            {siteConfig.tagline}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-md bg-[#c9a96e] text-[#0a0a0a] hover:bg-[#dfc499] transition-all text-base font-medium"
            >
              联系我
              <CalendarCheck className="h-4 w-4" />
            </a>
            <a
              href="#portfolio"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-md border border-[#c9a96e]/50 text-[#c9a96e] hover:bg-[#c9a96e] hover:text-[#0a0a0a] transition-all text-base"
            >
              查看作品
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <p className="mt-6 text-sm text-neutral-400">
            杭州 · 绍兴 · 记录你的重要时刻
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#portfolio"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
        aria-label="向下滚动"
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
          <div className="w-1.5 h-3 bg-white/40 rounded-full" />
        </div>
      </a>
    </section>
  )
}
