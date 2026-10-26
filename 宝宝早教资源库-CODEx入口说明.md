# 宝宝早教资源库：CODEx 入口说明

本文件是给后续 AI 执行 Agent 的入口。先读本文件，再读 `specs.md` 和《宝宝早教资源库-维护与交接文档.md》。

## 项目用途

面向 0～3 岁家庭的早教互动资源导航。网站为静态站，中文 / English 双语；14 条资源来自已完成的审计，网站和 README 共用 `data/resources.json`。

## 支持页面与环境

- 页面：`index.html`（本地服务器或 GitHub Pages）
- 运行环境：现代浏览器；本地预览需要 Python 3 或 Node 18+
- 无后端、无账号、无数据库、无自动抓取
- 线上地址：https://ll96victor.github.io/baby-early-learning-hub/
- 仓库：https://github.com/ll96victor/baby-early-learning-hub

## 主要功能

1. 14 条资源卡片，按精选 / 待验证 / 观察分层展示，Lucas 固定首页第一位。
2. 左侧分类与筛选（桌面）、顶部横向分类与筛选抽屉（手机）。
3. 搜索、平台筛选、内容语言筛选、验证状态筛选。
4. 精选优先 / 中文优先 / 名称排序；列表 / 宫格切换。
5. 简中 / English 界面切换，资源内容语言独立标注。
6. 详情弹窗：入口类型、验证记录、异常或边界、标称年龄、家长建议、价格说明、官方来源。
7. 收录说明与关于本站弹窗，移动端可从抽屉进入。

## 用户工作流

1. 打开首页，默认看到 Lucas 第一、中文候选紧随其后。
2. 用分类或搜索缩小范围。
3. 看卡片上的分层、验证状态和内容语言。
4. 打开详情确认“怎么打开、有没有声音、适合谁陪”。
5. 点官方入口，在新标签页打开第三方页面。

## 边界与禁止事项

- 不新增资源、账号、收藏、评论、统计、后台、数据库、自动抓取、第三方游戏托管或 iframe 内嵌。
- 不按 0～1 / 1～2 / 2～3 岁细分，不替家长判断某个孩子是否适合。
- 不把显示简体中文写成普通话已正常播放；不把自动化能启动写成孩子喜欢。
- 不给源码 / 商店 / 官方页面填 `playUrl`，不把源码页显示成“开始体验”。
- 不搬运第三方游戏截图或官方封面；站内插画只能是原创占位图。
- 不引入外部脚本、跟踪服务、广告或 CDN。
- 不使用“小芽”或“儿童游戏”作为主品牌。
- 不修改 `宝宝早教资源库-正式实施交接包/`（规划材料，已 gitignore）。

## 高风险区域

| 区域 | 风险 | 必须做 |
|---|---|---|
| `data/resources.json` | 数据真实性、双语缺失、入口误标 | 改完跑 `node tools/validate.mjs` |
| `assets/core.mjs` 排序 | Lucas 首位、中文优先规则 | 改完跑 `node --test` |
| `assets/styles.css` 响应式 | 手机横向溢出、弹窗超出视口 | 改完跑 `python tools/e2e_check.py` |
| README 资源表 | 手工改表导致与数据源漂移 | 只用 `node tools/sync-readme.mjs` 生成 |
| GitHub Pages 路径 | 绝对路径导致子路径 404 | 保持 `./assets/...`、`./data/...` |
| 第三方链接 | 失效、地区限制、声音异常 | 如实更新 `verification`，不要猜 |

## 必读文件

1. `specs.md`：稳定需求与数据契约。
2. `data/resources.json`：唯一资源事实源。
3. `tools/validate.mjs`：数据校验规则。
4. `宝宝早教资源库-维护与交接文档.md`：修改流程、部署、回滚、已知问题。
5. `README.md`：使用者说明（资源表由脚本生成）。

## 常用命令

```bash
node tools/validate.mjs
node --test
node tools/sync-readme.mjs
node tools/sync-readme.mjs --check
python -m http.server 8000
python tools/e2e_check.py --base-url http://127.0.0.1:8000
```

## 修改后的文档义务

- 改资源或分类：同步 README 资源表、更新 `specs.md` 中受影响的稳定事实（如有）。
- 改页面功能或用户流程：更新 README 使用说明、维护文档变更记录、本入口说明。
- 改部署方式：更新维护文档第 6 节和 README 的线上地址。
- 每轮实施在 `answers/` 生成回答文件。
