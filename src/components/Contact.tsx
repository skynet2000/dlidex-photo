import { useState } from "react"
import { MessageCircle, ExternalLink, Mail } from "lucide-react"
import { siteConfig } from "@/data"

const contactMethods = [
  {
    icon: MessageCircle,
    label: "微信",
    value: siteConfig.contact.wechat,
    action: "复制微信号",
    actionType: "copy" as const,
  },
  {
    icon: ExternalLink,
    label: "小红书",
    value: siteConfig.contact.xiaohongshu,
    action: "前往主页",
    actionType: "link" as const,
    href: siteConfig.social.xiaohongshu || null,
  },
  {
    icon: Mail,
    label: "邮箱",
    value: siteConfig.contact.email,
    action: "发送邮件",
    actionType: "link" as const,
    href: `mailto:${siteConfig.contact.email}`,
  },
]

async function copyText(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // fallback
    }
  }
  // textarea fallback
  const ta = document.createElement("textarea")
  ta.value = text
  ta.setAttribute("readonly", "")
  ta.style.position = "fixed"
  ta.style.left = "-9999px"
  document.body.appendChild(ta)
  ta.focus()
  ta.select()
  try {
    const ok = document.execCommand("copy")
    document.body.removeChild(ta)
    return ok
  } catch {
    document.body.removeChild(ta)
    return false
  }
}

export function Contact() {
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)

  const handleCopy = async (text: string) => {
    setCopyError(false)
    const ok = await copyText(text)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } else {
      setCopyError(true)
      setTimeout(() => setCopyError(false), 2000)
    }
  }

  return (
    <section id="contact" className="py-24 px-4 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-sm tracking-[0.2em] text-[#c9a96e] uppercase">
            Contact
          </span>
          <h2 className="text-4xl md:text-5xl font-light tracking-wide mt-2">
            联系方式
          </h2>
          <p className="text-neutral-400 mt-4 max-w-lg mx-auto">
            欢迎沟通拍摄需求，我会尽快回复你
          </p>
        </div>

        {/* Contact Methods — single centered column */}
        <div className="max-w-2xl mx-auto space-y-4">
          {contactMethods.map((method) => {
            const Icon = method.icon
            return (
              <div
                key={method.label}
                className="bg-[#141414] border border-white/5 rounded-xl p-5 flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-[#c9a96e]/10 rounded-lg flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-[#c9a96e]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-neutral-500 mb-0.5">
                    {method.label}
                  </p>
                  <p className="text-sm text-neutral-300 truncate">
                    {method.value}
                  </p>
                </div>
                {method.actionType === "copy" ? (
                  <button
                    onClick={() => handleCopy(method.value)}
                    className="shrink-0 px-4 py-2 rounded-full border border-[#c9a96e] text-[#c9a96e] text-sm hover:bg-[#c9a96e] hover:text-[#0a0a0a] transition-colors"
                  >
                    {copied ? "已复制 ✓" : copyError ? "复制失败" : method.action}
                  </button>
                ) : method.href ? (
                  <a
                    href={method.href}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 px-4 py-2 rounded-full border border-[#c9a96e] text-[#c9a96e] text-sm hover:bg-[#c9a96e] hover:text-[#0a0a0a] transition-colors"
                  >
                    {method.action}
                  </a>
                ) : null}
              </div>
            )
          })}

          <div className="bg-[#141414] border border-white/5 rounded-xl p-5">
            <h3 className="text-sm font-light tracking-wide mb-2">回复时间</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              微信消息通常 2 小时内回复，邮件 24 小时内回复。
              <br />
              拍摄日可能回复较慢，急事可以小红书主页留言，感谢理解 🙏
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
