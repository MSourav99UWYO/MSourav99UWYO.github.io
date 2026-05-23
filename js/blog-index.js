// Loads blog posts.json and renders the index list
(function () {
  const list = document.getElementById("post-list");
  if (!list) return;

  fetch("/blog/posts.json")
    .then((r) => r.json())
    .then((posts) => {
      if (!Array.isArray(posts) || posts.length === 0) {
        list.innerHTML = `<p class="font-sans text-muted dark:text-muted-dark italic">No posts yet — check back soon.</p>`;
        return;
      }
      posts.sort((a, b) => (a.date < b.date ? 1 : -1));
      list.innerHTML = posts
        .map((p) => {
          const date = new Date(p.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          const tags = (p.tags || [])
            .map((t) => `<span class="tag">${t}</span>`)
            .join(" ");
          return `
          <article class="border-t border-line dark:border-line-dark py-7 first:border-t-0">
            <div class="font-sans text-xs uppercase tracking-wider text-muted dark:text-muted-dark mb-2">${date}</div>
            <h2 class="font-serif text-2xl font-medium leading-snug mb-2">
              <a href="/blog/posts/${p.slug}.html" class="hover:text-accent dark:hover:text-accent-dark transition-colors">${p.title}</a>
            </h2>
            ${p.excerpt ? `<p class="font-serif text-muted dark:text-muted-dark leading-relaxed mb-3">${p.excerpt}</p>` : ""}
            <div class="flex gap-2 flex-wrap">${tags}</div>
          </article>
        `;
        })
        .join("");
    })
    .catch(() => {
      list.innerHTML = `<p class="font-sans text-muted dark:text-muted-dark italic">Could not load posts.</p>`;
    });
})();
