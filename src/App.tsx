import { useEffect } from "react"
import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { Portfolio } from "@/components/Portfolio"
import { About } from "@/components/About"
import { Availability } from "@/components/Availability"
import { Services } from "@/components/Services"
import { Contact } from "@/components/Contact"
import { Footer } from "@/components/Footer"

function scrollToHash() {
  const hash = window.location.hash
  if (!hash) return
  const id = hash.replace("#", "")
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: "smooth" })
  }
}

export default function App() {
  useEffect(() => {
    // 首次挂载后处理 hash 滚动（React 挂载晚于浏览器默认 hash 滚动）
    const timer = setTimeout(scrollToHash, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Portfolio />
        <About />
        {/* 预约与联系：档期 + 联系方式 双子卡（桌面并排、移动堆叠） */}
        <section id="booking" className="py-24 px-4 scroll-mt-20 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-sm tracking-[0.2em] text-[#c9a96e] uppercase">
                Booking
              </span>
              <h2 className="text-4xl md:text-5xl font-light tracking-wide mt-2">
                预约与联系
              </h2>
              <p className="text-neutral-400 mt-4 max-w-lg mx-auto">
                先看看可约档期，再找我聊聊你的拍摄计划
              </p>
            </div>
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
              <Availability />
              <Contact />
            </div>
          </div>
        </section>
        <Services />
        {/* <Services /> （保留注释便于回退） */}
      </main>
      <Footer />
    </div>
  )
}
