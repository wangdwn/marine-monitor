#!/usr/bin/env python3
"""
海智数科 · 经营盘 map 数据构建器
生成 app/public/data/map.json
资源点位：基础设施 / 文化遗产 / 海域资源（广州各区真实点位）
"""
import json, os
from datetime import date

# resourceType: infrastructure(基础设施) | cultural_heritage(文化遗产) | marine_area(海域资源)
# developmentStatus: operational(运营中) | developing(开发中)

RESOURCES = [
    # ---- 基础设施 ----
    {
        "resourceName": "广州南沙港（南沙港区）",
        "resourceType": "infrastructure",
        "region": "南沙区",
        "latitude": 22.62, "longitude": 113.57,
        "description": "广州港核心深水港区，华南最大集装箱枢纽港之一，支撑海洋物流与航运中心建设。",
        "valueLevel": 5,
        "capacity": 25000000,
        "annualVisitors": None,
        "developmentStatus": "operational",
    },
    {
        "resourceName": "南沙国际邮轮母港",
        "resourceType": "infrastructure",
        "region": "南沙区",
        "latitude": 22.72, "longitude": 113.60,
        "description": "华南地区国际邮轮枢纽港，服务邮轮旅游与海洋休闲产业。",
        "valueLevel": 5,
        "capacity": 750000,
        "annualVisitors": None,
        "developmentStatus": "operational",
    },
    {
        "resourceName": "南沙客运港",
        "resourceType": "infrastructure",
        "region": "南沙区",
        "latitude": 22.70, "longitude": 113.61,
        "description": "穗港澳客运航线枢纽，连接粤港澳大湾区的海上客运通道。",
        "valueLevel": 4,
        "capacity": 1200000,
        "annualVisitors": None,
        "developmentStatus": "operational",
    },
    {
        "resourceName": "广州海洋地质调查局南沙基地",
        "resourceType": "infrastructure",
        "region": "南沙区",
        "latitude": 22.66, "longitude": 113.55,
        "description": "国家级海洋地质调查科研基地，承担深海矿产资源勘探与海洋地质调查任务。",
        "valueLevel": 5,
        "capacity": None,
        "annualVisitors": None,
        "developmentStatus": "operational",
    },
    {
        "resourceName": "广州港新沙港区",
        "resourceType": "infrastructure",
        "region": "黄埔区",
        "latitude": 23.03, "longitude": 113.55,
        "description": "广州港重要港区，承担大宗散货与集装箱运输。",
        "valueLevel": 4,
        "capacity": 15000000,
        "annualVisitors": None,
        "developmentStatus": "operational",
    },
    # ---- 文化遗产 ----
    {
        "resourceName": "南海神庙（波罗庙）",
        "resourceType": "cultural_heritage",
        "region": "黄埔区",
        "latitude": 23.08, "longitude": 113.48,
        "description": "海上丝绸之路起点遗址之一，广州海洋文化标志性遗产，历代祭祀南海神的国家级庙宇。",
        "valueLevel": 5,
        "capacity": None,
        "annualVisitors": 800000,
        "developmentStatus": "operational",
    },
    {
        "resourceName": "南沙天后宫",
        "resourceType": "cultural_heritage",
        "region": "南沙区",
        "latitude": 22.75, "longitude": 113.61,
        "description": "华南地区规模最大的妈祖庙，海洋信仰文化地标，毗邻大角山滨海。",
        "valueLevel": 4,
        "capacity": None,
        "annualVisitors": 1200000,
        "developmentStatus": "operational",
    },
    {
        "resourceName": "黄埔古港（海丝遗址）",
        "resourceType": "cultural_heritage",
        "region": "海珠区",
        "latitude": 23.10, "longitude": 113.36,
        "description": "明清广州外贸港口遗址，海上丝绸之路重要节点，现存古港码头与粤海第一关。",
        "valueLevel": 4,
        "capacity": None,
        "annualVisitors": 600000,
        "developmentStatus": "operational",
    },
    {
        "resourceName": "沙湾古镇",
        "resourceType": "cultural_heritage",
        "region": "番禺区",
        "latitude": 22.90, "longitude": 113.33,
        "description": "岭南水乡古镇，保留蚝壳墙等海洋渔耕文化遗存，番禺海洋文化代表。",
        "valueLevel": 3,
        "capacity": None,
        "annualVisitors": 1500000,
        "developmentStatus": "operational",
    },
    # ---- 海域资源 ----
    {
        "resourceName": "南沙湿地（红树林）",
        "resourceType": "marine_area",
        "region": "南沙区",
        "latitude": 22.58, "longitude": 113.61,
        "description": "珠江口重要滨海湿地与红树林生态系统，候鸟栖息地，兼具蓝碳价值。",
        "valueLevel": 5,
        "capacity": None,
        "annualVisitors": 500000,
        "developmentStatus": "operational",
    },
    {
        "resourceName": "龙穴岛红树林湿地",
        "resourceType": "marine_area",
        "region": "南沙区",
        "latitude": 22.60, "longitude": 113.60,
        "description": "珠江口滨海湿地与红树林修复区，海洋生态修复与蓝碳计量监测重要载体。",
        "valueLevel": 4,
        "capacity": None,
        "annualVisitors": None,
        "developmentStatus": "developing",
    },
    {
        "resourceName": "海鸥岛",
        "resourceType": "marine_area",
        "region": "番禺区",
        "latitude": 22.90, "longitude": 113.55,
        "description": "珠江口岛屿，渔业与滨海生态旅游综合开发区域。",
        "valueLevel": 3,
        "capacity": None,
        "annualVisitors": 900000,
        "developmentStatus": "developing",
    },
    {
        "resourceName": "海珠湿地（海珠湖）",
        "resourceType": "marine_area",
        "region": "海珠区",
        "latitude": 23.06, "longitude": 113.32,
        "description": "城市中心湿地，连通珠江感潮水系，湿地生态与海洋文化科普节点。",
        "valueLevel": 4,
        "capacity": None,
        "annualVisitors": 1000000,
        "developmentStatus": "operational",
    },
    {
        "resourceName": "大角山滨海公园（海岸带）",
        "resourceType": "marine_area",
        "region": "南沙区",
        "latitude": 22.76, "longitude": 113.62,
        "description": "南沙滨海海岸带，滨海休闲与海岸带资源综合利用示范区域。",
        "valueLevel": 3,
        "capacity": None,
        "annualVisitors": 700000,
        "developmentStatus": "operational",
    },
]

# 补 id
for _i, _r in enumerate(RESOURCES, 1):
    _r["id"] = _i

OUT = {
    "updated": date.today().isoformat(),
    "source": "广州市公开地理信息 + 海洋资源普查（点位坐标为公开数据）",
    "count": len(RESOURCES),
    "resources": RESOURCES,
}

out_dir = os.path.join(os.path.dirname(__file__), "app", "public", "data")
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "map.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(OUT, f, ensure_ascii=False, indent=2)
print(f"✅ map.json 已生成：{out_path}，{len(RESOURCES)} 个点位")
