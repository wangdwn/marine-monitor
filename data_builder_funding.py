#!/usr/bin/env python3
"""
海智数科 · 经营盘 funding 数据构建器
生成 app/public/data/funding.json
数据来源：360搜索 + 公开政策文件（真实项目，已标注来源机构）
"""
import json, os
from datetime import date

# ============ 政府资助项目 + 企业融资动态 ============
# category: 基金类(股权/投资) | 专项资金类(补助/奖励) | 国债类(基础设施)
# sourceLevel: national|provincial|city|district|social|cross_region
# status: open(开放申报)|ongoing(进行中)|upcoming(即将开放)|closed(已截止)

ITEMS = [
    # ---- 专项资金类 · 省级 ----
    {
        "name": "广东省海洋六大产业专项项目",
        "category": "专项资金类",
        "sourceLevel": "provincial",
        "status": "ongoing",
        "isHot": True,
        "supportDirection": "海洋电子信息、海上风电、海洋生物医药、海洋工程装备、海洋公共服务、海洋油气化工六大产业，重点支持关键核心技术攻关与产业化。",
        "amountRange": "年度专题经费约2.95亿元",
        "sourceOrg": "广东省自然资源厅",
        "contactDept": "广东省自然资源厅海洋规划与经济处",
        "fundType": "无偿补助 / 事前资助",
        "basisDoc": "《2024年省级促进经济高质量发展（海洋经济发展）海洋六大产业专项项目申报指南》",
        "applicationProcess": "发布申报指南\n地市主管部门初审推荐\n省厅组织专家评审\n入库立项\n拨付专项资金",
        "keyPoints": "广东海洋经济的核心专项，六大赛道全覆盖；企业须为涉海主体，项目未享受过同类省级补助。",
        "tags": ["海洋六大产业", "省级专项", "无偿补助"]
    },
    {
        "name": "广东省海洋经济发展资金",
        "category": "专项资金类",
        "sourceLevel": "provincial",
        "status": "closed",
        "isHot": False,
        "supportDirection": "支持海洋经济重点项目建设，同一企业相同或类似项目只能申请省级财政补助一次。",
        "amountRange": "按项目核定",
        "sourceOrg": "广东省海洋局 / 省财政厅",
        "contactDept": "属地海洋主管部门",
        "fundType": "无偿补助",
        "basisDoc": "《关于组织申请2025年度省海洋经济发展资金的通知》",
        "applicationProcess": "企业申报\n属地初审\n省级评审\n公示拨付",
        "keyPoints": "补助项目应未享受过其他省级、县级财政专项资金；强调财政资金使用效率。",
        "tags": ["海洋经济", "省级", "财政补助"]
    },
    {
        "name": "广东省海洋综合管理专项资金",
        "category": "专项资金类",
        "sourceLevel": "provincial",
        "status": "ongoing",
        "isHot": False,
        "supportDirection": "海域海岛管理、海洋调查、生态修复等海洋综合管理事项，项目入库全流程管理。",
        "amountRange": "按项目入库核定",
        "sourceOrg": "广东省自然资源厅",
        "contactDept": "广东省自然资源厅海洋规划与经济处",
        "fundType": "无偿补助",
        "basisDoc": "《广东省海洋综合管理专项资金管理实施细则》",
        "applicationProcess": "项目入库申报\n主管部门审核\n纳入项目库\n按年度安排资金",
        "keyPoints": "依据涉海单位名录、年度重点工作要素及上年度资金使用效率等因素统筹安排。",
        "tags": ["海洋综合管理", "专项资金", "项目库"]
    },
    {
        "name": "广东省捕捞业改造提升项目",
        "category": "专项资金类",
        "sourceLevel": "provincial",
        "status": "closed",
        "isHot": False,
        "supportDirection": "支持捕捞渔船更新改造、渔业装备提升，推动传统捕捞业转型升级。",
        "amountRange": "按渔船类型核定",
        "sourceOrg": "广东省农业农村厅",
        "contactDept": "属地农业农村（渔业）主管部门",
        "fundType": "以奖代补",
        "basisDoc": "《2025年广东省捕捞业改造提升项目申报指南》",
        "applicationProcess": "渔民/企业申报\n县级审核\n市级汇总\n省级核定",
        "keyPoints": "面向传统捕捞渔船，强调淘汰老旧、更新装备。",
        "tags": ["捕捞业", "渔船改造", "以奖代补"]
    },
    {
        "name": "广东省重点领域研发计划「海洋科技」重大专项旗舰项目",
        "category": "专项资金类",
        "sourceLevel": "provincial",
        "status": "closed",
        "isHot": True,
        "supportDirection": "面向海洋科技关键核心技术攻关，旗舰项目聚焦海洋高端装备、海洋生物资源开发等重大方向。",
        "amountRange": "单个项目千万级",
        "sourceOrg": "广东省科学技术厅",
        "contactDept": "广东省科学技术厅资源配置管理处",
        "fundType": "事前资助 / 无偿补助",
        "basisDoc": "《关于组织申报2024年度广东省重点领域研发计划「海洋科技」重大专项旗舰项目的通知》",
        "applicationProcess": "网上填报\n单位推荐\n形式审查\n专家评审\n立项公示",
        "keyPoints": "旗舰项目定位重大突破，要求牵头单位具备高水平研发能力，鼓励产学研联合。",
        "tags": ["海洋科技", "重大专项", "旗舰项目"]
    },
    # ---- 专项资金类 · 国家级 ----
    {
        "name": "国家重点研发计划「海洋农业与淡水渔业科技创新」重点专项",
        "category": "专项资金类",
        "sourceLevel": "national",
        "status": "ongoing",
        "isHot": True,
        "supportDirection": "海洋农业与淡水渔业科技创新，含水产种业、智能养殖装备、深海渔业资源开发等方向。",
        "amountRange": "国家级重大专项",
        "sourceOrg": "科学技术部 / 农业农村部",
        "contactDept": "国家科技管理信息系统",
        "fundType": "事前资助",
        "basisDoc": "《国家重点研发计划「海洋农业与淡水渔业科技创新」等11个重点专项2025年度项目申报指南》",
        "applicationProcess": "国家科技管理信息系统申报\n申报单位审核推荐\n专业机构评审\n立项批复",
        "keyPoints": "2025年度11个重点专项集中发布；强调种业自主可控与深远海养殖装备。",
        "tags": ["国家重点研发", "水产种业", "深海渔业"]
    },
    # ---- 专项资金类 · 区级 ----
    {
        "name": "南沙区船舶与海洋工程装备产业科技攻关项目",
        "category": "专项资金类",
        "sourceLevel": "district",
        "status": "closed",
        "isHot": False,
        "supportDirection": "南沙区船舶与海洋工程装备产业关键核心技术攻关，支持区内企业开展装备研发与产业化。",
        "amountRange": "按攻关方向核定",
        "sourceOrg": "广州南沙经济技术开发区科学技术局",
        "contactDept": "南沙区科技局",
        "fundType": "无偿补助",
        "basisDoc": "《2025年南沙区船舶与海洋工程装备产业科技攻关项目申报指南》",
        "applicationProcess": "企业申报\n区科技局初审\n专家评审\n立项支持",
        "keyPoints": "南沙区聚焦船舶海工装备的区级专项，服务南沙海洋装备产业集群。",
        "tags": ["南沙", "船舶海工", "区级专项"]
    },
    # ---- 基金类 ----
    {
        "name": "广东省自然科学基金（海洋领域）",
        "category": "基金类",
        "sourceLevel": "provincial",
        "status": "ongoing",
        "isHot": False,
        "supportDirection": "支持海洋科学基础研究与前沿探索，含面上项目、区域联合基金等类型。",
        "amountRange": "面上项目10-30万/项",
        "sourceOrg": "广东省科学技术厅 / 省基金委",
        "contactDept": "广东省基础与应用基础研究基金管理委员会",
        "fundType": "基础研究资助",
        "basisDoc": "《广东省自然科学基金项目申报指南》",
        "applicationProcess": "系统申报\n依托单位审核\n同行评议\n立项资助",
        "keyPoints": "中山大学海洋科学学院等机构2026年度获批省基金项目5项，海洋基础研究持续受支持。",
        "tags": ["自然科学基金", "基础研究", "海洋科学"]
    },
    {
        "name": "海洋灾害预警与防护广东省重点实验室开放基金",
        "category": "基金类",
        "sourceLevel": "provincial",
        "status": "open",
        "isHot": False,
        "supportDirection": "面向海洋灾害预警与防护方向的开放课题，支持实验室外部科研人员申报。",
        "amountRange": "开放课题3-10万/项",
        "sourceOrg": "汕头大学 · 广东省重点实验室",
        "contactDept": "海洋灾害预警与防护广东省重点实验室",
        "fundType": "开放基金",
        "basisDoc": "《海洋灾害预警与防护广东省重点实验室开放基金课题申请指南》",
        "applicationProcess": "提交申请书\n实验室评审\n立项公示\n签订任务书",
        "keyPoints": "开放基金面向全国，聚焦海洋灾害监测、预警、防护技术。",
        "tags": ["重点实验室", "开放基金", "海洋灾害"]
    },
    {
        "name": "广东省海洋新兴产业投资基金",
        "category": "基金类",
        "sourceLevel": "provincial",
        "status": "ongoing",
        "isHot": True,
        "supportDirection": "由广东战新引导基金发起，面向海洋新兴产业股权投资，正在招募管理人（GP）。",
        "amountRange": "引导基金出资规模待定",
        "sourceOrg": "广东省战新产业引导基金",
        "contactDept": "基金管理人（GP）遴选机构",
        "fundType": "股权投资",
        "basisDoc": "《海洋新兴产业投资基金招募管理人公告》",
        "applicationProcess": "提交GP申报材料\n遴选评审\n设立基金\n项目投资",
        "keyPoints": "广东首只专注海洋新兴产业的省级引导基金，为海洋科技企业提供股权融资通道。",
        "tags": ["产业基金", "股权投资", "GP遴选"]
    },
    {
        "name": "广州海洋经济产业基金",
        "category": "基金类",
        "sourceLevel": "city",
        "status": "ongoing",
        "isHot": True,
        "supportDirection": "广州市发行10亿规模海洋经济产业基金，重点投向海洋高端装备、海洋生物医药等赛道。",
        "amountRange": "10亿元规模",
        "sourceOrg": "广州市政府引导基金",
        "contactDept": "广州市金融局 / 基金管理人",
        "fundType": "股权投资",
        "basisDoc": "广州市海洋经济产业基金设立方案",
        "applicationProcess": "项目对接\n尽调评估\n投决会\n出资",
        "keyPoints": "广州海洋产业股权融资的重要工具，配套海洋金融二十条落地。",
        "tags": ["广州", "产业基金", "10亿规模"]
    },
    {
        "name": "广东海洋牧场产业基金",
        "category": "基金类",
        "sourceLevel": "provincial",
        "status": "ongoing",
        "isHot": False,
        "supportDirection": "广东省首只海洋牧场产业基金，已对水产企业完成9500万元增资，支持海洋牧场全产业链。",
        "amountRange": "首期已投9500万元",
        "sourceOrg": "广东省海洋牧场产业基金",
        "contactDept": "基金管理人",
        "fundType": "股权投资",
        "basisDoc": "海洋牧场产业基金投资公告",
        "applicationProcess": "产业链企业筛选\n尽调\n增资扩股\n投后管理",
        "keyPoints": "聚焦海洋牧场（深远海养殖）赛道，标志广东海洋牧场金融工具落地。",
        "tags": ["海洋牧场", "产业基金", "增资扩股"]
    },
    # ---- 国债类 / 政策类 ----
    {
        "name": "广东「海洋金融二十条」",
        "category": "国债类",
        "sourceLevel": "provincial",
        "status": "ongoing",
        "isHot": True,
        "supportDirection": "加快发展蓝色金融产业，支持涉海企业在境内外上市融资，设立海洋科创专项贷款。",
        "amountRange": "政策工具（含专项贷款额度）",
        "sourceOrg": "广东省地方金融监督管理局",
        "contactDept": "广东省地方金融监督管理局",
        "fundType": "上市培育 / 专项贷款",
        "basisDoc": "《广东省加快发展蓝色金融产业若干措施》（海洋金融二十条）",
        "applicationProcess": "涉海企业上市培育库申报\n银行专项贷款对接\n上市辅导支持",
        "keyPoints": "强化涉海企业上市培育，为海洋企业打通股权融资+信贷融资双通道。",
        "tags": ["蓝色金融", "上市培育", "专项贷款"]
    },
    {
        "name": "广东省推动海洋经济高质量发展行动方案（2025-2027）",
        "category": "国债类",
        "sourceLevel": "provincial",
        "status": "ongoing",
        "isHot": True,
        "supportDirection": "省级海洋经济三年行动方案，统筹重大项目、基础设施与产业布局，配套资金要素保障。",
        "amountRange": "方案级（配套多类资金）",
        "sourceOrg": "中共广东省委办公厅 / 省政府办公厅",
        "contactDept": "广东省海洋主管部门",
        "fundType": "综合政策资金",
        "basisDoc": "《广东省推动海洋经济高质量发展行动方案（2025—2027年）》",
        "applicationProcess": "项目纳入省重点项目库\n争取国家/省级资金\n逐级上报实施",
        "keyPoints": "2026年1月30日印发，是广东海洋经济顶层设计，重大项目资金争取的核心依据。",
        "tags": ["行动方案", "顶层设计", "重点项目"]
    },
    # ---- 企业融资动态 · 社会资本 ----
    {
        "name": "广州金控布局海洋产业新赛道（深海科技）",
        "category": "基金类",
        "sourceLevel": "social",
        "status": "ongoing",
        "isHot": True,
        "supportDirection": "广州金控集团推进深海科技产学研投融合，布局海洋产业新赛道股权投资。",
        "amountRange": "集团产业投资布局",
        "sourceOrg": "广州金融控股集团",
        "contactDept": "广州金控投资部门",
        "fundType": "股权投资",
        "basisDoc": "东方财富网报道《深海科技产学研投融合提速，广州金控布局海洋产业新赛道》",
        "applicationProcess": "项目对接广州金控\n产业尽调\n战略投资",
        "keyPoints": "地方金控平台进场海洋科技，标志深海科技赛道获国资资本关注。",
        "tags": ["广州金控", "深海科技", "战略投资"]
    },
    {
        "name": "国联水产携手国资基金，国美水产增资扩股",
        "category": "基金类",
        "sourceLevel": "social",
        "status": "closed",
        "isHot": False,
        "supportDirection": "国联水产引入国资基金对子公司国美水产增资扩股，推动海洋食品深加工。",
        "amountRange": "增资扩股（国资基金）",
        "sourceOrg": "国联水产 / 国资基金",
        "contactDept": "国联水产董事会",
        "fundType": "股权投资",
        "basisDoc": "中金在线报道《国联水产携手国资基金注入新动能》",
        "applicationProcess": "增资扩股协议\n国资基金出资\n工商变更",
        "keyPoints": "海洋食品深加工企业获国资基金加持，产业链资本化加速。",
        "tags": ["国联水产", "增资扩股", "国资基金"]
    },
    {
        "name": "粤港澳海洋产业基金（专家呼吁设立）",
        "category": "基金类",
        "sourceLevel": "cross_region",
        "status": "upcoming",
        "isHot": False,
        "supportDirection": "专家呼吁粤港澳三地联合设立海洋产业基金，推动大湾区海洋经济协同投资。",
        "amountRange": "拟设立（规模待定）",
        "sourceOrg": "粤港澳大湾区（建议）",
        "contactDept": "待定",
        "fundType": "股权投资",
        "basisDoc": "今日头条《海洋竞争升维！专家呼吁粤港澳成立产业基金》",
        "applicationProcess": "政策研究\n三地协商\n基金设立",
        "keyPoints": "跨区域海洋产业基金仍处倡议阶段，是未来大湾区海洋投资的重要方向。",
        "tags": ["粤港澳", "跨区域基金", "倡议阶段"]
    },
]

# 补 id 字段（前端 openDetail 依赖）
for _i, _it in enumerate(ITEMS, 1):
    _it["id"] = _i

OUT = {
    "updated": date.today().isoformat(),
    "source": "360搜索 + 公开政策文件（广东省自然资源厅/科技厅/农业农村厅等）",
    "count": len(ITEMS),
    "items": ITEMS,
}

out_dir = os.path.join(os.path.dirname(__file__), "app", "public", "data")
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "funding.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(OUT, f, ensure_ascii=False, indent=2)
print(f"✅ funding.json 已生成：{out_path}，{len(ITEMS)} 条")
