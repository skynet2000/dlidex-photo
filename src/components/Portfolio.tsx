import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react"
import Lightbox from "yet-another-react-lightbox"
import Zoom from "yet-another-react-lightbox/plugins/zoom"
import "yet-another-react-lightbox/styles.css"
import {
  portfolioItems,
  portfolioCategories,
  portfolioAlbums,
  type PortfolioCategoryId,
  type PortfolioItem,
} from "@/data"
import { cn } from "@/lib/cn"
import { asset } from "@/lib/asset"

// 所有真实客片分类都参与「每次刷新网站随机打乱一次」
// 占位图（placeholder）已被过滤掉，这里按 category 分组维护各自的随机顺序。

// 单张作品卡：共用 hover 放大图标、点击进灯箱、键盘可达
function GalleryImage({
  item,
  index,
  onOpen,
  className,
  style,
  priority,
}: {
  item: PortfolioItem
  index: number
  onOpen: (i: number) => void
  className?: string
  style?: CSSProperties
  priority?: boolean
}) {
  const imgRef = useRef<HTMLImageElement>(null)
  const [inView, setInView] = useState(false)
  const [loaded, setLoaded] = useState(false)

  // 横向滑动布局下原生 loading="lazy" 对 Safari 支持差，用 IO 精确控制：
  // 图片进入视口前 300px 才加载，首屏只拉视口内几张，大幅减少首屏传输量。
  useEffect(() => {
    const el = imgRef.current
    if (!el) return
    // 首屏优先图：直接加载、不等 IO，配合 fetchpriority=high 让浏览器抢先拉取
    if (priority) {
      setInView(true)
      return
    }
    if (typeof IntersectionObserver === "undefined") {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true)
          io.disconnect()
        }
      },
      { rootMargin: "300px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <figure
      role="button"
      tabIndex={0}
      aria-label={`查看作品：${item.title}`}
      onClick={() => onOpen(index)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onOpen(index)
        }
      }}
      style={style}
      className={cn(
        "group relative cursor-pointer animate-fade-in-up overflow-hidden rounded-xl bg-neutral-900 ring-1 ring-white/5 shadow-lg shadow-black/40 transition-all duration-500 hover:ring-[#c9a96e]/40",
        className,
      )}
    >
      {/* 固定高度 + 宽度按原图比例自然展开：object-contain 保证整图完整展示、绝不裁剪，
          也不锁卡片 aspect-ratio，彻底避免比例不一致导致的左右黑边。
          原生 width/height 让浏览器在加载前就能按真实比例预留宽度，防止未加载时卡片塌缩。 */}
      <img
        ref={imgRef}
        src={inView ? asset(item.src) : undefined}
        alt={item.title}
        width={item.width}
        height={item.height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={cn(
          "h-full w-auto max-w-none",
          "object-contain transition-[opacity,transform] duration-700 ease-out group-hover:scale-[1.04]",
          loaded ? "opacity-100" : "opacity-0",
        )}
      />
      {/* hover 提示：居中放大图标（无文字，保持画面干净） */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/25 backdrop-blur-sm">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M15 3h6v6" />
            <path d="M9 21H3v-6" />
            <path d="M21 3l-7 7" />
            <path d="M3 21l7-7" />
          </svg>
        </span>
      </div>
    </figure>
  )
}

