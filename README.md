# Vibe 教程

把界面效果和开发术语讲清楚：先看见交互，再学会描述，最后把清晰的需求交给 Vibe Coding 工具。

## 本地开发

```sh
pnpm install
pnpm docs:dev
```

本地地址：`http://localhost:5185/`

## 构建与预览

```sh
pnpm docs:build
pnpm docs:preview
```

## 站点资源

- VitePress 页面和配置位于 `docs/`。
- 首页交互演示位于 `docs/.vitepress/theme/components/`。
- `pnpm assets:generate` 从无字栅格底图重新生成 Open Graph 分享图和 PNG favicon。
- 正式域名为 `https://vibe.itkdm.com`。
