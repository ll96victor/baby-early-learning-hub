#!/usr/bin/env python
"""Real-browser acceptance for the static site.

Usage:
    python tools/e2e_check.py --base-url http://127.0.0.1:8765

Requires Playwright for Python and its Chromium build. The script writes a JSON
report and screenshots to .tmpfiles/evidence by default.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
DATA = json.loads((ROOT / "data" / "resources.json").read_text(encoding="utf-8"))

results: list[dict] = []


def check(name: str, condition: bool, detail: str = "") -> None:
    results.append({"name": name, "pass": bool(condition), "detail": detail})
    print(f"{'PASS' if condition else 'FAIL'}  {name}" + (f"  [{detail}]" if detail and not condition else ""))


def text(page, selector: str) -> str:
    return page.locator(selector).inner_text().strip()


def expected_entry_label(entry_type: str) -> str:
    return DATA["taxonomy"]["entryTypes"][entry_type]["label"]["zh"]


def expected_href(resource: dict) -> str:
    if resource["entryType"] == "play_web" and resource.get("playUrl"):
        return resource["playUrl"]
    return resource["officialUrl"]


def no_overflow(page) -> bool:
    return page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1")


def wait_cards(page, count: int) -> None:
    page.wait_for_function(
        "n => document.querySelectorAll('.resource-card').length === n",
        arg=count,
        timeout=7000,
    )


def run_desktop(browser, base_url: str, evidence: Path) -> list[str]:
    context = browser.new_context(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
    page = context.new_page()
    console_errors: list[str] = []
    page_errors: list[str] = []
    external_requests: list[str] = []
    page.on("console", lambda message: console_errors.append(message.text) if message.type == "error" else None)
    page.on("pageerror", lambda error: page_errors.append(str(error)))
    page.on(
        "request",
        lambda request: external_requests.append(request.url)
        if not request.url.startswith(base_url) and not request.url.startswith("data:")
        else None,
    )

    page.goto(base_url, wait_until="load")
    wait_cards(page, 14)

    check("桌面：加载 14 条资源", page.locator(".resource-card").count() == 14)
    check("桌面：页面标题包含站点名", "宝宝早教资源库" in page.title(), page.title())
    check("桌面：无横向溢出", no_overflow(page))
    check("桌面：无脚本运行错误", not page_errors, "; ".join(page_errors))
    check("桌面：无控制台错误", not console_errors, "; ".join(console_errors))
    check("桌面：不请求外部域名", not external_requests, "; ".join(external_requests[:3]))

    sidebar_box = page.locator("#sidebar").bounding_box()
    content_box = page.locator("main.content").bounding_box()
    check(
        "桌面：B 型布局左分类右列表",
        bool(sidebar_box and content_box and sidebar_box["x"] < content_box["x"]),
    )

    cards = page.eval_on_selector_all(
        ".resource-card",
        """els => els.map(el => ({
            id: el.dataset.id,
            name: el.querySelector('.card-title').innerText.trim(),
            label: el.querySelector('.primary').innerText.replace('↗','').trim(),
            href: el.querySelector('.primary').href,
            tier: el.querySelector('.tier-badge').innerText.trim(),
            family: el.querySelector('.family-badge')?.innerText.trim() || '',
            status: el.querySelector('.status').innerText.trim()
        }))""",
    )
    by_id = {card["id"]: card for card in cards}
    data_by_id = {resource["id"]: resource for resource in DATA["resources"]}

    check("桌面：资源 id 与数据源完全一致", set(by_id) == set(data_by_id), str(set(by_id) ^ set(data_by_id)))
    check("桌面：第一条是 Lucas", cards[0]["id"] == "lucas", cards[0]["id"])
    check("桌面：Lucas 显示家庭喜欢", "家庭喜欢" in by_id["lucas"]["family"], by_id["lucas"]["family"])
    check("桌面：Lucas 按钮为查看商店", by_id["lucas"]["label"] == "查看商店", by_id["lucas"]["label"])
    check("桌面：Lucas 跳转官方商店", by_id["lucas"]["href"].startswith("https://apps.microsoft.com/"), by_id["lucas"]["href"])

    label_ok = True
    href_ok = True
    for resource in DATA["resources"]:
        card = by_id.get(resource["id"])
        if not card:
            continue
        if card["label"] != expected_entry_label(resource["entryType"]):
            label_ok = False
            print(f"  label mismatch {resource['id']}: {card['label']} != {expected_entry_label(resource['entryType'])}")
        if card["href"] != expected_href(resource):
            href_ok = False
            print(f"  href mismatch {resource['id']}: {card['href']} != {expected_href(resource)}")
    check("桌面：14 条入口按钮语义与数据一致", label_ok)
    check("桌面：14 条入口链接与数据一致", href_ok)

    source_cards = [resource for resource in DATA["resources"] if resource["entryType"] == "source"]
    check(
        "桌面：源码项目不显示开始体验",
        all(by_id[resource["id"]]["label"] == "查看项目" for resource in source_cards),
    )
    check("桌面：BabySmash 在观察层", by_id["smash"]["tier"] == "观察", by_id["smash"]["tier"])

    page.screenshot(path=str(evidence / "desktop-zh.png"), full_page=True)

    page.locator('.cat-btn[data-cat="keyboard"]').click()
    wait_cards(page, 3)
    keyboard_ids = {
        page.locator(".resource-card").nth(index).get_attribute("data-id")
        for index in range(page.locator(".resource-card").count())
    }
    check("桌面：随便敲键盘 3 条", keyboard_ids == {"smash", "keyboardsmash", "keysplash"}, str(keyboard_ids))
    check("桌面：分类提示可见", page.locator("#categoryHint").is_visible())
    page.locator("#resetTop").click()
    wait_cards(page, 14)

    page.locator("#search").fill("BabySmash")
    wait_cards(page, 1)
    check("桌面：搜索 BabySmash 命中 1 条", page.locator(".resource-card").first.get_attribute("data-id") == "smash")
    page.locator("#clearSearch").click()
    wait_cards(page, 14)

    page.select_option("#language", "zh")
    wait_cards(page, 3)
    check("桌面：内容语言中文筛选 3 条", page.locator(".resource-card").count() == 3)
    page.locator("#resetTop").click()
    wait_cards(page, 14)

    page.select_option("#verification", "issue_reported")
    wait_cards(page, 5)
    check("桌面：有异常记录筛选 5 条", page.locator(".resource-card").count() == 5)
    page.locator("#resetTop").click()
    wait_cards(page, 14)

    page.select_option("#sort", "chinese")
    wait_cards(page, 14)
    check("桌面：中文优先仍保持 Lucas 第一位", page.locator(".resource-card").first.get_attribute("data-id") == "lucas")
    page.select_option("#sort", "featured")

    page.locator("#gridView").click()
    check("桌面：宫格视图生效", "grid" in (page.locator("#cards").get_attribute("class") or ""))
    page.screenshot(path=str(evidence / "desktop-grid.png"), full_page=True)
    page.locator("#listView").click()

    page.locator('[data-detail="foxy"]').click()
    page.wait_for_selector("#detailDialog[open]")
    detail = text(page, "#modalBody")
    check("详情：Foxy 显示验证记录", "验证记录" in detail)
    check("详情：Foxy 显示普通话发音未实测", "普通话发音未实测" in detail)
    check("详情：Foxy 显示有异常记录", "有异常记录" in detail)
    check("详情：Foxy 按钮为开始体验", "开始体验" in detail)
    dialog_box = page.locator("#detailDialog").bounding_box()
    check(
        "详情：弹窗在视口内",
        bool(dialog_box and dialog_box["x"] >= 0 and dialog_box["y"] >= 0
             and dialog_box["x"] + dialog_box["width"] <= 1440 + 1
             and dialog_box["y"] + dialog_box["height"] <= 900 + 1),
    )
    page.screenshot(path=str(evidence / "detail-foxy.png"))
    page.keyboard.press("Escape")
    check("详情：Esc 可关闭", not page.locator("#detailDialog").is_visible())

    page.locator('[data-detail="keysplash"]').click()
    page.wait_for_selector("#detailDialog[open]")
    detail = text(page, "#modalBody")
    check("详情：源码项目按钮为查看项目", "查看项目" in detail)
    check("详情：源码项目不声称直接在线玩", "不保证直接在线游玩" in detail)
    page.keyboard.press("Escape")

    page.locator('[data-modal="curation"]').first.click()
    page.wait_for_selector("#detailDialog[open]")
    curation = text(page, "#modalBody")
    check("收录说明：解释三个分层", all(word in curation for word in ["精选", "待验证", "观察"]))
    check("收录说明：解释验证状态", "验证状态" in curation and "家长实测" in curation)
    page.keyboard.press("Escape")

    page.locator("#enSwitch").click()
    wait_cards(page, 14)
    check("英文：界面标题切换", "Gentle discoveries" in text(page, "h1"), text(page, "h1"))
    check("英文：Lucas 按钮为 View store", "View store" in text(page, '[data-id="lucas"] .primary'))
    check("英文：内容语言标签保持独立", "English" in text(page, '[data-id="daniel"] .pills'))
    page.screenshot(path=str(evidence / "desktop-en.png"), full_page=True)
    page.locator("#zhSwitch").click()
    wait_cards(page, 14)

    page.locator("#search").fill("zzzz-no-match")
    page.wait_for_selector(".state-box")
    check("空状态：显示无结果", "没有符合条件的资源" in text(page, ".state-box"))
    page.locator("[data-reset-filters]").last.click()
    wait_cards(page, 14)

    check("桌面：全程无脚本或控制台错误", not console_errors and not page_errors,
          "; ".join((console_errors + page_errors)[:3]))

    context.close()
    return console_errors + page_errors


def run_mobile(browser, base_url: str, evidence: Path) -> list[str]:
    context = browser.new_context(
        viewport={"width": 390, "height": 844},
        device_scale_factor=2,
        is_mobile=True,
        has_touch=True,
    )
    page = context.new_page()
    console_errors: list[str] = []
    page_errors: list[str] = []
    page.on("console", lambda message: console_errors.append(message.text) if message.type == "error" else None)
    page.on("pageerror", lambda error: page_errors.append(str(error)))

    page.goto(base_url, wait_until="load")
    wait_cards(page, 14)

    check("手机：加载 14 条资源", page.locator(".resource-card").count() == 14)
    check("手机：无横向溢出", no_overflow(page))
    check("手机：无脚本错误", not page_errors, "; ".join(page_errors))
    check("手机：无控制台错误", not console_errors, "; ".join(console_errors))
    check("手机：顶部分类可见", page.locator("#mobileCategories").is_visible())
    check("手机：Lucas 仍在第一位", page.locator(".resource-card").first.get_attribute("data-id") == "lucas")
    check("手机：筛选按钮可见", page.locator("#openDrawer").is_visible())

    page.screenshot(path=str(evidence / "mobile-zh.png"), full_page=False)

    page.locator('.mobile-cat[data-cat="keyboard"]').click()
    wait_cards(page, 3)
    check("手机：顶部分类可筛选", page.locator(".resource-card").count() == 3)

    page.evaluate("window.scrollTo(0, 0)")
    page.locator("#openDrawer").click()
    page.wait_for_selector("#sidebar.open")
    check("手机：筛选抽屉可打开", page.locator("#sidebar.open").is_visible())
    page.keyboard.press("Escape")
    page.wait_for_function("!document.querySelector('#sidebar').classList.contains('open')")
    check("手机：Esc 可关闭抽屉", not page.locator("#sidebar.open").is_visible())

    page.locator("#openDrawer").click()
    page.wait_for_selector("#sidebar.open")
    page.locator('.side-links [data-modal="about"]').click()
    page.wait_for_selector("#detailDialog[open]")
    check("手机：抽屉内可打开关于本站", "关于本站" in text(page, "#modalBody"))
    page.keyboard.press("Escape")
    page.wait_for_function("!document.querySelector('#sidebar').classList.contains('open')")

    page.locator('.mobile-cat[data-cat="all"]').click()
    wait_cards(page, 14)
    page.locator('[data-detail="foxy"]').click()
    page.wait_for_selector("#detailDialog[open]")
    dialog_box = page.locator("#detailDialog").bounding_box()
    check(
        "手机：详情弹窗在视口内",
        bool(dialog_box and dialog_box["x"] >= 0 and dialog_box["y"] >= 0
             and dialog_box["x"] + dialog_box["width"] <= 390 + 1
             and dialog_box["y"] + dialog_box["height"] <= 844 + 1),
    )
    check("手机：详情内容可读", "验证记录" in text(page, "#modalBody"))
    page.screenshot(path=str(evidence / "mobile-detail.png"))
    page.keyboard.press("Escape")

    page.locator('.mobile-cat[data-cat="all"]').click()
    wait_cards(page, 14)
    page.locator("#enSwitch").click()
    wait_cards(page, 14)
    check("手机：英文界面切换", "Gentle discoveries" in text(page, "h1"))
    check("手机：英文界面无横向溢出", no_overflow(page))
    check("手机：全程无脚本或控制台错误", not console_errors and not page_errors,
          "; ".join((console_errors + page_errors)[:3]))

    context.close()
    return console_errors + page_errors


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-url", default="http://127.0.0.1:8765")
    parser.add_argument("--evidence-dir", default=str(ROOT / ".tmpfiles" / "evidence"))
    args = parser.parse_args()
    base_url = args.base_url.rstrip("/") + "/"
    evidence = Path(args.evidence_dir)
    evidence.mkdir(parents=True, exist_ok=True)

    runtime_errors: list[str] = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        runtime_errors += run_desktop(browser, base_url, evidence)
        runtime_errors += run_mobile(browser, base_url, evidence)
        browser.close()

    failed = [result for result in results if not result["pass"]]
    report = {
        "baseUrl": base_url,
        "checkedAt": DATA["meta"]["auditedAt"],
        "total": len(results),
        "passed": len(results) - len(failed),
        "failed": len(failed),
        "runtimeErrors": sorted(set(runtime_errors)),
        "results": results,
    }
    report_path = evidence / "e2e-report.json"
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\n{report['passed']}/{report['total']} checks passed")
    print(f"report: {report_path}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