export function Portfolio() {
  // 每次刷新（重新挂载）都默认展示「领证跟拍」，不沿用上次点击的分类
  const [activeCategory, setActiveCategory] = useState<PortfolioCategoryId>("领证跟拍")
  const [lightboxIndex, setLightboxIndex] = useState(-1)
  const [activeAlbum, setActiveAlbum] = useState<string | null>(null)
  // 横向滚动容器：切换分类时把滚动位置重置回最左（从头浏览）
  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = 0
  }, [activeCategory, activeAlbum])

  // 每次刷新（组件重新挂载）为每个分类重新生成随机排列：
  // 刷新网站 = 所有目录的排列都重新随机，实现"每次刷新打乱一次"；
  // 同一会话内切换分类不再重排，顺序稳定，浏览更顺。
  const [categoryOrderMap] = useState(() => {
    const map: Record<string, string[]> = {}
    for (const cat of portfolioCategories.map((c) => c.id)) {
      const ids = portfolioItems
        .filter((i) => i.category === cat && !i.placeholder)
        .map((i) => i.id)
        .sort(() => Math.random() - 0.5)
      if (ids.length) map[cat] = ids
    }
    return map
  })

  const selectCategory = (id: PortfolioCategoryId) => {
    setActiveCategory(id)
    // 只有婚礼跟拍使用二级相册导航，其它分类不激活相册筛选状态
    const albs =
      id === "婚礼跟拍" ? portfolioAlbums.filter((a) => a.category === id) : []
    setActiveAlbum(albs.length ? albs[0].id : null)
  }

  // 仅展示真实客片，占位图（placeholder）不进画廊，避免灰块破坏观感
  const realItems = useMemo(
    () => portfolioItems.filter((i) => !i.placeholder),
    [],
  )

  const filteredItems = useMemo(
    () => realItems.filter((item) => item.category === activeCategory),
    [activeCategory, realItems],
  )

  const displayItems = useMemo(() => {
    const order = categoryOrderMap[activeCategory]
    if (!order || order.length === 0) return filteredItems
    return filteredItems
      .slice()
      .sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
  }, [filteredItems, activeCategory, categoryOrderMap])

  // 相册模式：仅婚礼跟拍显示二级相册导航；其它分类即使有相册数据也统一走横向滑动
  const albumsForCat = useMemo(
    () =>
      activeCategory === "婚礼跟拍"
        ? portfolioAlbums.filter((a) => a.category === activeCategory)
        : [],
    [activeCategory],
  )
  const isAlbumMode = albumsForCat.length > 0

  // 当前展示列表：相册模式按相册筛选（过滤占位图），否则展示该分类全部真实客片。
  // 两种模式统一走横向滑动布局，所以这里只负责挑出要展示的图。
  const currentItems = useMemo(() => {
    if (isAlbumMode && activeAlbum) {
      return portfolioItems.filter(
        (i) => i.category === activeCategory && i.album === activeAlbum && !i.placeholder,
      )
    }
    return displayItems
  }, [isAlbumMode, activeAlbum, activeCategory, displayItems, portfolioItems])

  // 灯箱数据源：与当前展示列表一一对应
  const lightboxSlides = currentItems.map((item) => ({
    src: asset(item.src),
    alt: item.title,
    width: item.width,
    height: item.height,
  }))

  return (
    <section id="portfolio" className="py-24 px-4 scroll-mt-20">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <span className="text-sm uppercase tracking-[0.25em] text-[#c9a96e]">
            Portfolio
          </span>
          <h2 className="mt-3 text-4xl font-light tracking-wide md:text-5xl">
            作品集
          </h2>
          <div className="mx-auto mt-5 h-px w-16 bg-gradient-to-r from-transparent via-[#c9a96e] to-transparent" />
          <p className="mt-5 max-w-lg mx-auto text-neutral-400">
            真实客片记录，每一次快门都是一份用心
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-12 flex flex-wrap items-center justify-center gap-3">
          {portfolioCategories.map((cat) => {
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => selectCategory(cat.id)}
                className={cn(
                  "rounded-full border px-5 py-3 text-sm transition-all duration-300 md:text-base",
                  isActive
                    ? "border-[#c9a96e] bg-[#c9a96e] text-[#0a0a0a] shadow-[0_0_20px_rgba(201,169,110,0.35)]"
                    : "border-white/10 bg-white/[0.03] text-neutral-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white",
                )}
                aria-pressed={isActive}
              >
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* 相册二级导航（仅婚礼跟拍显示） */}
        {isAlbumMode && (
          <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
            {albumsForCat.map((alb) => {
              const isActive = activeAlbum === alb.id
              return (
                <button
                  key={alb.id}
                  onClick={() => setActiveAlbum(alb.id)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition-all duration-300",
                    isActive
                      ? "border-[#c9a96e] bg-[#c9a96e]/15 text-[#c9a96e]"
                      : "border-white/10 bg-white/[0.03] text-neutral-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white",
                  )}
                  aria-pressed={isActive}
                >
                  {alb.name}
                </button>
              )
            })}
          </div>
        )}

        {/* 作品展示区：相册模式与非相册模式统一走横向滑动（手机相册风，snap 居中，左右滑动浏览）。
            二级相册 tab 仅作筛选，不改变展示方式，保证与领证跟拍等分类完全一致的浏览体验。 */}
        {currentItems.length > 0 ? (
          <div>
            {/* snap-proximity：甩动可一次滚过多张、停稳才吸附（mandatory 会每次强制停一张，不跟手）；
                overscroll-x-contain 防止误触浏览器前进后退。
                注意：早期曾在容器上锁死“仅横向手势”，实测会把落在图片上的纵向滑动吞掉、
                导致手机端页面滚不动——故移除该限制，交给浏览器原生轴锁定（横滑看图 / 纵滑滚页）。 */}
            <div
              ref={scrollRef}
              className="flex snap-x snap-proximity gap-5 overflow-x-auto overscroll-x-contain px-1 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {currentItems.map((item, index) => (
                <GalleryImage
                  key={item.id}
                  item={item}
                  index={index}
                  onOpen={setLightboxIndex}
                  priority={index < 2}
                  className="h-[52vh] max-h-[540px] shrink-0 snap-center sm:h-[500px] landscape:h-[70vh] landscape:max-h-none"
                  style={{
                    animationDelay: `${Math.min(index, 9) * 40}ms`,
                  }}
                />
              ))}
            </div>
            <p className="mt-2 text-center text-xs text-neutral-500">
              ← 左右滑动浏览，点击放大 →
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <div className="h-px w-12 bg-[#c9a96e]/50" />
            <p className="text-neutral-400">
              该{isAlbumMode ? "相册" : "系列"}客片正在整理中
            </p>
            <p className="text-sm text-neutral-600">敬请期待更多真实作品</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={lightboxSlides}
        plugins={[Zoom]}
        controller={{ closeOnPullDown: true, closeOnBackdropClick: true }}
        carousel={{ finite: false, padding: 0 }}
        styles={{ container: { backgroundColor: "rgba(0,0,0,0.96)" } }}
      />
    </section>
  )
}
