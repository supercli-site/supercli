// 首屏主题预载：在首次绘制前落定明暗主题，避免浅色闪一下再变深。
// 必须是同步脚本且位于 <head> 内 —— 放在外链文件里是为了不违反
// CSP script-src 'self'（内联脚本会被浏览器直接拦掉，见 scripts/csp.test.mjs）。
(function () {
  try {
    var saved = localStorage.getItem("supercli-theme");
    if (saved === "light" || saved === "dark")
      document.documentElement.dataset.theme = saved;
  } catch (error) {
    // 隐私模式下读不到 localStorage，交给 theme.ts 的系统偏好兜底。
  }
})();
