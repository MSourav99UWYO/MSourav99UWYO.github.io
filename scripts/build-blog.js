#!/usr/bin/env node
/**
 * Blog build script.
 * - Reads /blog/posts/*.md, parses YAML frontmatter, converts to HTML
 * - Writes /blog/posts/<slug>.html using the template
 * - Writes /blog/posts.json (index for blog/index.html)
 * - Writes /blog/rss.xml
 *
 * Frontmatter format:
 *   ---
 *   title: My Post Title
 *   date: 2026-05-22
 *   excerpt: Optional one-line summary
 *   tags: [research, ethereum]
 *   ---
 *
 *   Post body in Markdown. KaTeX delimiters $...$ and $$...$$ render client-side.
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'blog', 'posts');
const SITE_URL = process.env.SITE_URL || 'https://example.com'; // change to your domain
const AUTHOR = 'Sourav Majumder';

// Configure marked
marked.setOptions({ gfm: true, breaks: false, headerIds: true, mangle: false });

function loadTemplate() {
  return fs.readFileSync(path.join(__dirname, 'post-template.html'), 'utf8');
}

function slugify(filename) {
  // Drop optional YYYY-MM-DD- prefix and .md extension
  return filename.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
}

function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

function escapeXml(s) {
  return String(s).replace(/[<>&'"]/g, (c) => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;',
  }[c]));
}

function buildPosts() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.error('No posts directory');
    process.exit(0);
  }

  const template = loadTemplate();
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));

  const index = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
    const { data, content } = matter(raw);

    if (!data.title || !data.date) {
      console.warn(`Skipping ${file}: missing title or date in frontmatter`);
      continue;
    }

    const slug = slugify(file);
    const html = marked.parse(content);

    const out = template
      .replace(/\{\{TITLE\}\}/g, data.title)
      .replace(/\{\{DATE_ISO\}\}/g, new Date(data.date).toISOString().slice(0, 10))
      .replace(/\{\{DATE\}\}/g, fmtDate(data.date))
      .replace(/\{\{EXCERPT\}\}/g, data.excerpt || '')
      .replace(/\{\{TAGS\}\}/g, (data.tags || [])
        .map((t) => `<span class="tag">${t}</span>`).join(' '))
      .replace(/\{\{CONTENT\}\}/g, html);

    fs.writeFileSync(path.join(POSTS_DIR, `${slug}.html`), out);

    index.push({
      slug,
      title: data.title,
      date: new Date(data.date).toISOString().slice(0, 10),
      excerpt: data.excerpt || '',
      tags: data.tags || [],
    });
  }

  // Sort newest first
  index.sort((a, b) => (a.date < b.date ? 1 : -1));

  fs.writeFileSync(
    path.join(ROOT, 'blog', 'posts.json'),
    JSON.stringify(index, null, 2)
  );

  // RSS
  const rssItems = index.map((p) => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${SITE_URL}/blog/posts/${p.slug}.html</link>
      <guid isPermaLink="true">${SITE_URL}/blog/posts/${p.slug}.html</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${escapeXml(p.excerpt)}</description>
    </item>`).join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(AUTHOR)} — Notes</title>
    <link>${SITE_URL}/blog/</link>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>Notes and research updates by ${escapeXml(AUTHOR)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${rssItems}
  </channel>
</rss>`;

  fs.writeFileSync(path.join(ROOT, 'blog', 'rss.xml'), rss);

  console.log(`Built ${index.length} post(s). posts.json and rss.xml updated.`);
}

buildPosts();
