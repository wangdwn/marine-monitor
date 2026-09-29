# 经营盘数据运维建议

| 数据集 | 路径 | 建议更新频率 | 口径 |
|---|---|---|---|
| 结构判断包 | `app/public/data/structure_judgment.json` | 随家底/招标/资金变更人工重跑（`build_structure_judgment.py`〔脚本缺失，待补〕） | 仅聚合可溯源字段 |
| 专项资金 | `app/public/data/funding.json` | 每周一自动采集（funding-collect.yml），采集摘要见 Actions 运行页 | 只读监测，不做申请入口 |
| 招标 notices | `app/public/data/notices.json`（同步自 geo-ocean-bidding） | 每周一自动同步（notices-sync.yml）；重大项目可手动触发 | 每条须有 `source_url` 或标〔待核〕 |
| 周报 | `app/public/weekly/latest.json`（源头 marine-weekly） | 周更；每周五到期提醒（weekly-reminder.yml） | 指标均可追溯，未编造财务 |

定位：监测研判 ≠ 广海汇撮合。禁止编造预算/中标额。

## 部署触发（2026-09-29 补记）

- 数据 workflow（funding-collect / notices-sync / policy-watch）用 `GITHUB_TOKEN` 推送数据提交时，**不会**触发 `deploy.yml`（GitHub 机制：GITHUB_TOKEN 触发的 push 事件不创建新的 workflow run）。
- 因此这三个 workflow 在推送成功后会显式 `dispatch` deploy.yml（见各 workflow 末尾"触发 Pages 重部署"步骤）；如发现站点数据滞后，先查 deploy 是否跑过。
