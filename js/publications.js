// Render publications list from /assets/data/publications.json
(function () {
  const container = document.getElementById("pubs-list");
  if (!container) return;

  fetch("/assets/data/publications.json")
    .then((r) => r.json())
    .then((pubs) => {
      pubs.sort((a, b) => b.year - a.year);

      // Group by year
      const byYear = {};
      pubs.forEach((p) => {
        (byYear[p.year] = byYear[p.year] || []).push(p);
      });

      const years = Object.keys(byYear).sort((a, b) => b - a);

      container.innerHTML = years
        .map((year) => {
          const items = byYear[year].map((p) => renderPub(p)).join("");
          return `
          <section class="mb-14">
            <h2 class="font-serif text-2xl font-medium mb-4 tracking-tight">${year}</h2>
            <div>${items}</div>
          </section>
        `;
        })
        .join("");
    })
    .catch((err) => {
      container.innerHTML = `<p class="font-sans text-muted dark:text-muted-dark italic">Could not load publications.</p>`;
      console.error(err);
    });

  function renderPub(p) {
    const authors = p.authors
      .map((a) =>
        a === "Sourav Majumder"
          ? `<strong class="text-ink dark:text-ink-dark">${a}</strong>`
          : a,
      )
      .join(", ");

    const links = [];
    if (p.pdf_url)
      links.push(
        `<a href="${p.pdf_url}" target="_blank" rel="noopener" class="btn-ghost">PDF</a>`,
      );
    if (p.doi_url)
      links.push(
        `<a href="${p.doi_url}" target="_blank" rel="noopener" class="btn-ghost">DOI</a>`,
      );
    links.push(
      `<button class="btn-ghost" data-bibtex='${escapeAttr(p.bibtex)}'>BibTeX</button>`,
    );

    const tags = (p.tags || [])
      .map((t) => `<span class="tag">${t}</span>`)
      .join(" ");

    return `
      <article class="pub-entry">
        <h3 class="pub-title font-serif text-lg sm:text-xl font-medium leading-snug mb-2">
          <a href="${p.pdf_url || p.doi_url || "#"}" target="_blank" rel="noopener">${p.title}</a>
        </h3>
        <p class="font-sans text-sm text-muted dark:text-muted-dark mb-1">${authors}</p>
        <p class="font-serif italic text-sm text-muted dark:text-muted-dark mb-3">
          ${p.venue}${p.location ? `, ${p.location}` : ""}
        </p>
        ${p.abstract ? `<details class="mb-3"><summary class="font-sans text-xs uppercase tracking-wider text-muted dark:text-muted-dark cursor-pointer hover:text-accent dark:hover:text-accent-dark transition-colors">Abstract</summary><p class="font-serif text-[0.95rem] leading-relaxed mt-3 text-ink/90 dark:text-ink-dark/90">${p.abstract}</p></details>` : ""}
        <div class="flex flex-wrap gap-x-4 gap-y-2 items-center mt-3">
          <div class="flex gap-4">${links.join("")}</div>
          ${tags ? `<div class="flex gap-2 flex-wrap ml-auto">${tags}</div>` : ""}
        </div>
      </article>
    `;
  }

  function escapeAttr(s) {
    return String(s).replace(/'/g, "&#39;").replace(/"/g, "&quot;");
  }
})();
