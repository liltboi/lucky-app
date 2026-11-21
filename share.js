/* 今日好运研究所 · 分享截图卡模块 (依赖 html2canvas + qrcodejs, MIT) */
(function () {
  var SITE = "https://liltboi.github.io/lucky-app/";
  var css = document.createElement("style");
  css.textContent = [
    ".sc-modal{position:fixed;inset:0;z-index:999;background:rgba(61,46,70,.55);display:flex;align-items:center;justify-content:center;padding:16px}",
    ".sc-wrap{background:#fff;border-radius:24px;padding:14px;max-width:360px;width:100%;max-height:92vh;overflow:auto;box-shadow:0 20px 60px rgba(0,0,0,.25)}",
    ".sc-card{background:linear-gradient(165deg,#fff9f5 0%,#ffeff5 45%,#f3ecff 100%);border-radius:18px;padding:26px 20px 18px;color:#4a3b52;position:relative;overflow:hidden}",
    ".sc-card .sc-deco{position:absolute;top:14px;right:16px;font-size:34px;opacity:.55}",
    ".sc-card .sc-deco2{position:absolute;bottom:70px;left:12px;font-size:22px;opacity:.35}",
    ".sc-brand{font-size:10px;letter-spacing:3px;color:#b8a3c9;text-align:center;margin-bottom:6px}",
    ".sc-title{font-size:22px;font-weight:800;color:#3d2e46;text-align:center;letter-spacing:2px}",
    ".sc-date{text-align:center;font-size:11px;color:#9a7d96;margin:4px 0 14px}",
    ".sc-body{font-size:13px;line-height:1.9;color:#6b5570;background:rgba(255,255,255,.72);border-radius:14px;padding:14px 12px}",
    ".sc-body b{color:#d4548f}",
    ".sc-foot{display:flex;align-items:flex-end;justify-content:space-between;margin-top:14px}",
    ".sc-cta{font-size:10.5px;color:#9a7d96;line-height:1.6;max-width:150px}",
    ".sc-cta b{color:#d4548f;font-size:12px}",
    ".sc-qr{background:#fff;border-radius:10px;padding:5px;box-shadow:0 4px 12px rgba(220,150,190,.3)}",
    ".sc-qr img,.sc-qr canvas{display:block}",
    ".sc-acts{display:flex;gap:8px;margin-top:12px}",
    ".sc-acts button{flex:1;padding:11px;border:none;border-radius:999px;font-size:13px;font-weight:700;cursor:pointer}",
    ".sc-save{background:linear-gradient(120deg,#ffb6d9,#c9a7ff);color:#fff}",
    ".sc-copy{background:#fff0f6;color:#d4548f}",
    ".sc-close{width:100%;margin-top:6px;background:none;border:none;color:#b8a3c9;font-size:12px;padding:8px;cursor:pointer}",
    ".sc-note{text-align:center;font-size:10px;color:#b8a3c9;margin-top:6px}"
  ].join("");
  document.head.appendChild(css);

  window.openShareCard = function (opt) {
    // 关闭旧弹层
    var old = document.querySelector(".sc-modal");
    if (old) old.remove();

    var modal = document.createElement("div");
    modal.className = "sc-modal";
    var shareUrl = opt.url || SITE;
    var html = [
      '<div class="sc-wrap">',
      '  <div class="sc-card" id="sc-card">',
      '    <span class="sc-deco">' + (opt.deco || "✨") + "</span>",
      '    <span class="sc-deco2">' + (opt.deco2 || "🌙") + "</span>",
      '    <div class="sc-brand">今日好运研究所</div>',
      '    <div class="sc-title">' + opt.title + "</div>",
      '    <div class="sc-date">' + opt.date + "</div>",
      '    <div class="sc-body">' + opt.body + "</div>",
      '    <div class="sc-foot">',
      '      <div class="sc-cta"><b>' + (opt.cta || "扫码测测你的") + "</b><br>" + (opt.tagline || "每日好运 · 仅供娱乐") + "</div>",
      '      <div class="sc-qr" id="sc-qr"></div>',
      "    </div>",
      "  </div>",
      '  <div class="sc-acts">',
      '    <button class="sc-save" id="sc-save">📸 保存截图</button>',
      '    <button class="sc-copy" id="sc-copy">📝 复制文案</button>',
      "  </div>",
      '  <button class="sc-close" id="sc-close">关闭</button>',
      '  <div class="sc-note">截图保存后即可发给朋友或发小红书</div>',
      "</div>"
    ].join("");
    modal.innerHTML = html;
    document.body.appendChild(modal);

    new QRCode(document.getElementById("sc-qr"), { text: shareUrl, width: 66, height: 66, colorDark: "#6b5570", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.M });

    var shareText = opt.text || (opt.title + "｜" + opt.date + "\n来自「今日好运研究所」，仅供娱乐 ✨");
    document.getElementById("sc-copy").onclick = function () {
      try { navigator.clipboard.writeText(shareText); } catch (e) {}
      this.textContent = "✅ 已复制";
      var b = this; setTimeout(function(){ b.textContent = "📝 复制文案"; }, 1600);
    };
    document.getElementById("sc-save").onclick = function () {
      var btn = this;
      btn.textContent = "⏳ 生成中…"; btn.disabled = true;
      html2canvas(document.getElementById("sc-card"), { scale: 2, useCORS: true, backgroundColor: null }).then(function (canvas) {
        var data = canvas.toDataURL("image/png");
        if (navigator.canShare && navigator.canShare({ files: [new File([new Blob()], "a.png", { type: "image/png" })] })) {
          canvas.toBlob(function (blob) {
            navigator.share({ files: [new File([blob], "lucky.png", { type: "image/png" })], title: opt.title }).catch(function(){ download(data); });
          });
        } else { download(data); }
        btn.textContent = "📸 保存截图"; btn.disabled = false;
        function download(d) {
          var a = document.createElement("a");
          a.href = d; a.download = "lucky-" + opt.title.replace(/[<>《》「」｜| /]/g, "") + ".png"; a.click();
        }
      }).catch(function(){ btn.textContent = "📸 保存截图"; btn.disabled = false; });
    };
    modal.addEventListener("click", function (e) { if (e.target === modal) modal.remove(); });
    document.getElementById("sc-close").onclick = function () { modal.remove(); };
  };
})();
