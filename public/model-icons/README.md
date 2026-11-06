# Model and provider icons

28 unmodified SVGs vendored from **@lobehub/icons-static-svg 1.102.0** by [LobeHub](https://github.com/lobehub/lobe-icons), under the [MIT license](./LICENSE). Brand names and trademarks belong to their respective owners; their inclusion does not imply endorsement.

- [Official static SVG documentation](https://github.com/lobehub/lobe-icons/tree/master/packages/static-svg) documents npm/CDN distribution.
- Pinned npm archive: https://registry.npmjs.org/@lobehub/icons-static-svg/-/icons-static-svg-1.102.0.tgz
- Equivalent pinned CDN URL: `https://unpkg.com/@lobehub/icons-static-svg@1.102.0/icons/<slug>.svg`.
- Archive integrity: `sha512-3Na6S2kdslmsfnBjuL0PQWQClrmuWe/pWThRN/3J2VzPg5MhVghy8knVu7kd1/lqA9ydZBvwmnKLzuBo0Wm6Qw==`.
- License copied from upstream commit `989535d6c13da2dec5a2937fe2789d4af4fdd8e0`, recorded by this npm release.

Only the assets referenced by `src/model-icons.ts` are included. No runtime CDN or npm dependency is required. The mapping returns local URLs and null for unknown brands. Model matching is anchored to the family name, ignores casing, and rejects conflicting creators; null or blank creators allow a recognized family name. A provider match never acts as a blanket fallback for an unknown model.

Claude/Anthropic, Gemini/Google, Gemma/Google, Qwen/Alibaba, Grok/xAI and Muse/Meta use separate family and corporate assets. GLM uses the current Z AI mark. DeepSeek, Kimi, MiniMax, Mistral and LongCat share their own brand marks. Nemotron, Granite, Mercury, Solar and Trinity use the confirmed NVIDIA, IBM, Inception, Upstage and Arcee brand marks because no separate family asset exists in this release. Cohere Command A uses `commanda-color.svg`. The API creator `SpaceXAI` maps to xAI. MiMo and Ling have family icons; no corporate Xiaomi or InclusionAI asset is substituted.

Upstream explicitly identifies [Muse as Meta](https://github.com/lobehub/lobe-icons/blob/989535d6c13da2dec5a2937fe2789d4af4fdd8e0/src/Muse/index.mdx) and [Ling as Ant Ling](https://github.com/lobehub/lobe-icons/blob/989535d6c13da2dec5a2937fe2789d4af4fdd8e0/src/Ling/index.mdx).

## Rendering

Render icons inside a **white chip**, particularly on dark surfaces. Anthropic, OpenAI, Grok, xAI, Z AI, IBM, Inception and XiaomiMiMo are monochrome. Keep native brand colors and geometry; do not invert or recolor the SVGs.

## Coverage and verification

Checked against all 137 rows from the public AGENT / AGENTIC_INDEX ranking, pages 1 and 2, snapshot 2026-11-03: 119 model rows and 115 provider rows have an icon. All returned paths exist. Runtime assertions covered case variation, null/unknown inputs, conflicting creators, prototype-key names, and misleading base-model mentions such as Nex-N2-Pro (Based on Qwen), Quasar (Based on GLM) and HyperNova (Based on GPT). K2 Horizon does not map to Kimi.

Missing corporate icons: Institute of Foundation Models, Multiverse Computing, InclusionAI, Apodex, Motif Technologies, Nex AGI, Thinking Machines, Xiaomi, SK Telecom, OpenBMB, Celeris.

Unmapped families: K2 Horizon, Quasar, HyperNova, Apodex, Motif, Hy3, Nex-N2-Pro, Inkling, A.X-K2, Ring, MiniCPM, North Mini Code, Celeris. These deliberately return null; text/neutral initials may be rendered by the caller.

The npm archive SHA-512 integrity was verified before extraction. Every selected SVG was parsed and checked for scripts, event attributes, foreign objects, embedded images, animation, XML entities/DOCTYPE, external href/src and nonlocal CSS URL references. All SVG bytes remain identical to the pinned package.
