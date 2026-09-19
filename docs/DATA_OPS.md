# 经营盘数据运维建议

| 数据集 | 路径 | 建议更新频率 | 口径 |
|---|---|---|---|
| 结构判断包 | `app/public/data/structure_judgment.json` | 随家底/招标/资金变更重跑 `build_structure_judgment.py` | 仅聚合可溯源字段 |
| 专项资金 | `app/public/data/funding.json` | 月度 | 只读监测，不做申请入口 |
| 招标 notices | `app/public/data/notices.json`（同步自 geo-ocean-bidding） | 月度；重大项目可周更 | 每条须有 `source_url` 或标〔待核〕 |

定位：监测研判 ≠ 广海汇撮合。禁止编造预算/中标额。
