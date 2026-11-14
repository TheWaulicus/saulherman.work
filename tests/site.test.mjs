import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const hasDist = existsSync(join(dist, 'index.html'));
const skip = hasDist ? false : 'dist/ is missing: run "npm run build" first';

const SLUGS = [
  'agent-operated-it',
  'it-lifecycle-automation',
  'extraction-lab',
  'ice-zoo-board',
  'ice-zoo-board-app',
];

const SECURITY_HEADERS = [
  'Strict-Transport-Security',
  'X-Content-Type-Options',
  'X-Frame-Options',
  'Referrer-Policy',
  'Permissions-Policy',
  'Cross-Origin-Opener-Policy',
  'Cross-Origin-Resource-Policy',
  'Content-Security-Policy',
];

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const read = (path) => readFileSync(join(dist, path), 'utf8');
const rel = (path) => relative(dist, path);

const allHtml = hasDist ? walk(dist).filter((f) => f.endsWith('.html')) : [];
const layoutPages = ['index.html', '404.html', ...SLUGS.map((s) => `projects/${s}/index.html`)];

function parseAttrs(tag) {
  const attrs = {};
  for (const [, name, dq, sq, bare] of tag.matchAll(/([a-zA-Z_:][\w:.-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g)) {
    attrs[name.toLowerCase()] = dq ?? sq ?? bare ?? '';
  }
  return attrs;
}

function inlineScripts(html) {
  const scripts = [];
  for (const [, attrText, body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attrs = parseAttrs(attrText);
    if ('src' in attrs) continue;
    const type = (attrs.type ?? '').toLowerCase();
    if (type === 'application/json' || type === 'application/ld+json') continue;
    scripts.push(body);
  }
  return scripts;
}

function cspFromHeaders(headers) {
  const line = headers.split('\n').find((l) => /^\s*Content-Security-Policy\s*:/i.test(l));
  return line ? line.replace(/^\s*Content-Security-Policy\s*:\s*/i, '').trim() : '';
}

function directive(csp, name) {
  const part = csp.split(';').map((p) => p.trim()).find((p) => p.split(/\s+/)[0] === name);
  return part ? part.split(/\s+/).slice(1) : [];
}

describe('built site output', { skip }, () => {
  describe('expected files', () => {
    const files = [
      'index.html',
      '404.html',
      'sitemap-index.xml',
      'robots.txt',
      'favicon.svg',
      'manifest.webmanifest',
      '_headers',
      ...SLUGS.map((s) => `projects/${s}/index.html`),
    ];
    for (const file of files) {
      test(`dist/${file} exists`, () => {
        assert.ok(existsSync(join(dist, file)), `dist/${file} is missing`);
      });
    }
  });

  describe('client assets', () => {
    const astroDir = join(dist, '_astro');
    const names = existsSync(astroDir) ? walk(astroDir).map((f) => rel(f)) : [];

    test('no React client bundles', () => {
      const bad = names.filter((n) => /(^|\/)client\.[^/]*\.js$/.test(n));
      assert.deepEqual(bad, []);
    });

    test('no @, [ or ] in _astro filenames', () => {
      const bad = names.filter((n) => /[@[\]]/.test(n));
      assert.deepEqual(bad, []);
    });
  });

  describe('page layout', () => {
    for (const page of layoutPages) {
      describe(`dist/${page}`, () => {
        const html = () => read(page);

        test('declares color-scheme and text-scale meta', () => {
          assert.ok(html().includes('<meta name="color-scheme" content="light dark">'));
          assert.ok(html().includes('<meta name="text-scale" content="scale">'));
        });

        test('uses self-hosted fonts only', () => {
          const h = html();
          assert.ok(!h.includes('fonts.googleapis.com'), 'references fonts.googleapis.com');
          assert.ok(!h.includes('fonts.gstatic.com'), 'references fonts.gstatic.com');
          for (const font of ['/fonts/inter-latin-var.woff2', '/fonts/dm-serif-display-latin-400.woff2']) {
            const preloaded = [...h.matchAll(/<link\b[^>]*>/gi)].some((m) => {
              const a = parseAttrs(m[0]);
              return a.rel === 'preload' && a.href === font;
            });
            assert.ok(preloaded, `${font} is not preloaded`);
          }
        });

        test('has the landmark structure', () => {
          const h = html();
          const landmarkChecks = [
            ['<header class="site-header">', /<header\b[^>]*class="[^"]*\bsite-header\b/i],
            ['<nav class="site-nav" aria-label="Primary">', /<nav\b[^>]*class="[^"]*\bsite-nav\b[^>]*aria-label="Primary"/i],
            ['<main id="main-content"', /<main\b[^>]*id="main-content"/i],
            ['<footer class="footer">', /<footer\b[^>]*class="[^"]*\bfooter\b/i],
            ['<nav class="footer-links" aria-label="Social profiles">', /<nav\b[^>]*class="[^"]*\bfooter-links\b[^>]*aria-label="Social profiles"/i],
          ];
          for (const [label, pattern] of landmarkChecks) {
            assert.match(h, pattern, `missing ${label}`);
          }
          const mainCount = (h.match(/<main\b/gi) ?? []).length;
          assert.equal(mainCount, 1, `expected 1 <main>, found ${mainCount}`);
        });
      });
    }
  });

  describe('home page content', () => {
    test('project card links have trailing slashes and no aria-label', () => {
      const html = read('index.html');
      const cards = [...html.matchAll(/<a\b[^>]*>/gi)]
        .map((m) => m[0])
        .filter((tag) => parseAttrs(tag).class?.split(/\s+/).includes('card-link'));
      assert.ok(cards.length >= SLUGS.length, `found only ${cards.length} card links`);
      for (const tag of cards) {
        const a = parseAttrs(tag);
        assert.match(a.href, /^\/projects\/[a-z0-9-]+\/$/, `bad card href in ${tag}`);
        assert.ok(!('aria-label' in a), `card link has aria-label: ${tag}`);
      }
    });

    test('links to the agent-operated-it project', () => {
      assert.ok(read('index.html').includes('href="/projects/agent-operated-it/"'));
    });

    test('Neara start date renders as Jun 2026', () => {
      const html = read('index.html');
      assert.match(html, /<time\b[^>]*datetime="2026-06"[^>]*>Jun 2026<\/time>/, 'Neara start date is not Jun 2026');
      assert.ok(!html.includes('May 2026'), 'May 2026 found');
      assert.ok(!html.includes('datetime="2026-05"'), 'datetime 2026-05 found');
    });
  });

  describe('strict CSP', () => {
    test('no inline style attributes in any html file', () => {
      const offenders = allHtml.filter((f) => /<[a-z][^>]*\sstyle\s*=/i.test(readFileSync(f, 'utf8'))).map(rel);
      assert.deepEqual(offenders, []);
    });

    test('every inline script digest is listed in script-src', () => {
      const csp = cspFromHeaders(read('_headers'));
      const scriptSrc = directive(csp, 'script-src');
      assert.ok(scriptSrc.length > 0, 'CSP has no script-src directive');
      const missing = [];
      for (const file of allHtml) {
        for (const body of inlineScripts(readFileSync(file, 'utf8'))) {
          const digest = `'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`;
          if (!scriptSrc.includes(digest)) missing.push(`${rel(file)}: ${digest}`);
        }
      }
      assert.deepEqual(missing, []);
    });

    test('_headers has all security headers', () => {
      const headers = read('_headers');
      for (const name of SECURITY_HEADERS) {
        assert.match(headers, new RegExp(`^\\s*${name}\\s*:`, 'im'), `${name} is missing`);
      }
    });

    test('CSP does not allow unsafe-inline', () => {
      const csp = cspFromHeaders(read('_headers'));
      assert.ok(csp, 'CSP header is missing');
      assert.ok(!csp.includes("'unsafe-inline'"), "CSP contains 'unsafe-inline'");
    });
  });
});
