// Load latest 3 blog posts on home page
(function () {
  const list = document.getElementById('home-posts');
  if (!list) return;

  fetch('/blog/posts.json')
    .then((r) => r.json())
    .then((posts) => {
      if (!Array.isArray(posts) || posts.length === 0) {
        list.innerHTML = `<p class="font-sans text-sm text-muted dark:text-muted-dark italic">No posts yet.</p>`;
        return;
      }
      posts.sort((a, b) => (a.date < b.date ? 1 : -1));
      const recent = posts.slice(0, 3);
      list.innerHTML = recent.map((p) => {
        const date = new Date(p.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        return `
          <li class="border-t border-line dark:border-line-dark pt-3 first:border-t-0 first:pt-0">
            <div class="font-sans text-xs uppercase tracking-wider text-muted dark:text-muted-dark mb-1">${date}</div>
            <a href="/blog/posts/${p.slug}.html" class="font-serif text-lg leading-snug hover:text-accent dark:hover:text-accent-dark transition-colors">${p.title}</a>
          </li>
        `;
      }).join('');
    })
    .catch(() => { list.innerHTML = ''; });
})();
