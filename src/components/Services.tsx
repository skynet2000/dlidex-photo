import { useState } from "react"
import { Check, Star, ChevronDown, Gift } from "lucide-react"
import { servicePackages, faqItems, providedProps } from "@/data"
import { cn } from "@/lib/cn"

function FaqItem({
  question,
  answer,
}: {
  question: string
  answer: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-[#141414] border border-white/5 rounded-lg px-6">
      <button
        className="w-full flex items-center justify-between gap-4 py-5 text-left text-sm text-neutral-200 hover:text-[#c9a96e] transition-colors"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {question}
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-[#c9a96e] transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <p className="text-neutral-400 text-sm leading-relaxed pb-5 animate-fade-in">
          {answer}
        </p>
      )}
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
            透明定价，用心服务，套餐内道具全部免费提供
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicePackages.map((pkg) => (
            <div
              key={pkg.id}
              className="relative bg-[#141414] border border-white/5 rounded-xl p-6 hover:border-[#c9a96e]/30 transition-colors flex flex-col"
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

        {/* Props */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="bg-[#141414] border border-white/5 rounded-xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-[#c9a96e]/10 rounded-lg flex items-center justify-center">
                <Gift className="h-5 w-5 text-[#c9a96e]" />
              </div>
              <div>
                <h3 className="text-lg font-light tracking-wide">领证跟拍道具</h3>
                <p className="text-xs text-neutral-500">无需额外准备，氛围感直接拉满</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {providedProps.map((prop) => (
                <span
                  key={prop}
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm text-neutral-300 bg-white/5 border border-white/10 hover:border-[#c9a96e]/30 transition-colors"
                >
                  {prop}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-24">
          <div className="text-center mb-10">
            <span className="text-sm tracking-[0.2em] text-[#c9a96e] uppercase">
              FAQ
            </span>
            <h2 className="text-3xl font-light tracking-wide mt-2">常见问题</h2>
          </div>
          <div className="space-y-2">
            {faqItems.map((faq, i) => (
              <FaqItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
