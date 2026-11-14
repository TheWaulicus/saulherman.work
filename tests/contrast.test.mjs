import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const cssPath = fileURLToPath(new URL('../src/styles/global.css', import.meta.url));
const css = readFileSync(cssPath, 'utf8');

const TEXT_TOKENS = ['text', 'sub', 'muted', 'accent', 'success', 'danger'];
const TOKEN_RE = /--([a-z-]+)-(light|dark):\s*([^;]+);/g;

function parseColor(value) {
  const v = value.trim();
  let m = v.match(/^#([0-9a-f]{6})$/i);
  if (m) {
    const n = parseInt(m[1], 16);
    return { rgb: [(n >> 16) & 255, (n >> 8) & 255, n & 255], a: 1 };
  }
  m = v.match(/^#([0-9a-f]{3})$/i);
  if (m) {
    const [r, g, b] = m[1].split('').map((c) => parseInt(c + c, 16));
    return { rgb: [r, g, b], a: 1 };
  }
  m = v.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/i);
  if (m) {
    return { rgb: [Number(m[1]), Number(m[2]), Number(m[3])], a: m[4] === undefined ? 1 : Number(m[4]) };
  }
  throw new Error(`Unsupported colour value: ${value}`);
}

function parseTokens(source) {
  const themes = { light: {}, dark: {} };
  for (const [, name, theme, value] of source.matchAll(TOKEN_RE)) {
    if (name in themes[theme]) continue;
    themes[theme][name] = parseColor(value);
  }
  return themes;
}

function composite(fg, over) {
  const a = fg.a;
  return {
    rgb: fg.rgb.map((c, i) => c * a + over.rgb[i] * (1 - a)),
    a: 1,
  };
}

function linear(c255) {
  const c = c255 / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function luminance({ rgb }) {
  const [r, g, b] = rgb.map(linear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const l1 = luminance(a);
  const l2 = luminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function surfaces(t) {
  const glass = composite(t.glass, t.bg);
  return {
    bg: t.bg,
    surface: t.surface,
    glass,
    'tag-bg': composite(t['tag-bg'], t.bg),
    'tag-bg (nested in glass)': composite(t['tag-bg'], glass),
  };
}

// Base tokens are declared before the @media (prefers-contrast: more) override block.
const baseEnd = css.indexOf('@media (prefers-contrast');
assert.ok(baseEnd > 0, 'expected a prefers-contrast media block in global.css');
const base = parseTokens(css.slice(0, baseEnd));

// The prefers-contrast block overrides some tokens on top of the base values.
const contrastEnd = css.indexOf('@media (forced-colors', baseEnd);
const overrides = parseTokens(css.slice(baseEnd, contrastEnd > 0 ? contrastEnd : undefined));
const moreContrast = {
  light: { ...base.light, ...overrides.light },
  dark: { ...base.dark, ...overrides.dark },
};

const REQUIRED = ['bg', 'surface', 'glass', 'tag-bg', ...TEXT_TOKENS];

function suite(label, themes) {
  for (const theme of ['light', 'dark']) {
    const t = themes[theme];
    describe(`${label} ${theme} theme`, () => {
      test('defines every required colour token', () => {
        for (const name of REQUIRED) {
          assert.ok(t[name], `--${name}-${theme} is missing in global.css`);
        }
      });

      const s = surfaces(t);
      for (const token of TEXT_TOKENS) {
        for (const [surfaceName, surface] of Object.entries(s)) {
          test(`--${token} on --${surfaceName} is >= 4.5:1`, () => {
            const ratio = contrast(t[token], surface);
            assert.ok(ratio >= 4.5, `${ratio.toFixed(2)}:1 is below 4.5:1`);
          });
        }
      }

      for (const surfaceName of ['bg', 'glass']) {
        test(`--accent focus outline on --${surfaceName} is >= 3:1`, () => {
          const ratio = contrast(t.accent, s[surfaceName]);
          assert.ok(ratio >= 3, `${ratio.toFixed(2)}:1 is below 3:1`);
        });
      }

      for (const surfaceName of ['surface', 'bg']) {
        test(`--muted scrollbar thumb on --${surfaceName} is >= 3:1`, () => {
          const ratio = contrast(t.muted, s[surfaceName]);
          assert.ok(ratio >= 3, `${ratio.toFixed(2)}:1 is below 3:1`);
        });
      }
    });
  }
}

suite('Default', base);
suite('prefers-contrast: more', moreContrast);
