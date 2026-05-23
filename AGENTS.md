## 项目概述

Wuzi2do 是一款使用 **Electron** 和 **React 19** 构建的桌面待办事项应用，基于 **electron-vite** 构建工具。界面采用无边框窗口设计，支持边缘吸附功能，吸附到屏幕边缘时会收缩。

## 构建命令

```bash
npm run dev      # 开发模式（支持热模块替换）
npm run start    # 本地预览生产构建
npm run build    # 生产构建（输出到 out/）
npm run lint     # 运行 ESLint
npm run format   # 运行 Prettier
npm run build:win   # 构建 Windows 安装包
npm run build:mac   # 构建 macOS 应用
npm run build:linux # 构建 Linux 应用
npm run build:unpack # 未打包输出，用于调试
```

## 架构

- **src/main/index.js** - Electron 主进程：窗口创建、托盘、边缘吸附逻辑、IPC 处理器
- **src/preload/index.js** - 预加载脚本，暴露 `window.api`（minimize、close、onWindowSnap）
- **src/renderer/src/** - React 应用，包含组件、hooks 和资源文件

## 应用关键逻辑

主进程通过 `snapManager` 实现**边缘吸附**功能：
> **非必要不变动，变动需先确认**

### 边缘吸附

主进程通过 `snapManager` 实现窗口边缘吸附功能：

- 窗口可吸附到任意屏幕边缘，收缩成 5px 宽的窄条
- 通过鼠标轮询检测光标悬停来展开/收缩
- 窗口配置参数：`src/main/config/constants.js`

主进程和渲染进程公用语言和主题配置
- `shared/locales.js` - 定义标签和文本的多语言
### 主题切换

渲染进程相关
- 新样式和组件须根据 CSS 变量适配原有主题色
- 主题 CSS 变量与全局样式：`src/renderer/src/assets/main.css`

### 语言切换

- 新组件必须添加并适配多语言文本
- 多语言定义：`shared/locales.js`

### 渲染进程

- `App.jsx` - 根组件，处理吸附状态和窗口类名
- `src/renderer/src/assets/animations.css` 定义相关窗口吸附动画
- 标题栏区域使用 `-webkit-app-region: drag`进行控制拖拽
- `src/renderer/src/assets/animations.css` - 窗口吸附动画
- 标题栏区域使用 `-webkit-app-region: drag` 控制拖拽

默认样式
- 所有带有边框(或者outline)的元素和按钮,默认都设置圆角样式为`rounded-md`
### 默认样式

- 所有带边框（或 outline）的元素和按钮，默认圆角样式为 `rounded-md`
## 代码规范

- ESLint 扁平配置，继承 `@electron-toolkit/eslint-config` 和 `@electron-toolkit/eslint-config-prettier`
- Prettier 格式化（配置在 `.prettierrc.yaml` 中）

## 关键文件

- `electron.vite.config.mjs` - Vite 配置，包含 main、preload、renderer 的别名 `@renderer` → `src/renderer/src`
- `electron-builder.yml` - 打包配置（productName: wuzi2do, appId: com.electron.app）
- `src/main/index.js:18` - Windows 无边框窗口最小尺寸的 setShape 解决方案说明

## PR 操作指南
- 提交信息格式: 以修复为例`fix: 修复xxx问题`
- 每次提交请先运行 `npm run lint` 和 `npm run format`。
