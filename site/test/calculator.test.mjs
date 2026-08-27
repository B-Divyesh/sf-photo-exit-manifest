import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateReadiness, policyFile } from '../src/calculator.js';

test('documented 99.5 percent target still requires every difference named', () => {
  const result = calculateReadiness(1000, 995, 4, true);
  assert.equal(result.percent, 99.9);
  assert.equal(result.unresolved, 1);
  assert.equal(result.ready, false);
});

test('hash evidence and complete accounting produce a ready result', () => {
  assert.equal(calculateReadiness(200, 199, 1, true).ready, true);
  assert.equal(calculateReadiness(200, 200, 0, false).ready, false);
});

test('family builder emits the CLI policy schema', () => {
  const result = policyFile([{ name: ' Phone ', owner: ' Sam ', backupMode: 'backup', deletionBehavior: 'manual_review', conflictPolicy: 'keep_both' }]);
  assert.equal(result.devices[0].name, 'Phone');
  assert.equal(result.devices[0].conflict_policy, 'keep_both');
});
