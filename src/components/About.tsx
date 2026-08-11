import { Aperture } from "lucide-react"
import { aboutInfo } from "@/data"
import { asset } from "@/lib/asset"

export function About() {
  return (
    <section id="about" className="py-24 px-4 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-sm tracking-[0.2em] text-[#c9a96e] uppercase">
            About
          </span>
          <h2 className="text-4xl md:text-5xl font-light tracking-wide mt-2">
            关于我
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Bio Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Avatar Placeholder */}
            <div className="flex flex-col items-center">
              <div className="w-48 h-48 rounded-full overflow-hidden mb-4 border border-white/10 ring-1 ring-white/5 shadow-lg shadow-black/40">
                <img
                  src={asset(aboutInfo.avatar)}
                  alt={aboutInfo.name}
                  width={192}
                  height={192}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="text-xl font-light tracking-wide mt-2">
                {aboutInfo.name}
              </h3>
              <p className="text-[#c9a96e] text-sm">{aboutInfo.title}</p>
            </div>

            {/* Bio Text */}
            <div className="md:col-span-2 flex flex-col justify-center">
              {aboutInfo.bio.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-neutral-300 leading-relaxed mb-4 last:mb-0"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-16">
            {aboutInfo.stats.map((stat) => (
              <div
                key={stat.label}
                className="min-w-0 text-center bg-[#141414] border border-white/5 rounded-xl p-3 sm:p-6"
              >
                <p className="text-base sm:text-2xl lg:text-3xl font-light text-[#c9a96e] mb-1 break-words">
                  {stat.value}
                </p>
                <p className="text-[10px] sm:text-xs text-neutral-500 break-words">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Equipment */}
          <div className="bg-[#141414] border border-white/5 rounded-xl p-8">
            <h3 className="flex items-center gap-2 text-lg font-light tracking-wide mb-4">
              <Aperture className="h-5 w-5 text-[#c9a96e]" />
              常用器材
            </h3>
            <div className="flex flex-wrap gap-3">
              {aboutInfo.equipment.map((item) => (
                <span
                  key={item}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-neutral-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
