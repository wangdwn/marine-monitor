#!/usr/bin/env python3
"""轻量政策监测：每周用博查 API 扫一遍海洋经济政策面，写入 app/public/data/policy_watch.json

运行：
  BOCHA_API_KEY=xxx python3 scripts/policy_watch.py            # 增量更新
  BOCHA_API_KEY=xxx python3 scripts/policy_watch.py --days 30  # 回看窗口

设计原则（与站内其他采集一致）：
  - 只收录公开报道/官方页面，不编造、不推断
  - 无发布日期的条目标〔日期待核〕，不丢弃也不冒充
  - key 缺失时直接退出并说明，不伪造数据
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.request
from datetime import date, datetime, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "app" / "public" / "data" / "policy_watch.json"

QUERIES = [
    "广州 海洋经济 政策 规划",
    "自然资源部 海洋经济 政策",
    "海洋 专项资金 申报 通知",
    "广东 海上风电 政策",
    "海洋牧场 政策 建设",
    "海域使用权 出让 拍卖",
]

# 标题至少命中其一才收录
KEEP_KW = ["海洋", "海风", "海上风电", "蓝碳", "海洋牧场", "用海", "海域",
           "深远海", "船舶", "海工", "渔业", "滨海"]
# 噪音排除
EXCLUDE_KW = ["招聘", "论文", "股吧", "早报", "研报", "模板", "PPT", ".docx"]

BOCHA_URL = "https://api.bochaai.com/v1/web-search"


def bocha_search(key: str, query: str, count: int = 8) -> list:
    body = {"query": query, "count": count, "freshness": "month", "summary": True}
    req = urllib.request.Request(
        BOCHA_URL, data=json.dumps(body).encode("utf-8"),
        headers={"Content-Type": "application/json",
                 "Authorization": f"Bearer {key}"},
        method="POST")
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            payload = json.loads(resp.read().decode("utf-8"))
    except Exception as e:  # noqa: BLE001
        print(f"[采集失败] {query}: {e}", file=sys.stderr)
        return []
    pages = (payload.get("data") or {}).get("webPages", {}).get("value") or []
    return pages


def parse_d(s: str):
    if not s:
        return None
    s = s[:10]
    for fmt in ("%Y-%m-%d", "%Y/%m/%d"):
        try:
            return datetime.strptime(s, fmt).date()
        except ValueError:
            continue
    return None


def relevant(title: str) -> bool:
    if any(k in title for k in EXCLUDE_KW):
        return False
    return any(k in title for k in KEEP_KW)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--days", type=int, default=14)
    args = ap.parse_args()

    key = os.environ.get("BOCHA_API_KEY", "").strip()
    if not key:
        print("STATUS=missing_key 未配置 BOCHA_API_KEY，跳过采集。"
              "请在仓库 Settings → Secrets and variables → Actions 中添加名为 BOCHA_API_KEY 的 secret。")
        return 0

    cutoff = date.today() - timedelta(days=args.days)
    seen_urls: set[str] = set()
    items: list[dict] = []

    for q in QUERIES:
        print(f"[采集] {q}")
        for p in bocha_search(key, q):
            url = (p.get("url") or "").strip()
            title = (p.get("name") or "").strip()
            if not url or not title or url in seen_urls:
                continue
            if not relevant(title):
                continue
            seen_urls.add(url)
            d = parse_d(str(p.get("datePublished") or ""))
            if d and d < cutoff:
                continue  # 窗口外丢弃（博查 freshness 过滤不可靠，本地再卡一次）
            items.append({
                "title": title,
                "url": url,
                "publish_date": d.isoformat() if d else "〔日期待核〕",
                "summary": (p.get("summary") or p.get("snippet") or "")[:220].replace("\n", " "),
                "query": q,
                "site": re.sub(r"^https?://([^/]+).*$", r"\1", url),
            })

    # 日期倒序，待核排最后
    items.sort(key=lambda x: x["publish_date"], reverse=True)

    out = {
        "updated": date.today().isoformat(),
        "window_days": args.days,
        "source": "博查 web-search API（公开网页）",
        "count": len(items),
        "items": items,
        "note": "只读监测；条目标〔日期待核〕者引用前请人工核对。",
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"STATUS=ok 采集完成：{len(items)} 条 → {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
