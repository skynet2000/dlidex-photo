import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"

const root = document.getElementById("root")!

// 仅在开发预览下，访问 /admin 时加载「档期管理后台」。
// 生产构建（import.meta.env.DEV 为 false）不会包含该模块，也不会注册路由。
if (import.meta.env.DEV && window.location.pathname === "/admin") {
  import("./admin/AvailabilityEditor").then(({ AvailabilityEditor }) => {
    createRoot(root).render(
      <StrictMode>
        <AvailabilityEditor />
      </StrictMode>,
    )
  })
} else {
  import("./App").then(({ default: App }) => {
    createRoot(root).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  })
}
