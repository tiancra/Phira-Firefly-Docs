# Phira-Firefly-Docs

Phira-Firefly 文档站点，基于 [VitePress](https://vitepress.dev/) 构建。

- 项目仓库：https://github.com/tiancra/Phira-Firefly
- 上游文档：https://github.com/TeamFlos/phira-docs

## 本地开发

```bash
npm install
npm run dev      # 本地开发
npm run build    # 构建到 .vitepress/dist
npm run preview  # 预览构建产物
```

## 目录结构

- `docs/` — 文档内容（Markdown）
  - `docs/index.md` — 首页（封面图 `docs/public/firefly.png`）
  - `docs/firefly/` — Phira-Firefly 新增功能
  - 其余目录 — 原版 Phira 文档内容（分支改动已融入对应章节）
  - `docs/public/` — 静态资源（封面图、网页图标等）
- `.vitepress/config.mts` — 站点配置（导航、侧边栏、图标等）

## 贡献

欢迎通过 Issue 或 Pull Request 提交修正与补充。
