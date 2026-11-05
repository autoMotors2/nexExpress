// Tests for the shared tracking-ID module (BRAND_GUIDE §7). Run with `npm test`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  TRACKING_ALPHABET,
  generateTrackingId,
  normalizeTrackingInput,
  isValidTrackingId,
  parsePieceLabel,
  parseTrackingInput,
  pieceLabel
} from '../src/shared/trackingId.ts';

test('alphabet is the 32 unambiguous characters', () => {
  assert.equal(TRACKING_ALPHABET, '23456789ABCDEFGHJKLMNPQRSTUVWXYZ');
  assert.equal(new Set(TRACKING_ALPHABET).size, 32);
  for (const c of '01OI') assert.ok(!TRACKING_ALPHABET.includes(c), `${c} must be excluded`);
});

test('generateTrackingId: NEL + 5 safe characters, 8 in total', () => {
  const seen = new Set<string>();
  const used = new Set<string>();
  for (let i = 0; i < 5000; i++) {
    const id = generateTrackingId();
    assert.equal(id.length, 8);
    assert.match(id, /^NEL[2-9A-HJ-NP-Z]{5}$/);
    assert.ok(isValidTrackingId(id));
    seen.add(id);
    for (const c of id.slice(3)) used.add(c);
  }
  // 5000 draws from 33.5 million: a handful of collisions at most, and every character turns up.
  assert.ok(seen.size > 4990, `too many duplicates: ${5000 - seen.size}`);
  assert.equal(used.size, 32);
});

test('normalizeTrackingInput: trim, uppercase, strip spaces and dashes', () => {
  assert.equal(normalizeTrackingInput('nel 7k2-m9'), 'NEL7K2M9');
  assert.equal(normalizeTrackingInput('  NEL7K2M9 \n'), 'NEL7K2M9');
  assert.equal(normalizeTrackingInput('n-e-l-7-k-2-m-9'), 'NEL7K2M9');
  const enDash = String.fromCharCode(0x2013); // pasted from a document
  assert.equal(normalizeTrackingInput(`NEL${enDash}7K2M9${enDash}01`), 'NEL7K2M9-01');
});

test('normalizeTrackingInput: keeps the -NN piece suffix on a full ID', () => {
  assert.equal(normalizeTrackingInput('nel7k2m9-01'), 'NEL7K2M9-01');
  assert.equal(normalizeTrackingInput('nel 7k2-m9 - 12'), 'NEL7K2M9-12');
  assert.equal(normalizeTrackingInput('NEL7K2M9--03'), 'NEL7K2M9-03');
  // Not a full ID before the dash, so the dash is just stripped.
  assert.equal(normalizeTrackingInput('NEL7K2M-99'), 'NEL7K2M99');
});

test('isValidTrackingId: strict ^NEL[2-9A-HJ-NP-Z]{5}$', () => {
  for (const ok of ['NEL7K2M9', 'NELQ4X8T', 'NEL22222', 'NELZZZZZ']) assert.ok(isValidTrackingId(ok), ok);
  for (const bad of [
    '', 'NEL7K2M', 'NEL7K2M9X', 'nel7k2m9', 'NEL7K2M0', 'NEL7K2MO', 'NEL7K2M1', 'NEL7K2MI',
    'ABC7K2M9', 'WP7K2M9P', 'NEL 7K2M9', 'NEL7K2M9-01', 'RTO-NEL7K2M9', 'ABC-2026-ABCDEFGH'
  ]) assert.ok(!isValidTrackingId(bad), bad);
});

test('parsePieceLabel: NELXXXXX-NN resolves to parent and piece number', () => {
  assert.deepEqual(parsePieceLabel('NEL7K2M9-01'), { parentId: 'NEL7K2M9', piece: 1 });
  assert.deepEqual(parsePieceLabel('nel 7k2-m9-12'), { parentId: 'NEL7K2M9', piece: 12 });
  assert.deepEqual(parsePieceLabel('NEL7K2M902'), { parentId: 'NEL7K2M9', piece: 2 });
  assert.equal(parsePieceLabel('NEL7K2M9'), null);
  assert.equal(parsePieceLabel('NEL7K2M9-00'), null);
  assert.equal(parsePieceLabel('NEL7K2M9-1'), null);
  assert.equal(parsePieceLabel('NEL7K2M9-001'), null);
  assert.equal(parsePieceLabel('NEL7K2M9-PL01'), null);
  assert.equal(parsePieceLabel('NEL7K2M0-01'), null);
});

test('parseTrackingInput: IDs and child labels resolve to the 8-character parent', () => {
  assert.deepEqual(parseTrackingInput('nel 7k2-m9'), { trackingId: 'NEL7K2M9' });
  assert.deepEqual(parseTrackingInput('NEL7K2M9-03'), { trackingId: 'NEL7K2M9', piece: 3 });
  assert.equal(parseTrackingInput('ABC-2026-ABCD1234'), null);
  assert.equal(parseTrackingInput('hello'), null);
  assert.equal(parseTrackingInput(''), null);
});

test('pieceLabel round-trips through parsePieceLabel', () => {
  const id = generateTrackingId();
  for (const n of [1, 2, 10, 99]) {
    const label = pieceLabel(id, n);
    assert.equal(label, `${id}-${String(n).padStart(2, '0')}`);
    assert.deepEqual(parsePieceLabel(label), { parentId: id, piece: n });
  }
});

test('generateTrackingId uses the random source it is given (server passes crypto.randomInt)', async () => {
  const picks: number[] = [];
  const id = generateTrackingId((max) => { assert.equal(max, 32); picks.push(max); return picks.length - 1; });
  assert.equal(id, 'NEL23456');
  assert.equal(picks.length, 5);
  const { randomInt } = await import('node:crypto');
  for (let i = 0; i < 1000; i++) assert.ok(isValidTrackingId(generateTrackingId((max) => randomInt(max))));
});
