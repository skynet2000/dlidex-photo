import { useEffect, useMemo, useState } from "react"
import { Calendar, ChevronLeft, ChevronRight, Save, Trash2 } from "lucide-react"

interface AvailabilityData {
  startMonth: string
  totalMonths: number
  bookedDates: string[]
  note: string
}

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"]
const DEFAULT: AvailabilityData = {
  startMonth: "2026-08",
  totalMonths: 12,
  bookedDates: [],
  note: "档期以微信确认为准",
}

const pad = (n: number) => String(n).padStart(2, "0")
const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate()

function parseMonth(s: string) {
  const [y, m] = s.split("-").map(Number)
  return { year: y, month: m - 1 }
}

export function AvailabilityEditor() {
  const [data, setData] = useState<AvailabilityData>(DEFAULT)
  const [offset, setOffset] = useState(0)
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/api/availability")
      .then((r) => (r.ok ? r.json() : DEFAULT))
      .then((d: Partial<AvailabilityData>) => {
        setData({ ...DEFAULT, ...d })
        setLoaded(true)
      })
      .catch(() => {
        setData(DEFAULT)
        setLoaded(true)
      })
  }, [])

  const start = useMemo(() => parseMonth(data.startMonth), [data.startMonth])
  const safeOffset = Math.min(offset, Math.max(0, data.totalMonths - 1))
  const current = new Date(start.year, start.month + safeOffset, 1)
  const curYear = current.getFullYear()
  const curMonth = current.getMonth()
  const label = `${curYear} 年 ${curMonth + 1} 月`
  const firstWeekday = new Date(curYear, curMonth, 1).getDay()
  const totalDays = daysInMonth(curYear, curMonth)
  const today = new Date()
  const todayKey = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ]

  const bookedSet = useMemo(() => new Set(data.bookedDates), [data.bookedDates])

  function toggle(day: number) {
    const key = `${curYear}-${pad(curMonth + 1)}-${pad(day)}`
    setData((prev) => {
      const has = prev.bookedDates.includes(key)
      return {
        ...prev,
        bookedDates: has
          ? prev.bookedDates.filter((d) => d !== key)
          : [...prev.bookedDates, key].sort(),
      }
    })
    setMsg(null)
  }

  function setStart(year: number, month: number) {
    setData((prev) => ({ ...prev, startMonth: `${year}-${pad(month)}` }))
    setOffset(0)
    setMsg(null)
  }

  function clearAll() {
    if (typeof window !== "undefined" && window.confirm("确定清空所有已约标记？")) {
      setData((prev) => ({ ...prev, bookedDates: [] }))
      setMsg(null)
    }
  }

  async function save() {
    setSaving(true)
    setMsg({ type: "ok", text: "正在发布到线上 www.dlidex.work …" })
    try {
      const res = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = (await res.json().catch(() => ({}))) as any
      if (res.ok && json.ok && json.deployed) {
        setMsg({ type: "ok", text: "已保存并发布到线上 www.dlidex.work ✓ 刷新首页即可看到" })
      } else if (res.ok && json.ok && !json.deployed) {
        setMsg({
          type: "err",
          text: `本地已保存，但线上发布失败（${json.deployStep || "unknown"}）：${json.deployDetail || ""}`,
        })
      } else {
        setMsg({ type: "err", text: `保存失败（${res.status}）${json.error ? "：" + json.error : ""}` })
      }
    } catch {
      setMsg({ type: "err", text: "保存失败：网络错误" })
    } finally {
      setSaving(false)
    }
  }

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-neutral-400">
        加载中…
      </div>
    )
  }

  const now = new Date()
  const yearOpts = [
    now.getFullYear() - 1,
    now.getFullYear(),
    ...Array.from({ length: 4 }, (_, i) => now.getFullYear() + 1 + i),
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <Calendar className="h-6 w-6 text-[#c9a96e]" />
            <h1 className="text-2xl font-light tracking-wide">档期管理后台</h1>
          </div>
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#c9a96e] text-black text-sm font-medium hover:bg-[#d8b87e] transition-colors disabled:opacity-60 disabled:cursor-wait"
          >
            <Save className="h-4 w-4" /> {saving ? "发布中…" : "保存档期"}
          </button>
        </div>

        {msg && (
          <div
            className={`mb-4 px-4 py-2.5 rounded-lg text-sm ${
              msg.type === "ok"
                ? "bg-[#c9a96e]/10 text-[#c9a96e] border border-[#c9a96e]/30"
                : "bg-red-500/10 text-red-400 border border-red-500/30"
            }`}
          >
            {msg.text}
          </div>
        )}

        {/* 设置区 */}
        <div className="bg-[#141414] border border-white/5 rounded-2xl p-5 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="text-sm text-neutral-400 flex flex-col gap-1.5">
            起始年月
            <div className="flex gap-2">
              <select
                value={start.year}
                onChange={(e) => setStart(Number(e.target.value), start.month + 1)}
                className="flex-1 bg-black/40 border border-white/10 rounded-md px-2 py-1.5 text-white"
              >
                {yearOpts.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <select
                value={start.month + 1}
                onChange={(e) => setStart(start.year, Number(e.target.value))}
                className="flex-1 bg-black/40 border border-white/10 rounded-md px-2 py-1.5 text-white"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {m} 月
                  </option>
                ))}
              </select>
            </div>
          </label>

          <label className="text-sm text-neutral-400 flex flex-col gap-1.5">
            展示月数
            <input
              type="number"
              min={1}
              max={36}
              value={data.totalMonths}
              onChange={(e) =>
                setData((p) => ({ ...p, totalMonths: Math.max(1, Number(e.target.value) || 1) }))
              }
              className="bg-black/40 border border-white/10 rounded-md px-2 py-1.5 text-white"
            />
          </label>

          <label className="text-sm text-neutral-400 flex flex-col gap-1.5">
            底部备注
            <input
              type="text"
              value={data.note}
              onChange={(e) => setData((p) => ({ ...p, note: e.target.value }))}
              placeholder="留空则不显示"
              className="bg-black/40 border border-white/10 rounded-md px-2 py-1.5 text-white"
            />
          </label>
        </div>

        {/* 日历 */}
        <div className="bg-[#141414] border border-white/5 rounded-2xl p-5 sm:p-7">
          <div className="flex items-center justify-between mb-5">
            <button
              type="button"
              onClick={() => setOffset((v) => Math.max(0, v - 1))}
              disabled={safeOffset <= 0}
              className="p-2 rounded-md text-neutral-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-lg font-light tracking-wide">{label}</span>
            <button
              type="button"
              onClick={() => setOffset((v) => Math.min(data.totalMonths - 1, v + 1))}
              disabled={safeOffset >= data.totalMonths - 1}
              className="p-2 rounded-md text-neutral-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
            {WEEKDAYS.map((w) => (
              <div key={w} className="text-center text-xs text-neutral-500 py-1">
                {w}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {cells.map((day, idx) => {
              if (day === null) return <div key={`e-${idx}`} />
              const key = `${curYear}-${pad(curMonth + 1)}-${pad(day)}`
              const booked = bookedSet.has(key)
              const isPast = key < todayKey
              const isToday = key === todayKey
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggle(day)}
                  title={booked ? "点击改为可约" : "点击标记为已约"}
                  className={[
                    "relative aspect-square rounded-lg flex items-center justify-center text-sm sm:text-base transition-colors select-none",
                    booked
                      ? "bg-white/[0.04] text-neutral-600 line-through decoration-neutral-700 hover:bg-white/10"
                      : isPast
                        ? "bg-transparent text-neutral-700 hover:bg-white/5"
                        : "bg-[#c9a96e]/10 text-[#c9a96e] border border-[#c9a96e]/30 hover:bg-[#c9a96e]/20",
                    isToday && !booked ? "ring-1 ring-[#c9a96e] ring-offset-1 ring-offset-[#141414]" : "",
                  ].join(" ")}
                >
                  {day}
                  {isToday && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[8px] tracking-widest text-[#c9a96e]">
                      今
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-5 text-xs text-neutral-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#c9a96e]/20 border border-[#c9a96e]/40" />
              可约（点一下变已约）
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-white/[0.04] border border-white/10" />
              已约（再点一下取消）
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm border border-white/10" />
              已过
            </span>
            <button
              onClick={clearAll}
              className="ml-auto flex items-center gap-1 text-neutral-500 hover:text-red-400 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" /> 清空已约
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-neutral-600 mt-6">
          本地管理后台 · 仅开发预览可用 · 点「保存档期」即写入文件并自动发布到线上 www.dlidex.work
        </p>
      </div>
    </div>
  )
}
