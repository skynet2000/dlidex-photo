import { useEffect, useState } from "react"
import { Camera, Menu, X } from "lucide-react"
import { siteConfig } from "@/data"

const navLinks = [
  { href: "#portfolio", label: "作品集" },
  { href: "#booking", label: "档期" },
  { href: "#about", label: "关于我" },
  { href: "#contact", label: "联系方式" },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  // 移动端菜单打开时锁定 body 滚动，避免背景双滚动（GAP-003）
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo — 左侧 */}
          <div className="flex-1 flex justify-start">
            <a
              href="#home"
              className="flex items-center gap-2 group"
              aria-label="返回顶部"
            >
              <Camera className="h-6 w-6 text-[#c9a96e] transition-transform group-hover:scale-110" />
              <span className="text-lg font-light tracking-widest text-white">
                {siteConfig.name}
              </span>
            </a>
          </div>

          {/* Desktop Nav — 居中 */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm tracking-wide text-neutral-400 hover:text-white hover:bg-white/5 rounded-md transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* 右侧：移动端菜单按钮 / 桌面端留白占位，保持导航视觉居中 */}
          <div className="flex-1 flex justify-end">
            <button
              className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "关闭菜单" : "打开菜单"}
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {open && (
        <div className="md:hidden bg-[#0a0a0a] border-b border-white/5 animate-fade-in">
          <div className="px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-sm tracking-wide text-neutral-300 hover:text-[#c9a96e] hover:bg-white/5 rounded-md transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
