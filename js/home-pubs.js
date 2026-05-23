// Render top 3 most recent publications on home page
(function () {
  const container = document.getElementById('home-pubs');
  if (!container) return;

  fetch('/assets/data/publications.json')
    .then((r) => r.json())
    .then((pubs) => {
      pubs.sort((a, b) => b.year - a.year);
      const top = pubs.slice(0, 3);
      container.innerHTML = top.map((p) => {
        const authors = p.authors.map((a) =>
          a === 'Sourav Majumder' ? `<strong>${a}</strong>` : a
        ).join(', ');
        return `
          <article class="border-t border-line dark:border-line-dark pt-5 first:border-t-0 first:pt-0">
            <h3 class="font-serif text-base sm:text-lg font-medium leading-snug mb-1">
              <a href="${p.pdf_url || p.doi_url || '#'}" target="_blank" rel="noopener" class="hover:text-accent dark:hover:text-accent-dark transition-colors">${p.title}</a>
            </h3>
            <p class="font-sans text-xs text-muted dark:text-muted-dark mb-0.5">${authors}</p>
            <p class="font-serif italic text-xs text-muted dark:text-muted-dark">${p.venue_short || p.venue}</p>
          </article>
        `;
      }).join('');
    })
    .catch(() => { container.innerHTML = ''; });
})();
