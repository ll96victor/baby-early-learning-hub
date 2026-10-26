# 宝宝早教资源库

面向 0～3 岁家庭的早教互动资源导航。收录 14 条真实入口，用中文和 English 说明玩法、语言、平台、价格核查程度、验证状态与家庭反馈，帮助家长先判断“怎么打开、有没有声音、有没有中文”，再决定要不要试。

- 在线网站：https://ll96victor.github.io/baby-early-learning-hub/
- GitHub 仓库：https://github.com/ll96victor/baby-early-learning-hub

## 功能特性

- 14 条资源，按“精选 / 待验证 / 观察”三个展示分层排序；Lucas Baby Games 固定第一位，并标明这是本家庭的正面体验。
- 桌面端保留 B 型布局：左侧分类与筛选，右侧横向资源列表；手机端分类置顶，筛选收进抽屉。
- 支持搜索、按兴趣分类、按平台、内容语言和验证状态筛选，支持精选优先、中文优先、名称排序，以及列表 / 宫格切换。
- 中文 / English 界面切换；界面语言与资源实际语言分开标注。
- 入口按真实类型区分：开始体验、查看商店、查看项目、查看官方页面。源码仓库不会显示成“直接玩”。
- 详情弹窗列出如何打开、验证记录、异常或边界、开发者标称年龄、家长建议、价格说明和官方来源。
- 纯静态站点，无账号、数据库、后台、评论、跟踪脚本、自动抓取，也不托管或内嵌第三方游戏。

## 快速开始

### 前置条件

- 一个现代浏览器（Chrome、Edge、Firefox、Safari 等）。
- 本地预览需要 Python 3 或 Node 18+，任选其一。

### 安装

直接访问线上网站，或把仓库克隆到本地：

```bash
git clone https://github.com/ll96victor/baby-early-learning-hub.git
cd baby-early-learning-hub
python -m http.server 8000
```

然后在浏览器打开：

```text
http://localhost:8000/
```

### 第一次运行

1. 打开首页，等待资源列表加载。
2. 确认第一条是 Lucas Baby Games，按钮显示“查看商店”。
3. 成功标志：页面显示 14 条资源，侧边栏有 9 个分类，搜索“随便敲键盘”能看到 3 条键盘类资源。

## 使用说明

### 搜索与筛选

- 你做什么：在顶部搜索框输入中文或英文名称、玩法或分类。
- 它做什么：按名称、说明、分类、学习重点和入口类型匹配，并叠加分类、平台、内容语言、验证状态筛选。
- 你看到什么：结果数量更新；有筛选时出现当前条件标签和“清除筛选”按钮。

### 列表与宫格

- 你做什么：点击结果区右上角的列表或宫格按钮。
- 它做什么：切换同一批资源的排列方式。
- 你看到什么：列表适合逐条读说明，宫格适合快速浏览插画和名称。

### 中文 / English 切换

- 你做什么：点击右上角“简中 / EN”。
- 它做什么：切换界面文案和资源的中英文说明。
- 你看到什么：界面语言变化，但每条资源的内容语言标签保持不变，避免把英文游戏误当成英语启蒙。

### 查看详情

- 你做什么：点击卡片中的“查看详情”。
- 它做什么：打开详情弹窗，说明入口类型、验证记录、异常或边界、标称年龄、家长建议和价格核查程度。
- 你看到什么：详情中的状态与卡片一致；“开始体验”只用于有直接网页入口的资源。

### 手机端

- 你做什么：点击搜索框旁的“筛选”。
- 它做什么：从左侧打开筛选抽屉。
- 你看到什么：选择分类或筛选后自动关闭抽屉；也可以点遮罩或按 Esc 关闭。

## 工作原理

1. 你打开网站，浏览器读取同一目录下的 `data/resources.json`。
2. 页面按分类、平台、内容语言、验证状态和搜索词筛选，再按精选、中文优先或名称排序。
3. 你点击入口按钮时，浏览器在新标签页打开第三方官方页面；本站不代理、不嵌入、不自动播放。
4. 你看到的是资源卡、详情弹窗和线上 README 中同一份数据生成的名单。

### 技术细节

- `data/resources.json` 是唯一资源事实源，包含 14 条资源、分类、入口类型、验证等级、家庭偏好、价格状态和来源。
- `assets/core.mjs` 是不依赖 DOM 的纯逻辑，浏览器、Node 测试和 README 生成脚本共用。
- `tools/validate.mjs` 校验数据契约；`tools/sync-readme.mjs` 生成 README 的资源清单并检查同步。
- 站点部署在 GitHub Pages，默认分支 `main`，发布目录为仓库根目录。

