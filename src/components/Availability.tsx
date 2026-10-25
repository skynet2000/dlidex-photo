import { useEffect, useMemo, useState } from "react"
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { availabilityConfig } from "@/data"
import { asset } from "@/lib/asset"

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"]

interface AvailabilityData {
  startMonth: string
  totalMonths: number
  bookedDates: string[]
  note: string
}

function parseMonth(monthStr: string): { year: number; month: number } {
  const [y, m] = monthStr.split("-").map(Number)
  return { year: y, month: m - 1 }
}

function monthLabel(year: number, month: number) {
  return `${year} 年 ${month + 1} 月`
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function isBooked(year: number, month: number, day: number, booked: string[]) {
  const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  return booked.includes(key)
}

export function Availability() {
  const [config, setConfig] = useState<AvailabilityData>(availabilityConfig)
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")
  const [attempt, setAttempt] = useState(0)

  // 运行时从 availability.json 拉取最新档期（由「档期管理后台」发布）。
  // 只有成功读取并校验数据后才展示日历，避免把未知档期当成可约。
  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false
    const timeout = window.setTimeout(() => controller.abort(), 10000)
    setStatus("loading")
    fetch(asset("availability.json") + "?t=" + Date.now(), {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((r) => {
        if (!r.ok) throw new Error("Availability request failed")
        return r.json()
      })
      .then((d) => {
        if (
          !d || typeof d !== "object" ||
          typeof d.startMonth !== "string" || !/^\d{4}-(0[1-9]|1[0-2])$/.test(d.startMonth) ||
          !Number.isInteger(d.totalMonths) || d.totalMonths < 1 ||
          !Array.isArray(d.bookedDates) ||
          !d.bookedDates.every((date: unknown) => typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date))
        ) {
          throw new Error("Invalid availability data")
        }
        if (cancelled) return
        setConfig({
          startMonth: d.startMonth,
          totalMonths: d.totalMonths,
          bookedDates: d.bookedDates,
          note: typeof d.note === "string" ? d.note : availabilityConfig.note,
        })
        setStatus("ready")
      })
      .catch(() => {
        if (!cancelled) setStatus("error")
      })
      .finally(() => window.clearTimeout(timeout))
    return () => {
      cancelled = true
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [attempt])

  const start = useMemo(() => parseMonth(config.startMonth), [config.startMonth])
  const [offset, setOffset] = useState(0)

  // 若线上配置的展示月数比本地默认小，钳制偏移量
  const safeOffset = Math.min(offset, Math.max(0, config.totalMonths - 1))

  const current = new Date(start.year, start.month + safeOffset, 1)
  const currentYear = current.getFullYear()
  const currentMonth = current.getMonth()
  const label = monthLabel(currentYear, currentMonth)

  const firstWeekday = new Date(currentYear, currentMonth, 1).getDay()
  const totalDays = daysInMonth(currentYear, currentMonth)

  const today = new Date()
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
    today.getDate(),
  ).padStart(2, "0")}`

  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ]

  const prevDisabled = safeOffset <= 0
  const nextDisabled = safeOffset >= config.totalMonths - 1

  return (
    <div
      id="availability"
      className="bg-[#141414] border border-white/5 rounded-2xl p-5 sm:p-7 h-full flex flex-col scroll-mt-20"
    >
      {/* 卡片标题 */}
      <div className="flex items-center gap-2.5 mb-6">
        <Calendar className="h-5 w-5 text-[#c9a96e]" />
        <h3 className="text-lg font-light tracking-wide text-white">可约档期</h3>
      </div>

      {status !== "ready" ? (
        <div className="flex min-h-72 flex-1 flex-col items-center justify-center gap-4 text-center" role="status" aria-live="polite">
          <p className="text-base text-neutral-200">
            {status === "loading" ? "正在加载最新档期…" : "档期暂时无法加载，请联系确认"}
          </p>
          {status === "error" && (
            <button
              type="button"
              onClick={() => setAttempt((v) => v + 1)}
              className="min-h-11 rounded-full border border-[#c9a96e] px-6 py-2 text-sm text-[#dfc499] hover:bg-[#c9a96e]/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c9a96e]"
            >
              重新加载
            </button>
          )}
        </div>
      ) : (
        <>
      {/* 月份切换 */}
      <div className="flex items-center justify-between mb-5">
        <button
          type="button"
          onClick={() => setOffset((v) => Math.max(0, v - 1))}
          disabled={prevDisabled}
          aria-label="上一个月"
          className="p-2 rounded-md text-neutral-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neutral-400"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-lg font-light tracking-wide text-white">{label}</span>
        <button
          type="button"
          onClick={() => setOffset((v) => Math.min(config.totalMonths - 1, v + 1))}
          disabled={nextDisabled}
          aria-label="下一个月"
          className="p-2 rounded-md text-neutral-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neutral-400"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* 星期表头 */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
        {WEEKDAYS.map((w) => (
          <div key={w} className="text-center text-sm text-neutral-300 py-1">
            {w}
          </div>
        ))}
      </div>

      {/* 日期网格 */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {cells.map((day, idx) => {
          if (day === null) return <div key={`empty-${idx}`} />
          const key = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(
            day,
          ).padStart(2, "0")}`
          const booked = isBooked(currentYear, currentMonth, day, config.bookedDates)
          const isPast = key < todayKey
          const isToday = key === todayKey
          return (
            <div
              key={key}
              title={isPast ? `${day} 日已过` : booked ? `${day} 日已约` : `${day} 日可约`}
              className={[
                "relative aspect-square min-h-11 rounded-lg flex items-center justify-center text-base transition-colors select-none",
                booked
                  ? "bg-white/[0.04] text-neutral-300 line-through decoration-neutral-400"
                  : isPast
                    ? "bg-transparent text-neutral-400"
                    : "bg-[#c9a96e]/10 text-[#c9a96e] border border-[#c9a96e]/30 hover:bg-[#c9a96e]/20",
                isToday && !booked ? "ring-1 ring-[#c9a96e] ring-offset-1 ring-offset-[#141414]" : "",
              ].join(" ")}
            >
              {day}
              {isToday && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] leading-3 text-[#dfc499]">
                  今
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* 图例 */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-5 text-sm text-neutral-300">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-[#c9a96e]/20 border border-[#c9a96e]/40" />
          可约
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-white/[0.04] border border-white/10" />
          已约
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm border border-white/10" />
          已过
        </span>
        {config.note && <span className="w-full leading-relaxed text-neutral-300">{config.note}</span>}
      </div>
        </>
      )}
    </div>
  )
}
