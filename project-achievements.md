# 项目成果记录

本文件只记录有实际交付价值、且有证据支撑的成果，不是开发日志。

## 2026-10-26 首版双语早教资源导航站上线

### Problem

规划阶段的 14 条资源全部内嵌在一份 46KB 的 HTML 原型里，分类和状态也硬编码在源码中。没有公开网址，资源清单无法与 README 共用；原型的单一 `status` 字段把“家长实测”“声音待复核”“未测试”“兴趣一般”混在一起，容易把“页面能打开”误解成“孩子喜欢”或“声音正常”。

### Solution

- 把 14 条审计结果迁到唯一数据源 `data/resources.json`，拆开验证状态与家庭偏好，补入口类型、价格核查、年龄证据、异常记录和来源。
- 保留 B 型布局与原型交互，重建为纯静态双语站点；入口按钮按“开始体验 / 查看商店 / 查看项目 / 查看官方页面”区分。
- 网站、README 资源清单、Node 测试和 Playwright 验收共用同一份数据和纯逻辑模块，避免手工维护两份名单。
- 部署到 GitHub Pages，并提供数据校验、README 同步检查和桌面 / 手机真实浏览器验收脚本。

### Technologies

- HTML / CSS / 原生 JavaScript（ES modules）
- JSON 数据契约
- Node.js 内置测试运行器
- Python Playwright（Chromium）
- GitHub Pages

### Key Challenges

- 在不重做 B 型布局的前提下，把硬编码数据拆成外部 JSON，并保持全部筛选、排序、双语和详情交互。
- 把“证据等级”和“家庭偏好”拆成两个独立维度，同时让中文优先不把有音频异常或原厂标称 3 岁以上的资源自动推上前台。
- 保证网站与 README 不漂移：README 资源表由数据源生成，`--check` 在测试中拦截手工改动。
- 项目部署在 GitHub Pages 子路径，所有资源必须使用相对路径。

### Result

- 14 条资源以中英双语正式上线，Lucas 固定第一位并跳转官方商店；源码项目明确显示“查看项目”，不伪装成直接游玩。
- 网站与 GitHub README 使用同一份资源数据；数据校验、27 项 Node 测试和 54 项桌面 / 手机浏览器检查全部通过。
- 详情页如实呈现验证记录、异常、标称年龄、家长建议和价格核查程度；第三方声音等待仍未复测的内容没有被写成已通过。
- 用户真实使用反馈尚未收集，记录为待验证，不声称已经通过用户验收。

### Evidence

- 需求与数据契约：`specs.md`
- 变更与部署记录：`宝宝早教资源库-维护与交接文档.md`
- 数据校验：`node tools/validate.mjs`
- 自动化测试：`node --test`（27/27）
- 浏览器验收：`python tools/e2e_check.py --base-url ...`（54/54，明细见本地 `.tmpfiles/evidence/e2e-report.json`）
- 线上地址：https://ll96victor.github.io/baby-early-learning-hub/
- 首版提交号：以 `git log --oneline -1` 的输出为准
