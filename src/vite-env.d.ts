/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Microsoft Clarity 项目 ID（照片站独立项目）。未配置时埋点自动跳过。 */
  readonly VITE_CLARITY_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
