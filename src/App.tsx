import { useEffect } from "react"
import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { Portfolio } from "@/components/Portfolio"
import { About } from "@/components/About"
// import { Services } from "@/components/Services"  // 已屏蔽：服务与报价模块不符合个人备案要求
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
        {/* <Services /> */}
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
