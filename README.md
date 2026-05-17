# Wuzi2do

> **English version**: [README-EN.md](./README-EN.md)

一款使用 **Electron** 和 **React** 构建的桌面工具应用，基于 **electron-vite** 构建工具。界面采用无边框窗口设计，当窗口吸附到屏幕边缘时，有流畅的渐入渐出动画。

欢迎任何改进建议。这个项目的唯一目的是成为一个桌面工具助手——专注于把这一件事做好。

| 项目   | 详情                                |
|--------|-------------------------------------|
| 运行时 | Electron（主进程：窗口、托盘、边缘吸附） |
| 前端   | React 19, Tailwind CSS 4, Vite      |

## 功能特性

- **待办事项**：添加、切换完成状态、删除事项；可滚动列表，具备基础无障碍支持（如 `aria-label`）。
- **窗口行为**：吸附到任意屏幕边缘时，窗口缩小成窄条；再次交互时恢复。渲染进程监听 `window-snap` 事件并执行相应的 CSS 过渡动画。
- **桌面集成**：系统托盘、可拖拽的标题栏区域；在 Windows 上，对于极小窗口的点击测试在必要时使用 `setShape` 以确保正确行为。
- **持久化存储**：待办事项以 JSON 格式存储在 `electron-store`下。

## 环境要求

- **Node.js**：推荐使用当前 LTS 版本（如 `package.json` 中有 `engines` 字段，请保持一致）。
- **操作系统**：开发和打包脚本支持 Windows、macOS 和 Linux（各平台的构建产物见下方构建命令）。

## 开发与构建

```bash
# 安装依赖
npm install

# 开发模式（支持热模块替换）
npm run dev

# 本地预览生产构建
npm run start

# 生产构建（产物默认输出到 out/ 目录）
npm run build
```

### 打包安装包

执行 `npm run build` 后，使用 **electron-builder** 生成各平台安装包或未打包目录：

| 命令                   | 用途                                                |
|------------------------|-----------------------------------------------------|
| `npm run build:unpack` | 未打包输出，用于调试                                 |
| `npm run build:win`    | Windows                                             |
| `npm run build:mac`    | macOS                                               |
| `npm run build:linux`  | Linux（如 AppImage、deb——详见 `electron-builder.yml`） |

安装包名称、应用 ID 及相关元数据定义在仓库根目录的 **`electron-builder.yml`** 中（`productName` 等字段可能与仓库显示名称不同，发布前请调整）。

### 代码质量

```bash
npm run lint
npm run format
```

## 项目结构

- `src/main/` — Electron 主进程（窗口、托盘、IPC、吸附逻辑）。
- `src/renderer/` — React 应用（组件、`hooks/useTodos` 等）。
- `src/preload/` — 预加载脚本，向渲染进程暴露受控的 `window.api`（如窗口吸附通知）。

## 预览

![Wuzi2do 演示](/resources/wuzi2do.gif)

---

本项目基于 [electron-vite](https://electron-vite.org) 模板创建。如需自动更新功能，请配置 `electron-builder.yml` 中的 `publish` 部分，并使用 **electron-updater** 配合更新 URL 和代码签名进行集成。
