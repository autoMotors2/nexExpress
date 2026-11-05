// Tests for the admin console path match (tracker L.5).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ADMIN_PATH, ADMIN_URL, SITE_URL, isAdminPathname } from '../src/config/brand.ts';

test('ADMIN_PATH and ADMIN_URL', () => {
  assert.equal(ADMIN_PATH, '/admin/');
  assert.equal(ADMIN_URL, `${SITE_URL}/admin/`);
});

test('isAdminPathname: the exact path, trailing slash and case ignored', () => {
  for (const p of ['/admin', '/admin/', '/Admin/', '/ADMIN', '/admin//']) {
    assert.equal(isAdminPathname(p), true, p);
  }
});

test('isAdminPathname: look-alikes and other paths do not match', () => {
  for (const p of ['/', '', '/admin-x', '/admins', '/admin/x', '/x/admin', '/adm', '/admi']) {
    assert.equal(isAdminPathname(p), false, p);
  }
});
