import { Camera } from "lucide-react"
import { siteConfig } from "@/data"

const quickLinks = [
  { href: "#portfolio", label: "作品集" },
  { href: "#about", label: "关于我" },
  { href: "#contact", label: "联系方式" },
]

export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Camera className="h-5 w-5 text-[#c9a96e]" />
              <span className="text-base font-light tracking-widest">
                {siteConfig.name}
              </span>
            </div>
            <p className="text-sm text-neutral-500 leading-relaxed">
              {siteConfig.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-medium text-neutral-300 mb-4 tracking-wide">
              快速链接
            </h3>
            <nav className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-neutral-500 hover:text-[#c9a96e] transition-colors w-fit"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-medium text-neutral-300 mb-4 tracking-wide">
              联系方式
            </h3>
            <div className="flex flex-col gap-2 text-sm text-neutral-500">
              <p>微信：{siteConfig.contact.wechat}</p>
              <p>邮箱：{siteConfig.contact.email}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col items-center gap-2">
          <p className="text-xs text-neutral-600">
            © {new Date().getFullYear()} {siteConfig.name} · Dlidex Photography. All rights
            reserved.
          </p>
        </div>

        {/* 备案号（合规要求，纯文字无图标） */}
        <div className="mt-2 flex items-center justify-center gap-2 text-xs text-neutral-600">
          <a
            href="https://beian.miit.gov.cn/#/Integrated/index"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#c9a96e] transition-colors"
          >
            浙ICP备2026058504号-2
          </a>
          <span className="text-neutral-700">·</span>
          <a
            href="https://beian.mps.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#c9a96e] transition-colors"
          >
            浙公网安备33011002020295号
          </a>
        </div>
      </div>
    </footer>
  )
}
