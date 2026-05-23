// KaTeX auto-render — runs when both KaTeX and renderMathInElement are loaded
(function () {
  function render() {
    if (typeof renderMathInElement !== 'function') return false;
    const targets = document.querySelectorAll('.prose-content, [data-math]');
    targets.forEach((el) => {
      renderMathInElement(el, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '\\[', right: '\\]', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\(', right: '\\)', display: false },
        ],
        throwOnError: false,
      });
    });
    return true;
  }
  if (!render()) {
    // Wait until KaTeX auto-render script finishes loading
    document.addEventListener('DOMContentLoaded', render);
    window.addEventListener('load', render);
  }
})();
