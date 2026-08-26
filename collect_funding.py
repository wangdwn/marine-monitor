#!/usr/bin/env python3
"""
海智数科 · funding 数据采集器
用 360 搜索增量采集政府资助项目 + 企业融资动态，合并到 app/public/data/funding.json

运行：
  python3 collect_funding.py            # 增量采集，合并进现有数据
  python3 collect_funding.py --full     # 重建（保留手工精编条目 + 新增采集条目）

设计原则：
  - 只增不改：手工精编的条目（有 amountRange/applicationProcess 等详情的）保留原样
  - 采集到的新条目字段部分填充，待人工补全
  - 输出带 updated 时间戳，供前端展示数据新鲜度
"""
import json, re, urllib.request, urllib.parse, time, os, sys
from datetime import date

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"

# 关键词组：查询词 / 默认分类 / 默认层级
QUERIES = [
    ("广东省海洋经济发展 专项资金 申报 2026", "专项资金类", "provincial"),
    ("海洋六大产业 专项 申报指南", "专项资金类", "provincial"),
    ("广东省海洋科技 项目 申报", "专项资金类", "provincial"),
    ("广州市 海洋 科技计划 项目 申报", "专项资金类", "city"),
    ("海洋 国家重点研发计划 专项 2026", "专项资金类", "national"),
    ("广东省自然科学基金 海洋", "基金类", "provincial"),
    ("海洋 产业基金 股权 广州", "基金类", "city"),
    ("广州 涉海企业 融资 上市", "基金类", "social"),
    ("海洋 企业 增资 融资", "基金类", "social"),
    ("海洋 专项债 基础设施", "国债类", "provincial"),
]

# 命中关键词（标题里出现才收录）
HIT_KW = ["申报", "资金", "基金", "融资", "专项", "补助", "资助", "增资", "上市", "投资", "专项债", "贷款"]

# 噪音源黑名单（文档模板/股吧/早报等，一律排除）
EXCLUDE_NOISE = ["可行性研究", "报告模板", ".docx", "PPT", "文库", "股吧", "早报", "研报", "招聘", "论文", "学习与解读", "学习资料"]

# 地域黑名单（非广东/广州/国家级的外地项目，排除）
EXCLUDE_REGIONS = ["山东", "青岛", "烟台", "威海", "温州", "福建", "厦门", "浙江", "江苏",
                   "海南", "辽宁", "大连", "天津", "上海", "宁波", "舟山", "北海", "连云港", "泉州", "汕头"]

# 国家级/本地标志（含这些词则即使命中地域黑名单也保留）
KEEP_FLAGS = ["国家", "全国", "广东省", "广东", "广州市", "广州", "南沙", "粤港澳", "大湾区", "黄埔", "番禺", "海珠", "天河", "荔湾"]

def is_relevant(title):
    """判断标题是否相关：排除噪音源和外地无关项目"""
    if any(kw in title for kw in EXCLUDE_NOISE):
        return False
    if any(kw in title for kw in EXCLUDE_REGIONS) and not any(kw in title for kw in KEEP_FLAGS):
        return False
    return True

def search_360(query, max_results=6):
    """搜 360，返回标题+摘要列表"""
    try:
        enc = urllib.parse.quote(query)
        url = f"https://www.so.com/s?q={enc}"
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        resp = urllib.request.urlopen(req, timeout=10)
        html = resp.read().decode("utf-8", errors="replace")
        titles = re.findall(r'<h3[^>]*class="res-title[^"]*"[^>]*>.*?<a[^>]*>(.*?)</a>', html, re.DOTALL)
        descs = re.findall(r'class="res-desc"[^>]*>(.*?)</p>', html, re.DOTALL)
        out = []
        for i in range(min(len(titles), max_results)):
            t = re.sub(r"<[^>]+>", "", titles[i]).strip()
            d = re.sub(r"<[^>]+>", "", descs[i]).strip() if i < len(descs) else ""
            if t:
                out.append({"title": t, "desc": d[:200]})
        return out
    except Exception as e:
        print(f"  [搜索失败] {query}: {e}")
        return []

def infer_org(title):
    """从标题推断来源机构"""
    for org in ["广东省自然资源厅", "广东省科学技术厅", "广东省农业农村厅", "广东省财政厅",
                "广州市科学技术局", "广州市农业农村局", "南沙区", "科学技术部", "自然资源部",
                "农业农村部", "国家自然科学基金", "广州港", "广州金控"]:
        if org in title:
            return org
    return "待核实"

def build_item(title, desc, category, level):
    return {
        "name": title,
        "category": category,
        "sourceLevel": level,
        "status": "ongoing",
        "isHot": False,
        "supportDirection": desc or "详见申报指南",
        "amountRange": "详见申报指南",
        "sourceOrg": infer_org(title),
        "contactDept": "详见申报指南",
        "fundType": "待核实",
        "basisDoc": title,
        "applicationProcess": "详见申报指南\n提交申报材料\n主管部门审核\n立项拨付",
        "keyPoints": "自动采集条目，待人工补全关键要点。",
        "tags": ["自动采集"],
        "auto": True,  # 标记为自动采集，可被人工覆盖
    }

def collect_new():
    """采集新条目"""
    new_items = []
    for query, cat, level in QUERIES:
        print(f"[采集] {query}")
        for r in search_360(query):
            if any(kw in r["title"] for kw in HIT_KW) and is_relevant(r["title"]):
                new_items.append(build_item(r["title"], r["desc"], cat, level))
        time.sleep(0.8)  # 限速
    return new_items

def load_existing(path):
    if os.path.exists(path):
        try:
            with open(path, encoding="utf-8") as f:
                d = json.load(f)
                return d.get("items", [])
        except Exception:
            return []
    return []

def norm_title(t):
    """规范化标题：去来源后缀、去空白、截断，用作去重 key"""
    t = re.sub(r"[|｜_\-—].*$", "", t)  # 去 | _ - 后的来源
    t = re.sub(r"\s+", "", t)
    return t[:25]

def main():
    data_path = os.path.join(os.path.dirname(__file__), "app", "public", "data", "funding.json")
    existing = load_existing(data_path)
    existing_keys = {norm_title(it.get("name", "")) for it in existing}

    new_items = collect_new()

    # 去重：标题规范化后未出现过的才保留
    added = []
    for it in new_items:
        k = norm_title(it["name"])
        if k and k not in existing_keys:
            existing_keys.add(k)
            added.append(it)

    # 合并：手工精编在前，新增采集在后
    merged = existing + added
    # 重新分配 id
    for i, it in enumerate(merged, 1):
        it["id"] = i

    out = {
        "updated": date.today().isoformat(),
        "source": "360搜索增量采集 + 公开政策文件",
        "count": len(merged),
        "items": merged,
    }

    os.makedirs(os.path.dirname(data_path), exist_ok=True)
    with open(data_path, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)

    print(f"\n✅ 采集完成：新增 {len(added)} 条，共 {len(merged)} 条")
    for a in added:
        print(f"  + {a['name'][:50]}")

if __name__ == "__main__":
    main()