## 已知限制

- 第三方网页的声音、广告、地区限制和浏览器兼容性不受本站控制；标注“待验证”或“有异常记录”的条目必须按详情说明判断。
- “开发者标称年龄”不等于适龄保证；本站总范围写 0～3 岁，但不细分 0～1、1～2、2～3 岁，也不替家长判断某个孩子是否适合。
- 微软商店条目需要安装客户端，GitHub 源码项目通常需要本地运行；这些入口不是网页版游戏。
- 当前没有账号、收藏、评论、统计或后台，也没有自动抓取和资源健康检查。
- 站内插画是原创通用分类示意图，不是游戏官方截图；不提供、不搬运第三方封面素材。

## 项目结构

```text
baby-early-learning-hub/
├── index.html                 # 页面骨架
├── assets/
│   ├── styles.css             # 设计 token 与响应式样式
│   ├── app.js                 # 读取数据、渲染、筛选与弹窗
│   └── core.mjs               # 浏览器与 Node 共用的纯逻辑
├── data/
│   └── resources.json         # 14 条资源与分类的唯一事实源
├── tools/
│   ├── validate.mjs           # 数据契约校验
│   ├── sync-readme.mjs        # 生成 / 检查 README 资源清单
│   └── e2e_check.py           # Playwright 桌面与手机验收
├── tests/                     # Node 自动化测试
├── answers/                   # 每轮实施记录
├── README.md                  # 本文件
├── specs.md                   # 稳定需求与数据契约
├── project-achievements.md    # 项目成果记录
├── 宝宝早教资源库-CODEx入口说明.md
└── 宝宝早教资源库-维护与交接文档.md
```

## 配置与自定义

| 要改什么 | 改哪里 | 说明 |
|---|---|---|
| 增删资源、修改说明或状态 | `data/resources.json` 的 `resources` | 修改后必须运行数据校验、测试和 README 同步 |
| 分类名称、图标或说明 | `data/resources.json` 的 `categories` | `liked` 是派生分类，不能写进资源的 `categories` |
| 验证状态、入口类型、价格措辞 | `data/resources.json` 的 `taxonomy` | 页面、详情和 README 共用同一套文案 |
| 站点地址或仓库地址 | `data/resources.json` 的 `meta.repoUrl` / `meta.pagesUrl` | 同时更新 README 顶部的两个链接 |
| 配色、圆角、阴影、字号 | `assets/styles.css` 的 `:root` token | 组件只引用 token，不直接写具体色值 |

修改后的固定检查顺序：

```bash
node tools/validate.mjs
node --test
node tools/sync-readme.mjs --check
```

## 常见问题与排障

### 本地双击 `index.html` 看不到资源

- 原因：浏览器禁止 `file://` 页面直接读取本地 JSON。
- 解决：在项目目录运行 `python -m http.server 8000`，再打开 `http://localhost:8000/`。

### 线上更新后仍是旧内容

- 原因：GitHub Pages 构建有延迟，浏览器也可能缓存静态文件。
- 解决：等待一两分钟后强制刷新；仍未更新时查看仓库 Actions / Pages 的构建状态。

### 第三方页面没有声音或打不开

- 原因：第三方站点的自动播放限制、地区限制、广告拦截或浏览器兼容性。
- 解决：先换 Chrome 再试；仍不可用时以详情里的“验证记录”为准，不要据此认为本站故障。

## 资源清单

<!-- RESOURCE_TABLE_START -->
共 **14** 条，数据核查日期 **2026-10-26**。

