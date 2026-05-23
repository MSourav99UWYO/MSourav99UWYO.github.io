// Theme toggle (call after DOM ready)
(function () {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  const sunIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`;
  const moonIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

  function setIcon() {
    toggle.innerHTML = document.documentElement.classList.contains('dark') ? sunIcon : moonIcon;
    toggle.setAttribute('aria-label', document.documentElement.classList.contains('dark') ? 'Switch to light mode' : 'Switch to dark mode');
  }
  setIcon();

  // Enable smooth transitions only after first interaction
  toggle.addEventListener('click', () => {
    document.documentElement.classList.add('theme-transition');
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    setIcon();
  });
})();
