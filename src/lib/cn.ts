// 轻量 className 合并：过滤 falsy 值后用空格连接。
// 不引入 clsx/tailwind-merge 依赖，满足本项目条件拼接需求。
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ")
}
