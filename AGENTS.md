# AGENTS.md

## 项目定位

- 布吉岛 Vibe 教程帮助没有编程经验的人先理解界面效果，再认识对应的专业术语，并学会把需求表达给 Vibe Coding 工具。
- 首期从前端交互效果入手；后续可用可视化演示解释幂等、分布式等工程概念。
- 技术栈为 VitePress + Vue + Markdown，由 pnpm 管理。保持静态文档站架构，交互演示使用独立 Vue 组件。

## 开发

- Node.js 20+、pnpm 10+。
- `pnpm docs:dev` 在 `http://localhost:5185/` 启动。
- `pnpm docs:build` 构建到 `docs/.vitepress/dist/`。
- `pnpm assets:generate` 以栏目/站点文案和栅格底图生成 PNG favicon 与 JPEG 分享图。
- 修改 VitePress 配置、SEO 逻辑或页面结构后运行 `pnpm docs:build`。

## 页面与内容

- 栏目概览页由目录下的 `index.md` 承载；每个页面必须有准确且唯一的 `title` 与 `description`。
- 页面优先按“可见效果 → 专业名称 → 适用场景 → 可复制提示词”组织。只写已实现或已核实的内容，不把计划中的演示描述成已上线功能。
- 交互演示放在 `.vitepress/theme/components/` 并由 Markdown 或主题布局按需引用。浏览器专属 API 必须兼容 VitePress SSR。
- 导航、侧栏、站点信息和 sitemap 位于 `docs/.vitepress/config.mts`；canonical、Open Graph、Twitter Card 和结构化数据由 `docs/.vitepress/seo.ts` 集中生成。
- 公开资源位于 `docs/public/`。正式域名为 `https://vibe.itkdm.com`；工作流用 `SITE_URL` 注入正式域名。
- 对外正式站名为“布吉岛 Vibe 教程”；页面标题后缀、SEO 站点名、分享图、llms.txt、导航站名与页脚版权统一使用这一名称。
- 本站采用蓝白视觉系统；首页 Hero 使用 `docs/public/images/vibe-guide.webp` 透明底虚拟向导单角色图，其源文件为 `design/vibe-guide-character.png`。分享图使用单独的场景底图 `design/vibe-guide-share-scene.png` 并通过代码叠字；不可把分享图复用为 Hero。界面演示必须放在独立内容区，不用代码界面代替主视觉。导航保留内容栏目，不显示 GitHub 社交图标，不启用搜索。
- 首页与栏目页面沿用工作区 VitePress 文档站的 Hero、导航、侧栏与栏目卡片结构。robots.txt 允许常见搜索与 AI 爬虫抓取；保持站点地图、规范网址、分享元数据与 llms.txt 域名一致。

## 资源与协作

- 不提交 `.env`、密钥、`node_modules/` 或构建输出。
- 不改动工作区中其他仓库的文件或 Git 状态。
- 未经用户明确要求，不提交、推送或部署。
