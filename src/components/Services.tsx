import { useState } from "react"
import { Check, Star } from "lucide-react"
import { servicePackages, faqItems } from "@/data"
import { cn } from "@/lib/cn"

function FaqItem({ faq }: { faq: { question: string; answer: string } }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-t border-white/5">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
      >
        <span className="text-[15px] text-neutral-300 group-hover:text-white transition-colors">
          {faq.question}
        </span>
        <span className="shrink-0 text-xl leading-none text-[#c9a96e] select-none">
          {open ? "−" : "+"}
        </span>
      </button>
      <div
        className={cn(
          "grid transition-all duration-300 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <p className="pb-5 text-sm text-neutral-500 leading-[1.8]">
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  )
}

export function Services() {
  return (
    <section id="services" className="py-24 px-4 bg-[#0d0d0d] scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-sm tracking-[0.2em] text-[#c9a96e] uppercase">
            Services
          </span>
          <h2 className="text-4xl md:text-5xl font-light tracking-wide mt-2">
            服务与报价
          </h2>
          <p className="text-neutral-400 mt-4 max-w-lg mx-auto">
            透明定价，用心服务，套餐内容一目了然
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicePackages.map((pkg) => (
            <div
              key={pkg.id}
              className={cn(
                "relative bg-[#141414] border rounded-xl p-6 transition-colors flex flex-col",
                pkg.popular
                  ? "border-[#c9a96e]/40"
                  : "border-white/5 hover:border-[#c9a96e]/30",
              )}
            >
              {pkg.popular && (
                <span className="absolute -top-3 left-6 inline-flex items-center gap-1 bg-[#c9a96e] text-[#0a0a0a] text-xs px-3 py-1 rounded-full font-medium">
                  <Star className="h-3 w-3" />
                  最受欢迎
                </span>
              )}
              <h3 className="text-lg font-light tracking-wide mb-1">
                {pkg.name}
              </h3>
              <p className="text-3xl font-light text-[#c9a96e] mb-1">
                {pkg.price}
              </p>
              <p className="text-xs text-neutral-500 mb-4">{pkg.deposit}</p>
              <p className="text-sm text-neutral-500 mb-6">{pkg.description}</p>
              <ul className="space-y-2.5 mb-4 flex-1">
                {pkg.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-neutral-400"
                  >
                    <Check className="h-4 w-4 text-[#c9a96e] mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-[#c9a96e]/80 mb-6">{pkg.location}</p>
              <a
                href="#contact"
                className={cn(
                  "w-full text-center py-2.5 rounded-md text-sm transition-colors",
                  pkg.popular
                    ? "bg-[#c9a96e] text-[#0a0a0a] hover:bg-[#dfc499]"
                    : "border border-white/10 text-neutral-300 hover:border-[#c9a96e] hover:text-[#c9a96e]",
                )}
              >
                立即预约
              </a>
            </div>
          ))}
        </div>

        {/* FAQ — 极简手风琴 */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <span className="text-sm tracking-[0.2em] text-[#c9a96e] uppercase">
              FAQ
            </span>
            <h3 className="text-3xl md:text-4xl font-light tracking-wide mt-2">
              常见问题
            </h3>
            <p className="text-neutral-400 mt-3 max-w-md mx-auto">
              整理了大家最关心的几个问题，没找到答案也欢迎随时找我聊
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            {faqItems.map((faq, i) => (
              <FaqItem key={i} faq={faq} />
            ))}
            <div className="border-t border-white/5" />
          </div>
        </div>
      </div>
    </section>
  )
}
