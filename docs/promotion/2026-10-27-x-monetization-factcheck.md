# X 变现计划事实核查证据表

状态：内部核查记录，已归档，未对外发布。日期：2026-10-27。

核查日期：2026-10-27（Asia/Taipei）
核查方法：X 官方帮助页/法律条款页直接抓取（live `legal.x.com` 直接返回 200）；`help.x.com` 全站对自动化请求返回 **403 Cloudflare**，改用 **Wayback Machine 存档快照**逐版本比对，存档 URL 已全部保留在表中可被第三方复核。

---

## 0. 先说规则更新时间线（这是本次核查最重要的发现）

**规则在 2026-10 之后确实又变了，而且不止一次。** 三处关键改动分别发生在官方帮助页被改版的三个不同日期，且目前多数二手报道仍在引用 8 月的旧版。

| 日期 | 改了什么 | 存档 URL | 对本报告的影响 |
|---|---|---|---|
| 2026-08-08 | OCR 帮助页首版上线。国家名单 **114 个**；申诉失败后 **90 天**可再申请；Payouts 只写「Connect a Stripe payout account or X Money Account」 | [web.archive.org/web/20260808035902/…](https://web.archive.org/web/20260808035902/https://help.x.com/en/using-x/original-content-rewards) | 多数媒体引用的版本 |
| **2026-10-05** | OCR 帮助页改版。国家名单扩到 **119 个**（新增 Brazil / Georgia / Gibraltar / Kazakhstan）；申诉失败后等待期 **90 天 → 42 天**；**删除**「3 个工作日内通知结果」；Payouts 段重写为「美国用户走 X Money，非美国用户走 Stripe」+ 两条 X Money FAQ | [web.archive.org/web/20261005131543/…](https://web.archive.org/web/20261005131543/https://help.x.com/en/using-x/original-content-rewards) | **本报告以此为主源** |
| **2026-10-12** | X 官方发布 **The X Subscription**，把 X Premium / SuperGrok / Cursor 合并成新档位：Free / Plus $8 / Premium $30 / Super $100 / Ultra $200 | [x.ai/news/x-subscription](https://x.ai/news/x-subscription) | 影响「有效 Premium 订阅」的定义 |
| **2026-10-15** | Creator Monetization Standards 改版。订阅资格表述新增 **"or a Plus, Premium, Super, or Ultra plan on The X Subscription"**；新增 **"You must connect an X Money account or verified Stripe account"** | [web.archive.org/web/20261015044557/…](https://web.archive.org/web/20261015044557/https://help.x.com/en/rules-and-policies/content-monetization-standards) | 门槛表述已变，旧文失效 |
| 2026-10-12 / 10-27 | Automation rules 页两次快照，页内标注 **"Updated April 2026"** | [web.archive.org/web/20261012153529/…](https://web.archive.org/web/20261012153529/https://help.x.com/en/rules-and-policies/x-automation) | 自动化条款正文未变 |

> ⚠️ **一处未解的时序矛盾**：OCR 帮助页 2026-10-05 快照里仍写「Hold an active X Premium, Premium+ or Premium Business subscription」，而 10-15 的 CMS 页已加入新档位。两者相差 10 天，官方两页在 10 月中旬存在表述不同步。**哪一版在 2026-10-27 当天生效，无法从存档确定**（Wayback 在核查末段临时离线，且 `help.x.com` 直接抓取被 403 拦截）。这一条已列入「查不到」清单。

---

## 1. 支持国家/地区名单（最关键）

### 1.1 完整名单（官方一手，119 个，2026-10-05 版）

Albania, Algeria, Angola, Antigua & Barbuda, Argentina, Armenia, Australia, Austria, Azerbaijan, Bahamas, Bahrain, Bangladesh, Belgium, Benin, Bhutan, Bolivia, Bosnia & Herzegovina, Botswana, **Brazil**, Brunei, Bulgaria, Cambodia, Canada, Chile, Colombia, Costa Rica, Côte d'Ivoire, Croatia, Cyprus, Czech Republic, Denmark, Dominican Republic, Ecuador, Egypt, El Salvador, Estonia, Ethiopia, Finland, France, Gabon, Gambia, **Georgia**, Germany, Ghana, **Gibraltar**, Greece, Guatemala, Guyana, **Hong Kong**, Hungary, Iceland, India, Indonesia, Ireland, Israel, Italy, Jamaica, Japan, Jordan, **Kazakhstan**, Kenya, Kuwait, Laos, Latvia, Liechtenstein, Lithuania, Luxembourg, Madagascar, Malaysia, Malta, Mauritius, Mexico, Moldova, Monaco, Mongolia, Morocco, Mozambique, Namibia, Netherlands, New Zealand, Niger, Nigeria, North Macedonia, Norway, Oman, Panama, Paraguay, Peru, Philippines, Poland, Portugal, Qatar, Romania, Rwanda, San Marino, Saudi Arabia, Senegal, Serbia, Singapore, Slovakia, Slovenia, South Africa, South Korea, Spain, Sri Lanka, St. Lucia, Sweden, Switzerland, **Taiwan**, Tanzania, Thailand, Trinidad & Tobago, Tunisia, Turkey, United Arab Emirates, United Kingdom, United States, Uruguay, Uzbekistan, Vietnam

- 机器可读副本：[/tmp/x-factcheck/ocr_countries_2026-10-05.txt](/tmp/x-factcheck/ocr_countries_2026-10-05.txt)
- 加粗 = 相对 2026-08-08 首版新增的 4 国
- 澳门/澳门特别行政区 **不在名单内**

### 1.2 证据表

| 结论 | 确切数值/表述 | 来源 URL | 来源日期 | 证据强度 | 置信度 |
|---|---|---|---|---|---|
| OCR 官方支持国家名单共 119 个，**不含中国大陆、不含澳门** | 见上表全文 | [web.archive.org/web/20261005131543/https://help.x.com/en/using-x/original-content-rewards](https://web.archive.org/web/20261005131543/https://help.x.com/en/using-x/original-content-rewards) | 2026-10-05 | 官方一手（存档快照） | **高** |
| 首版名单为 114 国，中国大陆同样不在其中 | 8/8 快照国家段落逐行比对，差集仅 Brazil/Georgia/Gibraltar/Kazakhstan | [web.archive.org/web/20260808035902/…](https://web.archive.org/web/20260808035902/https://help.x.com/en/using-x/original-content-rewards) | 2026-08-08 | 官方一手 | **高** |
| 老计划 CRS 的打款国家名单同样不含中国大陆（114 国） | "Our payments processor currently supports the following countries for payouts:" | [web.archive.org/web/20260921205352/https://help.x.com/en/using-x/creator-revenue-sharing](https://web.archive.org/web/20260921205352/https://help.x.com/en/using-x/creator-revenue-sharing) | 2026-09-21 | 官方一手 | **高** |
| 资格判定的地理口径是「人所在国家」，不是收款账户所在地 | Location: "Be based in a country where the Original Content Rewards Program is available." | 同 1.1 | 2026-10-05 | 官方一手 | **高** |
| CMS 用词是「居住」而非「注册」 | "You must reside in a country in which X's monetization programs are available." | [web.archive.org/web/20261015044557/…](https://web.archive.org/web/20261015044557/https://help.x.com/en/rules-and-policies/content-monetization-standards) | 2026-10-15 | 官方一手 | **高** |
| 官方条款同样用「在支持的国家」 | "be in a supported country"（§3 Eligibility） | [legal.x.com/original-content-rewards-terms](https://legal.x.com/original-content-rewards-terms) | Effective 2026-08-07（2026-10-27 复核在线） | 官方一手 | **高** |
| **没有**任何「人在支持国家、收款账户可开在第三地」的条款 | 全文检索 OCR 帮助页、OCR 条款、CMS、Subscriptions policy，均无此类豁免表述 | 同上四处 | — | 官方一手（消极证据） | **中高** |
| 香港、台湾在名单内，中国大陆不在 → 官方按地区而非国籍切分 | 见 1.1 名单 | 同 1.1 | 2026-10-05 | 官方一手 | **高** |

### 1.3 打款通道

| 结论 | 确切数值/表述 | 来源 URL | 来源日期 | 证据强度 | 置信度 |
|---|---|---|---|---|---|
| 美国用户走 X Money，非美国用户走 Stripe | "For U.S. users: Payouts are made through X Money… / For non-U.S. users: Connect a Stripe payout account and complete identity verification via Stripe" | [web.archive.org/web/20261005131543/…](https://web.archive.org/web/20261005131543/https://help.x.com/en/using-x/original-content-rewards) | 2026-10-05 | 官方一手 | **高** |
| X Money 是美国专属（按 SSN 唯一确定） | "Each person can have only one X Money account. This is based on your Social Security Number…" | 同上 | 2026-10-05 | 官方一手 | **高** |
| 2026-09-02 起美国创作者付款从 Stripe 全量切到 X Money；美国以外继续走 Stripe | "Starting from September 2, 2026, X has redirected all payouts for US-based creators from Stripe to its in-house payments service, X Money." | [news.paymentrisk.org/x-transfers-us-creator-payouts-from-stripe-to-x-money/](https://news.paymentrisk.org/x-transfers-us-creator-payouts-from-stripe-to-x-money/) | 2026-09-04 | 媒体二手（引 X 官方公告） | **中高** |
| 同上，TechCrunch 一手报道 | "U.S. creators moved to X Money on September 2, while creators outside the U.S. continued with Stripe" | [techcrunch.com/2026/09/02/x-shifts-us-creator-payouts-from-stripe-to-x-money/](https://techcrunch.com/2026/09/02/x-shifts-us-creator-payouts-from-stripe-to-x-money/) | 2026-09-02 | 媒体二手 | **中高** |
| **Stripe 在中国大陆不提供服务** | stripe.com 中国站页脚："Products and services displayed on this site are for information only, and are not available in mainland China." | [stripe.com/en-cn/global](https://stripe.com/en-cn/global) | 抓取于 2026-10-27 | 官方一手 | **高** |
| Stripe 账户国家不可事后更改 | "After activating a Stripe service on a live account, you can't change the business origin country." | [docs.stripe.com/get-started/account/activate](https://docs.stripe.com/get-started/account/activate) | 抓取于 2026-10-27 | 官方一手 | **高** |
| Stripe Connect 自助跨境付款**不支持**向 US/UK/EEA/CA/CH 以外地区打款 | "Stripe doesn't support self-serve cross-border payouts to countries outside the listed regions." | [docs.stripe.com/connect/cross-border-payouts](https://docs.stripe.com/connect/cross-border-payouts) | 抓取于 2026-10-27 | 官方一手 | **高** |
| Stripe Connect 的 KYC 逐国要求文档中**没有中国章节**（即无法以中国大陆为账户国完成 Connect 入驻） | 全文检索 "China" 无匹配，仅有 Singapore / Japan / UAE 章节 | [docs.stripe.com/connect/required-verification-information](https://docs.stripe.com/connect/required-verification-information) | 抓取于 2026-10-27 | 官方一手（消极证据） | **中** |
| Stripe Global Payouts 收款人清单含 HK/JP/TW/SG，**不含中国**；但 2026-04-22 起新增了「向中国收款」的银行账户类型 | 新增 `cn_bank_account`；`default_outbound_destination` 枚举新增中国 | [docs.stripe.com/changelog/dahlia/2026-04-22/cross-border-payouts-new-countries](https://docs.stripe.com/changelog/dahlia/2026-04-22/cross-border-payouts-new-countries) | 2026-04-22 | 官方一手 | **高**（事实）/ **低**（与 X 相关性） |
| Global Payouts 收款人清单 | 见该页表格，China 无行；Hong Kong `HK`/HKD/Wire、Taiwan `TW`/TWD/Wire、Singapore `SG`/SGD/Local bank method、Japan `JP`/JPY/Wire | [docs.stripe.com/global-payouts/recipient-requirements](https://docs.stripe.com/global-payouts/recipient-requirements) | 抓取于 2026-10-27 | 官方一手 | **高** |
| Global Payouts 发起方仅限美国、英国（其余为私有预览） | "Businesses located in the following countries can use Global Payouts to send money: United Kingdom, United States" | [docs.stripe.com/global-payouts](https://docs.stripe.com/global-payouts) | 抓取于 2026-10-27 | 官方一手 | **高** |

### 1.4 关于「合规路径」的证据边界

| 事实 | 来源 | 结论 |
|---|---|---|
| X 官方资格要求人「reside / be based in」支持国家 | 官方 OCR 帮助页 + CMS | **必须居住**在支持国家，没有「第三地收款」豁免条款 |
| Stripe Connect 跨境打款不支持自助向中国打款 | Stripe 官方文档 | 「开 Stripe 账户在支持地区、人在中国」这条路，**在支付通道层面被 Stripe 官方文档直接否定**（自助跨境的落点是 connected account 国家，不是你的居住地；你在中国就拿不到中国 connected account） |
| Stripe 中国大陆不提供服务 | stripe.com/en-cn 页脚 | 中国大陆无法开 Stripe 账户 |
| X 官方条款要求提供「proof of identity and/or residence」给支付处理方，且 "If X or the Payment Processor determines … that payments cannot be made to you for any reason, you cannot be part of the Program" | [legal.x.com/original-content-rewards-terms](https://legal.x.com/original-content-rewards-terms) §5 | 提供虚假居住地信息会导致**失去参与资格**，条款上明确写了后果 |
| X 条款还要求遵守 applicable laws，并授权 X 因违规终止 | 同上 §4 | 用不实居住地/身份信息属违约 |
| 「香港账户 / 新加坡账户」是否违规 | 官方原文只要求「居住/基于」支持国家 + 提供真实身份/居住证明 | **官方没有明文禁止**在支持地区开收款账户；但如果人实际居住在中国，这条路径与「Be based in a supported country」的门槛直接冲突。**这是推论，不是官方明文**，标为「查不到 / 需官方回复」 |

---

## 2. 「自动化内容」到底怎么算

### 2.1 官方原文（三条，层级不同）

| # | 原文 | 出处 | 层级 | 日期 |
|---|---|---|---|---|
| A | 内容不合资格清单含 **"Was created or posted using automated means"** | [web.archive.org/web/20261005131543/…/original-content-rewards](https://web.archive.org/web/20261005131543/https://help.x.com/en/using-x/original-content-rewards) — Account and Content Requirements | 计划专属规则 | 2026-10-05 |
| B | 持续资格："**Do not use automated tools, bots, or any tool or software to artificially generate likes, follows, views, comments, or shares.**" | 同上 — Continuous Eligibility | 计划专属规则 | 2026-10-05 |
| C | CMS Conduct Standards："**Do not use X features that enable payments …**"、"Platform manipulation and spam" 引用 | [web.archive.org/web/20261015044557/…/content-monetization-standards](https://web.archive.org/web/20261015044557/https://help.x.com/en/rules-and-policies/content-monetization-standards) | 通用变现标准 | 2026-10-15 |
| D | X 官方 Automation rules 对「自动化」的定义（**专指行为，不指内容**）："Automation on X refers to accounts or apps that take repeated actions without a person actively performing them."；禁止 "post duplicative or substantially similar posts on one account or over multiple accounts you operate"、"duplicate accounts" | [web.archive.org/web/20261012153529/…/x-automation](https://web.archive.org/web/20261012153529/https://help.x.com/en/rules-and-policies/x-automation)（页内标 "Updated April 2026"） | 平台行为规则 | 2026-10-12 快照 |
| E | 官方对「重复/模板化/低质批量」的判定，散落在三处：OCR 页 "Minimally modified content"（改词、加滤镜、调速、加文字叠加）、"Aggregated content"（拼合他人内容无新增视角）、"Cross-platform reposts"；CMS 引用 platform manipulation and spam policy；Automation rules 禁 "duplicative or substantially similar posts" | 同 A、D | — | — |

### 2.2 证据表

| 结论 | 确切表述 | 来源 URL | 日期 | 强度 | 置信度 |
|---|---|---|---|---|---|
| 「automated」在 OCR 计划里是**内容属性**判定，且明确同时覆盖「用自动化手段创作」与「用自动化手段发布」两种情形 | "Was created **or posted** using automated means" | 同 2.1-A | 2026-10-05 | 官方一手 | **高**（文本事实） |
| 官方**没有**为「AI 辅助 + 人类审校」提供任何豁免条款 | OCR 页、CMS 页、OCR 条款全文检索，无 "AI-assisted"、无 "human review"、无豁免表述 | 同 2.1-A/C + [legal.x.com/original-content-rewards-terms](https://legal.x.com/original-content-rewards-terms) | 2026-10-27 复核 | 官方一手（消极证据） | **中高** |
| 官方对「自动化」唯一的**正面**定义出现在 Automation rules，指向**行为**而非内容 | "take repeated actions without a person actively performing them" | 同 2.1-D | 2026-10-12 | 官方一手 | **高** |
| 因此存在两套并行、层级不同的「自动化」标准：Automation rules 管行为是否违规，OCR Account and Content Requirements 管内容是否计酬 | — | — | — | 官方一手 | **高**（结构事实） |
| 用 agent 起草 + 人工审校后**发布**，在 Automation rules 下不必然违规（前提：不批量重复、无误导链接、不刷量）；但在 OCR 的 "created or posted using automated means" 下处于**灰区**——官方未给出判定细则 | 上述两条原文的合并推论 | — | — | 推论 | **低**（X 未表态） |
| 「重复模板化内容 / 低质批量内容」的官方判定是**列举式**的，不是阈值式 | "Minimally modified content: … such as changing a word or two in a post, adding a filter, adjusting video speed, or placing a text overlay, that don't meaningfully transform the original." / "Aggregated content: Posts, videos, or images that primarily compile or combine content from other creators or sources without adding substantial new perspective or framing." | 同 2.1-A | 2026-10-05 | 官方一手 | **高** |
| 唯一有量化含义的自动化反滥用条款是「不得用工具伪造 likes/follows/views/comments/shares」 | 同 2.1-B | 2026-10-05 | 官方一手 | **高** |
| 二手解读：AI 作为「生产层」在人类作者之下可通过，AI 作为「作者」不可通过 | "A workflow fails when the software is the author… A workflow passes when AI is the production layer under your authorship." | [kompozy.io/guides/x-creator-monetization-originality-requirements](https://kompozy.io/guides/x-creator-monetization-originality-requirements) | 2026-08-13 | 论坛/博客二手 | **低**（无官方背书） |

### 2.3 2026-03-03 AI 武装冲突新规

| 结论 | 确切表述 | 来源 URL | 日期 | 强度 | 置信度 |
|---|---|---|---|---|---|
| 生效日期与处罚 | "effective March 3, 2026 users who post AI-generated videos of an armed conflict without adding a disclosure that it was made with AI will be suspended from the Original Content Rewards Program for 90 days. Subsequent violations will result in a permanent suspension of further payments. We may adjust our policy as the armed conflict situation evolves." | [web.archive.org/web/20261005131543/…](https://web.archive.org/web/20261005131543/https://help.x.com/en/using-x/original-content-rewards) — Suspension from Program | 2026-10-05 | 官方一手 | **高** |
| 同一条在老计划页也有一字不差的版本（措辞里的 "Creator Revenue Sharing" vs "Original Content Rewards Program" 随计划更名而替换） | 同句 | [web.archive.org/web/20260921205352/…/creator-revenue-sharing](https://web.archive.org/web/20260921205352/https://help.x.com/en/using-x/creator-revenue-sharing) | 2026-09-21 | 官方一手 | **高** |
| **适用范围比「变现暂停」更窄也更宽**：只针对「AI 生成的、描绘武装冲突的**视频**」，且必须是「未添加 AI 披露」 | 原文同上 | 同上 | 官方一手 | **高** |
| CMS 层面的对应条款（Conduct Standards）比计划页多一项：游戏画面也要标 | "For any AI generated content depicting armed conflict, you must add a clear disclosure that it is AI generated. Additionally, you must also label realistic video game depictions of armed conflict as a synthetic video. You may not attempt to mislead people about the origin of any depictions of armed conflict…" | [web.archive.org/web/20261015044557/…](https://web.archive.org/web/20261015044557/https://help.x.com/en/rules-and-policies/content-monetization-standards) | 2026-10-15 | 官方一手 | **高** |
| 该条款自 2026-03-03 起未变（8 月版与 10 月版 CMS 文本一致） | 同句在 [web.archive.org/web/20260824022134/…](https://web.archive.org/web/20260824022134/https://help.x.com/en/rules-and-policies/content-monetization-standards) 中逐字相同 | — | 2026-08-24 / 2026-10-15 | 官方一手 | **高** |
| 宣布人是 X 产品负责人 Nikita Bier，处罚机制包含「Community Note 指认 AI 生成」与「生成式 AI 工具的技术信号（元数据）」 | "X will penalise posts that receive a Community Note identifying the media as AI-generated, as well as posts containing metadata or other technical signals sourced from generative AI tools." | [medianama.com/2026/03/223-x-suspend-users-sharing-unlabelled-ai-videos-armed-conflict-revenue-sharing-programme/](https://www.medianama.com/2026/03/223-x-suspend-users-sharing-unlabelled-ai-videos-armed-conflict-revenue-sharing-programme/) | 2026-03-05 | 媒体二手 | **中高** |
| 宣布原文 | "Today we are revising our Creator Revenue Sharing policies to maintain authenticity of content on Timeline and prevent manipulation of the program." | [x.com/nikitabier/status/2028873177028555201](https://x.com/nikitabier/status/2028873177028555201) | 2026-03-03 | 官方一手（社媒） | **中高** |

---

## 3. 「已验证的主页时间线曝光」怎么算

### 3.1 官方原文

| 结论 | 确切表述 | 来源 URL | 日期 | 强度 | 置信度 |
|---|---|---|---|---|---|
| **合格曝光（qualified impressions）的官方定义** | "Qualified impressions are unique impressions from Premium users (subscribers to X Premium Basic, Premium, Premium+, or Premium Business) on the Home Timeline feed, where at least 50% of the post is visible." | [web.archive.org/web/20261005131543/…](https://web.archive.org/web/20261005131543/https://help.x.com/en/using-x/original-content-rewards) | 2026-10-05 | 官方一手 | **高** |
| 合格曝光的排除项 | "Impressions from the same account counted more than once per post / Paid, promoted, or artificially generated impressions / Fraudulent impressions" | 同上 | 2026-10-05 | 官方一手 | **高** |
| **准入门槛用的曝光**（与计酬用的不是同一个口径） | "Have at least 500,000 Home Timeline impressions from verified users in the last 90 days (impressions on replies are excluded)" | 同上 — Eligibility Requirements | 2026-10-05 | 官方一手 | **高** |
| 500 验证粉丝门槛 | "Have at least 500 verified followers." | 同上 | 2026-10-05 | 官方一手 | **高** |
| 打款最低额与周期 | "Payouts are currently processed every two weeks and the minimum payout is $30." | 同上 — Payouts | 2026-10-05 | 官方一手 | **高** |
| 计酬基数在条款层是「Premium 用户的曝光」 | "The payment is based on impressions from Premium users with your content on X. We reserve the right at any time to modify how our payment calculation is structured…" | [legal.x.com/original-content-rewards-terms](https://legal.x.com/original-content-rewards-terms) §5 | Effective 2026-08-07 | 官方一手 | **高** |
| 官方**从未公布任何费率、公式或池子规模** | OCR 帮助页与条款页均无费率数字 | 同上两处 | 2026-10-27 复核 | 官方一手（消极证据） | **高** |

### 3.2 公开 viewCount 与「主页时间线曝光」的关系

| 结论 | 确切表述 | 来源 URL | 日期 | 强度 | 置信度 |
|---|---|---|---|---|---|
| **公开 viewCount ≠ 主页时间线曝光**。viewCount 是「帖子在屏幕上出现的次数」，包含主页时间线、搜索结果、个人主页、帖子详情页，且重复浏览重复计数，自己看自己的帖也算 | "An impression is recorded each time a post appears on a user's screen: in the Home timeline, in search results, on a profile, or on the post's detail page." | [postzen.dev/blog/x-impressions-vs-views](https://www.postzen.dev/blog/x-impressions-vs-views) | 2026-09-10 | 媒体二手（引 X 文档） | **中高** |
| 官方 API 层：帖子**只有** `public_metrics.impression_count`，没有独立的 `view_count` 字段；视频才有 `view_count` | Post metrics 表：Impressions → Public → `public_metrics.impression_count`；Media metrics (videos) → Views → `public_metrics.view_count` | [docs.x.com/x-api/fundamentals/metrics](https://docs.x.com/x-api/fundamentals/metrics)（同源 raw 文件 [xdevplatform/docs metrics.mdx](https://raw.githubusercontent.com/xdevplatform/docs/main/x-api/fundamentals/metrics.mdx)） | 抓取于 2026-10-27 | 官方一手 | **高** |
| 官方 API 文档定义：曝光 "Not unique—the same user viewing twice counts as two impressions." | Metrics → Impressions accordion | 同上 | 官方一手 | **高** |
| 官方 API 文档定义：视频曝光 = "Aggregated across all posts containing the video. A video reposted in multiple posts has one total view count." | 同上 | 官方一手 | **高** |
| **主页时间线曝光是 X 内部计酬口径，API 不提供** | API 只有 Public / Non-public / Organic / Promoted 四组，无 Home Timeline 维度字段 | [docs.x.com/x-api/fundamentals/metrics](https://docs.x.com/x-api/fundamentals/metrics) | 官方一手（消极证据） | **高** |
| **第三方工具读不到该数字** | 同上 + 创作者实测："the analytics still did not separate Home Timeline impressions from Replies" | [ai-primer.com/creative/stories/x-original-content-rewards-access-tracker](https://www.ai-primer.com/creative/stories/x-original-content-rewards-access-tracker)（引 [x.com/GlennHasABeard/status/2086418726237163550](https://x.com/GlennHasABeard/status/2086418726237163550)） | 2026-08-09 | 媒体二手（引一手截图） | **高** |
| 唯一可读该数字的地方是 Creator Studio 的资格追踪器 | "You can check your eligibility status at any time by going to Creator Studio → Original Content Rewards." | [web.archive.org/web/20261005131543/…](https://web.archive.org/web/20261005131543/https://help.x.com/en/using-x/original-content-rewards) | 2026-10-05 | 官方一手 | **高** |

### 3.3 主帖 vs 回复

| 结论 | 确切表述 | 来源 URL | 日期 | 强度 | 置信度 |
|---|---|---|---|---|---|
| 回复的曝光**不计入** 90 天 50 万门槛 | "500,000 Home Timeline impressions from verified users in the last 90 days (**impressions on replies are excluded**)" | [web.archive.org/web/20261005131543/…](https://web.archive.org/web/20261005131543/https://help.x.com/en/using-x/original-content-rewards) | 2026-10-05 | 官方一手 | **高** |
| 回复曝光**同样不参与计酬** | 合格曝光定义限定为 "on the Home Timeline feed"；条款 §5 规定被 Boost 的曝光不计入；官方从未把回复纳入 qualified impressions | 同上 + [legal.x.com/original-content-rewards-terms](https://legal.x.com/original-content-rewards-terms) §5 | 2026-10-05 | 官方一手 | **高**（推断依据为定义本身，无逐字句） |
| 「回复带来的粉丝增长是算的」——**查不到官方依据** | 全文检索无此表述 | — | — | — | **低 / 查不到** |
| 佐证：回复曝光变化会实时改变门槛计数 | "a reply-heavy day rolling out of the 90-day window changed the count after the creator adjusted the model" | [ai-primer.com/…/x-original-content-rewards-access-tracker](https://www.ai-primer.com/creative/stories/x-original-content-rewards-access-tracker) | 2026-08-09 | 媒体二手 | **中高** |
| 佐证：回复曝光虽不计门槛，但回复内容仍需原创 | OCR 页把回复也纳入 content 判定范围；创作者反馈低质回复是旧计划套利主力 | 同上 | 2026-08-09 | 媒体二手 | **中** |

---

## 4. 门槛之外的现实收益量级

### 4.1 2026 年新计划（OCR）首期实测样本

| 创作者 | 曝光/播放 | 到账 | 来源 URL | 日期 | 强度 | 置信度 |
|---|---|---|---|---|---|---|
| techhalla | 79,300,000 total views / 3,500,000 verified views / 300,000 watch hours | **$240.12** | [x.com/techhalla/status/2103551807989367001](https://x.com/techhalla/status/2103551807989367001)，经 [ai-primer.com](https://www.ai-primer.com/creative/stories/x-original-content-rewards-payout-reports) 汇总 | 2026-09-25 | 一手截图（经媒体转述） | **中高** |
| techhalla 补充 | 旧计划同样内容约给 4 倍，尽管播放量少约 20 倍 | — | [x.com/techhalla/status/2103553283742691759](https://x.com/techhalla/status/2103553283742691759) | 2026-09-25 | 一手自述 | **中** |
| AIandDesign | — | **$261.73**（称比上一轮翻倍以上） | [x.com/AIandDesign/status/2103549096778952979](https://x.com/AIandDesign/status/2103549096778952979) | 2026-09-25 | 一手截图 | **中高** |
| awesome_visuals | — | **$70.39** | 同 ai-primer 汇总 | 2026-09-25 | 一手截图 | **中高** |
| teyan_dei（日文） | — | **$349.30** | [x.com/teyan_dei/status/2103753550446903600](https://x.com/teyan_dei/status/2103753550446903600) | 2026-09-26 | 一手截图 | **中高** |
| 日本媒体汇总 | — | **$32.73 – $959+**，约 **29 倍**差距 | [hashout.jp/sns/11454/](https://hashout.jp/sns/11454/) | 2026-09-27 | 媒体二手 | **中高** |
| LLMJunky | 曝光与互动都更高，但收入下降约 45% | 下降 | [x.com/LLMJunky/status/2103557674776342986](https://x.com/LLMJunky/status/2103557674776342986) / [2103628553707299137](https://x.com/LLMJunky/status/2103628553707299137) | 2026-09-25 | 一手自述 | **中** |
| 未达门槛者 | 90 天曝光仅 110K，未达 50 万 | 无付款 | [x.com/aitarimise/status/2103709398086643835](https://x.com/aitarimise/status/2103709398086643835) | 2026-09-26 | 一手截图 | **中高** |
| GlennHasABeard | 旧计划时期 | 约 **$200/月** | [x.com/GlennHasABeard/status/2086052769174081745](https://x.com/GlennHasABeard/status/2086052769174081745) | 2026-08 | 一手自述 | **中** |

**样本量说明**：可核查的 2026 年 OCR 新计划**逐笔付款样本仅 5–6 个**（techhalla / AIandDesign / awesome_visuals / teyan_dei + 日本媒体汇总的 32.73–959 区间）。全部为自述截图，非 X 官方统计。**不足以推断分布，只能说明量级与离散度。**

### 4.2 500K 曝光门槛对应的收入量级估算

由于 X 从不公布费率，只能做**区间锚定**，不能算精确值：

| 锚点 | 推导 | 依据 | 强度 |
|---|---|---|---|
| 门槛以下 = 0 | 90 天曝光 110K 未达门槛 → 无付款 | [x.com/aitarimise/status/2103709398086643835](https://x.com/aitarimise/status/2103709398086643835) | 一手 |
| 门槛附近的量级 | 500K 曝光/90 天 ≈ 5,556 曝光/天；按 techhalla 的 350 万 verified views → $240 的**非门槛样本**反推，单次合格曝光单价大致在 **$0.00007 量级** | 推算自 techhalla 一手数据；前提假设 techhalla 的曝光构成与门槛附近账号相似（**此假设很可能不成立**） | **低** |
| 可给出的区间 | **单期（双周）几十到几百美元量级；月度量级约 $100–$1,000**；首期实测最高 $959 | ai-primer 汇总 + hashout 汇总 | **中**（区间有 6 个样本支撑），**低**（外推到"500K 门槛"这一步） |
| 官方口径的净效应 | 门槛名义上从 5M 降到 500K，但计酬口径同时从「全部 organic impressions」收窄到「Premium 用户 + 主页时间线 + 50% 可见 + 每用户每帖一次 + 排除回复/付费/刷量」 | 官方帮助页 | **高**（口径事实） |
| 旧计划 2026 年前的量级参考（非新计划） | 2023-07 至今累计向 15 万+ 创作者支付 $45M+，人均累计约 **$300**；2025 单年支付 $61M（+205% YoY），2026 池子翻倍 | [socialday.live/features/x-doubled-its-creator-pool-for-2026…](https://socialday.live/features/x-doubled-its-creator-pool-for-2026-but-the-average-creator-has-earned-just-300-)（2026-07-28）；[sent2x.com/blog/x-creator-monetization-trends-2026](https://sent2x.com/blog/x-creator-monetization-trends-2026)（2026-08-15，引用 $142M by Q1 2026） | **中**（媒体二手，数字互相冲突见下） |
| 旧计划费率传闻 | "$8–12 per million views"，**属于已退役计划**，不适用于 OCR | [creaticalc.com/blog/how-much-does-x-pay-creators](https://creaticalc.com/blog/how-much-does-x-pay-creators) | **中** |

### 4.3 不靠平台分成的变现路径

| 路径 | 门槛 | 收益模型 | 来源 | 强度 |
|---|---|---|---|---|
| **Subscriptions** | 2000+ Premium 订阅粉丝 / 3 个月 500 万 organic impressions / 账号满 3 个月 / 近 30 天有发帖 / 完整资料 + 验证邮箱 + 2FA / 身份验证 / 18+ / Premium 订阅 | 网页端创作者留成 **80%**；iOS/Android 约 **68%**（应用商店抽成）；最低打款 **$50**；月结后约 **60 天**付款 | [legal.x.com/subscriptions-creator-terms](https://legal.x.com/subscriptions-creator-terms)（Effective 2025-08-01）；[help.x.com/en/rules-and-policies/subscriptions-policy](https://help.x.com/en/rules-and-policies/subscriptions-policy)（2026-08-13 存档）；[sent2x.com](https://sent2x.com/blog/x-creator-monetization-trends-2026) | 官方一手（门槛/分成）/ 媒体二手（68%） |
| Subscriptions 的**地区口径** | 条款只写 Prohibited Person 名单（古巴、伊朗、乌克兰克里米亚、朝鲜、叙利亚），**未列支持国家名单**；但实际打款依赖 Payment Processor | 同上 | 官方一手 | **高** |
| **Ticketed Spaces** | 1000 粉丝 | 门票收入创作者留成 80% | [sent2x.com/blog/x-creator-monetization-trends-2026](https://sent2x.com/blog/x-creator-monetization-trends-2026) | 媒体二手 |
| **品牌合作 / 赞助** | 无平台门槛 | 主流做法；实测创作者称"大部分创作者收入来自品牌合作" | [ai-primer.com/…/access-tracker](https://www.ai-primer.com/creative/stories/x-original-content-rewards-access-tracker) 引 [x.com/GlennHasABeard/status/2085875378682306632](https://x.com/GlennHasABeard/status/2085875378682306632) | 媒体二手引一手 |
| **平台外私域变现** | 无平台门槛 | 转化率参考：免费粉丝→付费订阅 0.5%–2%（高互动垂直 2%–5%）；订阅者平均生命周期 4–7 个月 | [socialday.live](https://socialday.live/features/x-doubled-its-creator-pool-for-2026-but-the-average-creator-has-earned-just-300-/) | 媒体二手 |
| **X 官方 Video Kickstart Bonus**（2026-10 新增，非分成） | 邀请制；15 个原创竖版视频、30 天内 15 个不同日、每条 <3 分钟、须自制 | 邀约金额 $500 / $1,500 / $3,000 / $5,000 不等；**含快速通道进 OCR**；报名 2026-10-30 截止 | [ai-primer.com/creative/stories/x-original-video-bonuses](https://www.ai-primer.com/creative/stories/x-original-video-bonuses)（2026-10-15）；[twiscan.com/en/x/allegrajacchia](https://twiscan.com/en/x/allegrajacchia)；[storyboard18.com](https://www.storyboard18.com/digital/x-launches-invite-only-video-kickstart-bonus-for-creators-posting-original-vertical-videos-112717.htm) | 媒体二手引一手截图 |
| **Threads 不产生直接收益** | — | "Threads: still pays creators nothing directly" | [blog.evolvedlotus.com/blog/2026-10-02-x-killed-revenue-sharing-original-content-rewards-actually-pays/](https://blog.evolvedlotus.com/blog/2026-10-02-x-killed-revenue-sharing-original-content-rewards-actually-pays/) | 媒体二手 |

---

## 5. 中国大陆用户在此计划下的可行性结论

### 结论：**不可参与**（当前规则下）

依据链（三段均为一手官方）：

1. **资格门槛**：X 官方要求创作者 **"Be based in a country where the Original Content Rewards Program is available"** / CMS 要求 **"You must reside in a country in which X's monetization programs are available"**。中国大陆**不在**该名单（119 国名单见 1.1，2026-08-08 首版与 2026-10-05 最新版均不含）。
   - 来源：[web.archive.org/web/20261005131543/…/original-content-rewards](https://web.archive.org/web/20261005131543/https://help.x.com/en/using-x/original-content-rewards)、[web.archive.org/web/20261015044557/…/content-monetization-standards](https://web.archive.org/web/20261015044557/https://help.x.com/en/rules-and-policies/content-monetization-standards)
   - 置信度：**高**

2. **不是"能申请但打不了款"，而是连申请资格都没有**：门槛表述是居住地（reside / be based in），不是收款账户所在地。官方全无"人在支持国家、收款账户可在第三地"的豁免条款。CMS 的 "You must connect an X Money account or verified Stripe account" 是**在满足居住地门槛之后**的收款步骤，不是替代条件。
   - 置信度：**高**（基于文本与结构）

3. **打款通道对中国人关闭**：
   - 美国专属的 X Money 按 SSN 唯一确定，中国人无法开通；
   - 非美国走 Stripe，但 **Stripe 在中国大陆不提供服务**（stripe.com/en-cn 页脚明文），且 Stripe Connect **不支持自助跨境付款至 US/UK/EEA/CA/CH 以外地区**（Stripe 官方文档原文），Stripe Connect 的 KYC 逐国要求文档**无中国章节**；
   - Stripe 2026-04-22 新增的中国收款能力属于 **Global Payouts**（平台→第三方收款人，平台须在美/英、发起方须持牌），与 X 使用的「创作者→外部银行账户」资金流**不是同一产品**，不能推出 X 能用。
   - 来源：[stripe.com/en-cn/global](https://stripe.com/en-cn/global)、[docs.stripe.com/connect/cross-border-payouts](https://docs.stripe.com/connect/cross-border-payouts)、[docs.stripe.com/global-payouts](https://docs.stripe.com/global-payouts)、[docs.stripe.com/global-payouts/recipient-requirements](https://docs.stripe.com/global-payouts/recipient-requirements)
   - 置信度：**中高**（Stripe 各条均为官方一手；「X 用的是哪条 Connect 流程」未公开，属推论）

### 关于「合规路径」的三点明确

| 路径 | 是否可行 | 依据 |
|---|---|---|
| 用香港/新加坡 Stripe 账户收款，人在中国 | **与门槛直接冲突**。官方要求人 reside/be based in 支持国家；且 Stripe 要求提供 representative 的真实身份与住址证明（[docs.stripe.com/connect/required-verification-information](https://docs.stripe.com/connect/required-verification-information)），X 条款也要求向 Payment Processor 提供 **"proof of identity and/or residence"**。 | 官方一手；**置信度中高** |
| 用虚假居住地/身份注册 | **明确违约**。X 条款 §5 写明 "If X or the Payment Processor determines … that payments cannot be made to you for any reason, you cannot be part of the Program"；§4 要求遵守 applicable laws，X 可因违规终止并追回。 | 官方一手；**置信度高** |
| 人真的在支持国家（如香港/新加坡）且材料真实 | **可参与**——但这已不是"中国大陆用户"的情形 | 官方一手；**置信度高** |

> **必须声明**：X **官方从未明文禁止**「在支持地区开收款账户」这一行为本身。禁止的来源是**居住地门槛**和**支付通道的 KYC 真实性要求**，二者共同导致虚假路径不可行。把"用境外账户收款 = 违反 X 条款"写成官方原话，是没有出处的。

### 一句话结论

**中国大陆居民在 Original Content Rewards（以及其前身 Creator Revenue Sharing、乃至 Subscriptions 的打款环节）下当前为「不可参与」；不存在官方认可的合规绕行路径；任何绕行都要靠虚假居住地/身份信息，同时触犯 X 条款与 Stripe KYC 规则。**

---

## 6. 查不到 / 来源冲突（不做推测填空）

### 6.1 查不到

| # | 缺口 | 状态 |
|---|---|---|
| 1 | **「AI 辅助 + 人类审校」是否算 automated** | 官方**零**表述。OCR 页只给 "Was created or posted using automated means"，无定义、无豁免、无案例。只能由二手解读（kompozy.io）推断，标为推论 |
| 2 | **回复带来的粉丝增长是否计入门槛** | 官方无任何表述。门槛只写 "impressions on replies are excluded"，粉丝口径未提 |
| 3 | **OCR 的费率/公式/池子规模** | 官方从未公布，且条款明文保留随时修改计算结构的权利 |
| 4 | **X 是否公开了 Creator Studio 追踪器的 API/第三方接口** | 官方文档无；实测显示 Home Timeline 与 Replies 至今未拆分 |
| 5 | **X 使用的是 Stripe Connect 的哪条具体产品线**（recipient service agreement / cross-border payouts / Global Payouts） | 未公开。仅能从「美国转 X Money、非美国走 Stripe」推断非美国走 Connect 类产品 |
| 6 | **Stripe 是否存在面向中国大陆居民的 Connect 账户注册通道**（如经香港实体） | 未在 Stripe 官方文档中查到明确表述；KYC 文档无中国章节，但这是消极证据 |
| 7 | **「人在支持国家但收款账户在第三地」是否存在未公开的内部规则** | 官方公开文档零命中 |
| 8 | **2026-10-27 当天 OCR 帮助页的现行版本** | `help.x.com` 对本核查环境全站返回 403；Wayback 在核查末段临时离线。最新可得存档为 2026-10-05 |
| 9 | **OCR 帮助页与 CMS 页在 10 月中旬的订阅档位表述以哪版为准** | 见 0 节时序矛盾 |
| 10 | **2026 年 OCR 新计划的官方创作者收益分布**（只有 5–6 个自述样本） | 无官方统计，媒体数字互相冲突 |
| 11 | **Sources of the $142M / $61M / $45M 三个总量数字的原始出处** | 三家媒体各引一个数字，互相矛盾（见 6.2） |
| 12 | **官方是否对 "AI 辅助但有实质人类贡献" 给出过任何形式的指引**（如博客、帮助中心 FAQ、@Premium 账号） | 未找到 |

### 6.2 来源冲突

| 冲突项 | A 说法 | B 说法 | 判定 |
|---|---|---|---|
| 累计创作者付款 | **$45M+**（2023-07 至今，15 万+ 创作者），socialday / nixus | **$142M by Q1 2026**，sent2x 引 amraandelma | 数字相差 3 倍，均为二手；**都不采用**。同理 $61M（2025 单年，+205%）只有 sent2x 一家 |
| 人均 | ~$300/人（累计） | — | 与 $142M 口径不自洽，**不采用** |
| 门槛曝光口径 | 5M "organic impressions"（CRS） | 500K "verified Home Timeline impressions" | 两者分母不同（是否 verified、是否限 Home Timeline、是否排除回复），**数字不可直接比较**；官方页面并未声称"门槛降低 10 倍"，是媒体口径 |
| Subscriptions 曝光门槛 | **5,000,000** organic impressions / 3 个月（CMS 与 Subscriptions policy 一致） | 部分二手文写 "no impression threshold"（sent2x） | **官方为准**：CMS 与 Subscriptions policy 2026-08-13 均明确要求 5M。sent2x 表述错误 |
| Stripe 能否在大陆收款 | Stripe 2026-04-22 changelog 明确"支持向日本和中国打款" | 但同属 Global Payouts（平台→收款人），且 Global Payouts 收款人清单**无中国**；Connect 自助跨境付款不支持中国 | 两者**不矛盾**，是**不同产品**。引用时必须带产品限定，否则会误导 |
| 首期付款日期 | AI Primer / evolvelotus：2026-09-25 | Adgully（转 X 公告）：2026-08-28 | 8/28 是 CRS 常规付款日兼部分媒体所称 OCR 首次；9/25 是实际出现"You got paid!"通知的日期。以**实际到账截图（9/25–9/26）**为准 |
| 2026-10-15 CMS 改版性质 | 主要是模板改版（品牌名 `>x<` 替换） | 实质新增：X Subscription 档位 + "You must connect an X Money account or verified Stripe account" | 逐行 diff 显示**实质新增 2 条**，其余为品牌名替换噪音。**采信实质新增** |
| 「Premium Basic 计入 qualified impressions」 | evolvelotus 称 10 月版新增 Premium Basic | 8/8 版与 10/5 版 qualified impressions 定义**均**已含 "Premium Basic" | **evolvelotus 的"10月新增"表述与存档不符**，以官方快照为准：8/8 版已含 Basic |

### 6.3 存档层面的注意事项（影响可复核性）

- `help.x.com` 全站对自动化请求返回 **403 Cloudflare 拦截**（`web_fetch`、curl + 浏览器 UA、`r.jina.ai` 代理均被拦）。本报告全部 `help.x.com` 证据来自 **Wayback Machine 存档快照**，URL 已逐条列出，第三方可用相同 URL 复核。
- `legal.x.com/original-content-rewards-terms` 与 `legal.x.com/subscriptions-creator-terms` **可直接访问**（HTTP 200），无需存档，已在 2026-10-27 复核在线。
- `docs.x.com` 与 `stripe.com` / `docs.stripe.com` 可直接访问，已直接抓取。
- Wayback 在核查末段出现 "Internet Archive services are temporarily offline"，10-15 之后的快照未能取得。

---

## 附：核查过程的可复核清单

| 断言 | 复核方式 |
|---|---|
| 国家名单 119 国、无中国大陆 | 打开 1.1 的 Wayback URL → 搜 "Country availability" → 逐行数 |
| 名单从 114 → 119 | 分别打开 20260808035902 与 20261005131543 两个快照，diff 国家段落 |
| 申诉等待期 90 → 42 天 | 同上两快照 diff "reapply after" |
| 美国转 X Money | 打开 20261005131543 快照搜 "For U.S. users" |
| 2026-03-03 AI 武装冲突条款 | 打开 20261005131543 快照搜 "March 3, 2026" |
| Stripe 不支持自助跨境付款至中国 | 打开 docs.stripe.com/connect/cross-border-payouts 搜 "doesn't support self-serve" |
| Stripe 大陆不提供服务 | 打开 stripe.com/en-cn/global 滚到页脚 |
| Subscriptions 门槛 | 打开 legal.x.com/subscriptions-creator-terms 搜 "Minimum Payment Threshold"、"2,000 or more"、"5,000,000" |
| X 订阅新档位 | 打开 x.ai/news/x-subscription 看价目表 |