| 资源 | 分层 | 入口 | 内容语言 | 平台 | 验证状态 | 家庭偏好 |
|---|---|---|---|---|---|---|
| [Lucas Baby Games · 宝宝互动合集](https://apps.microsoft.com/detail/9p1hfcfzmqz0) | 精选 | 查看商店 | 英文 | Windows 应用 | 家长实测 | 家庭喜欢 |
| [Digital Dialects 中文动物卡片](https://www.digitaldialects.com/Chinese/Animals.htm) | 待验证 | 开始体验 | 中文 | 网页 | 有异常记录 | 未特别反馈 |
| [Foxy · 中文启蒙小天地](https://wonghongwei.com/foxys-learning-patch/) | 待验证 | 开始体验 | 中英 | 网页 | 有异常记录 | 未特别反馈 |
| [Pinkalicious 舞蹈互动](https://pbskids.org/games/play/pinkalicious-dance-game/78525) | 待验证 | 开始体验 | 英文 | 网页 | 自动化测试 | 未特别反馈 |
| [Pinkamusical 音乐花园](https://pbskids.org/games/play/pinkamusical-garden/128160) | 待验证 | 开始体验 | 英文 | 网页 | 自动化测试 | 未特别反馈 |
| [Alma 恐龙舞蹈](https://pbskids.org/games/play/alma-dino-dance/1679815) | 待验证 | 开始体验 | 英文 | 网页 | 待验证 | 未特别反馈 |
| [Colors & Shapes 颜色形状](https://apps.microsoft.com/detail/9nl6tnmj5sjs) | 待验证 | 查看商店 | 英文 | Windows 应用 | 待验证 | 未特别反馈 |
| [KeySplash / TinyFingers · 随便敲键盘](https://github.com/smartexpert/tinyfingers) | 待验证 | 查看项目 | 无语言要求 | 网页 / Windows 应用 | 待验证 | 未特别反馈 |
| [Kids Keyboard Smash · 随便敲键盘](https://github.com/mazelb/kids-keyboard-smash) | 待验证 | 查看项目 | 无语言要求 | Windows 应用 | 待验证 | 未特别反馈 |
| [Chrome Music Lab 节奏](https://musiclab.chromeexperiments.com/Rhythm/) | 待验证 | 开始体验 | 无语言要求 | 网页 | 有异常记录 | 未特别反馈 |
| [Daniel Tiger 跳舞派对](https://pbskids.org/games/play/dance-party/86157) | 待验证 | 开始体验 | 英文 | 网页 | 有异常记录 | 未特别反馈 |
| [Momo 中文童谣](https://www.momochinese.com/) | 观察 | 开始体验 | 中文 | 网页 | 有异常记录 | 未特别反馈 |
| [Tiny Dino 恐龙儿歌](https://kids-storybook.com/games/tiny-dino) | 观察 | 开始体验 | 英文 | 网页 | 自动化测试 | 未特别反馈 |
| [BabySmash · 随便敲键盘](https://www.babysmash.com/) | 观察 | 查看官方页面 | 无语言要求 | Windows 应用 | 家长实测 | 兴趣一般 |
<!-- RESOURCE_TABLE_END -->

## 收录标准与验证状态

- **三个分层**：精选（有本家庭明确的正面体验）、待验证（入口存在但关键体验未验证）、观察（有年龄、音频或兴趣方面的边界，不进入主推）。
- **验证状态与家庭偏好分开**：验证状态记录“家长实测 / 自动化测试 / 开发者声明 / 待验证 / 有异常记录”；家庭偏好记录“家庭喜欢 / 兴趣一般 / 未特别反馈”。自动化能启动不等于孩子喜欢。
- **入口类型**：开始体验（直接网页）、查看商店（需要安装）、查看项目（源码，通常需本地运行）、查看官方页面（可能含下载或试玩，需自行确认）。
- **语言两轴**：“中文启蒙 / 英文启蒙”表示存在词汇、发音或歌词等学习内容；“内容语言”只表示页面实际使用什么语言。英文游戏不会自动进入英文启蒙。
- **不收录**：需要账号或儿童个人信息的资源、无法确认来源的下载、需要绕过地区限制的内容、没有授权素材的封面抓取。
- **插画**：站内为原创通用分类示意图，不是官方封面，也不代表实际游戏画面。

## 版权与致谢

第三方资源的名称、内容与商标归各自权利人所有。本站只提供说明和官方入口链接，不托管、不复制、不内嵌第三方游戏。站内插画为本项目原创占位图，未使用第三方游戏截图或授权素材。

## 开发与验证

```bash
node tools/validate.mjs          # 数据契约
node --test                      # 排序、筛选、数据与 README 同步
python tools/e2e_check.py --base-url http://127.0.0.1:8000
```

真实浏览器验收覆盖桌面与手机视口、14 条资源、Lucas 首位、入口按钮语义、分类、搜索、筛选、双语、列表 / 宫格、详情弹窗、横向溢出和控制台错误。

详细变更记录、发布方式与回滚说明见《宝宝早教资源库-维护与交接文档.md》。
