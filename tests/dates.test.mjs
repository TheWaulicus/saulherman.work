import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const datesUrl = new URL('../src/utils/dates.ts', import.meta.url);
const { formatMonthYear, toYearMonthString, toPlainDateString } = await import(datesUrl.href);

describe('date helpers', () => {
  const date = new Date('2026-06-01');

  test('formatMonthYear short', () => {
    assert.equal(formatMonthYear(date, 'short'), 'Jun 2026');
    assert.equal(formatMonthYear(date), 'Jun 2026');
  });

  test('formatMonthYear long', () => {
    assert.equal(formatMonthYear(date, 'long'), 'June 2026');
  });

  test('toYearMonthString', () => {
    assert.equal(toYearMonthString(date), '2026-06');
  });

  test('toPlainDateString', () => {
    assert.equal(toPlainDateString(date), '2026-06-01');
  });
});

describe('timezone independence', () => {
  const script = `
    const m = await import(${JSON.stringify(datesUrl.href)});
    const d = new Date('2026-06-01');
    const edge = new Date('2026-01-01');
    console.log(JSON.stringify([
      m.formatMonthYear(d, 'short'),
      m.formatMonthYear(d, 'long'),
      m.toYearMonthString(d),
      m.toPlainDateString(d),
      m.formatMonthYear(edge, 'short'),
      m.toYearMonthString(edge),
      m.toPlainDateString(edge),
    ]));
  `;
  const expected = ['Jun 2026', 'June 2026', '2026-06', '2026-06-01', 'Jan 2026', '2026-01', '2026-01-01'];

  for (const tz of ['UTC', 'America/Los_Angeles', 'Pacific/Auckland', 'Pacific/Kiritimati']) {
    test(`no drift under TZ=${tz}`, () => {
      const out = execFileSync(process.execPath, ['--input-type=module', '-e', script], {
        env: { ...process.env, TZ: tz },
        cwd: fileURLToPath(new URL('..', import.meta.url)),
        encoding: 'utf8',
      });
      assert.deepEqual(JSON.parse(out.trim()), expected);
    });
  }
});
