import { useState } from "react"
import { MessageCircle, Mail } from "lucide-react"
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
    <div
      id="contact"
      className="bg-[#141414] border border-white/5 rounded-2xl p-5 sm:p-7 h-full flex flex-col scroll-mt-20"
    >
      {/* 卡片标题 */}
      <div className="flex items-center gap-2.5 mb-6">
        <MessageCircle className="h-5 w-5 text-[#c9a96e]" />
        <h3 className="text-lg font-light tracking-wide text-white">联系方式</h3>
      </div>

      {/* 联系卡片列表 */}
      <div className="space-y-3">
        {contactMethods.map((method) => {
          const Icon = method.icon
          return (
            <div
              key={method.label}
              className="bg-[#0f0f0f] border border-white/5 rounded-xl p-4 flex flex-wrap items-center gap-3 sm:gap-4"
            >
              <div className="w-10 h-10 bg-[#c9a96e]/10 rounded-lg flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-[#c9a96e]" />
              </div>
              <div className="flex-1 min-w-[10rem]">
                <p className="text-sm text-neutral-300 mb-0.5">{method.label}</p>
                <p className="text-base text-neutral-100 break-all">{method.value}</p>
              </div>
              {method.actionType === "copy" ? (
                <button
                  onClick={() => handleCopy(method.value)}
                  className="ml-auto min-h-11 shrink-0 px-4 py-2 rounded-full border border-[#c9a96e] text-[#c9a96e] text-sm hover:bg-[#c9a96e] hover:text-[#0a0a0a] transition-colors"
                >
                  {copied ? "已复制 ✓" : copyError ? "复制失败" : method.action}
                </button>
              ) : method.href ? (
                <a
                  href={method.href}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-auto min-h-11 shrink-0 px-4 py-2 rounded-full border border-[#c9a96e] text-[#c9a96e] text-sm hover:bg-[#c9a96e] hover:text-[#0a0a0a] transition-colors"
                >
                  {method.action}
                </a>
              ) : null}
            </div>
          )
        })}
      </div>

      {/* 回复时间 — 靠底对齐 */}
      <div className="mt-auto pt-6">
        <div className="bg-[#0f0f0f] border border-white/5 rounded-xl p-4">
          <h4 className="text-sm font-light tracking-wide mb-1.5">回复时间</h4>
          <p className="text-sm text-neutral-300 leading-7">
            微信消息通常 2 小时内回复，邮件 24 小时内回复。
            <br />
            拍摄日可能回复较慢，急事请优先微信或邮件联系，感谢理解 🙏
          </p>
        </div>
      </div>
    </div>
  )
}
