// 统一资源路径前缀：自动跟随 Vite 的 base 配置（/ 或 /photo/）。
// 数据文件里只存相对路径（如 "photos/xxx.webp"），这里拼上 BASE_URL，
// 这样无论部署到根目录还是子目录，图片/JSON 都不会 404。
export function asset(path: string): string {
  const base = (import.meta.env.BASE_URL || "/").replace(/\/+$/, "")
  const clean = path.replace(/^\/+/, "")
  return `${base}/${clean}`
}
