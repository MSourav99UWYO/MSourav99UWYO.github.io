// BibTeX copy + toast (with fallback for non-HTTPS / file:// contexts)
(function () {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }

  let toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
  }

  async function copyText(text) {
    // Modern path: requires HTTPS or localhost
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.warn("clipboard.writeText failed, falling back:", err);
      }
    }
    // Legacy fallback: works in file:// and over plain http
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch (err) {
      console.error("execCommand copy failed:", err);
      return false;
    }
  }

  document.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-bibtex]");
    if (!btn) return;
    e.preventDefault();
    const bibtex = btn.getAttribute("data-bibtex");
    const ok = await copyText(bibtex);
    showToast(ok ? "BibTeX copied to clipboard" : "Could not copy");
  });

  window.showToast = showToast;
})();
