import test from "node:test";
import assert from "node:assert/strict";
import { analyzeHeaders, estimateEntropy, calculateLearningProgress } from "../assets/app.js";

test("header analyzer identifies present and missing controls", () => {
  const findings = analyzeHeaders("HTTP/2 200\nContent-Security-Policy: default-src 'self'\nX-Content-Type-Options: nosniff");
  assert.equal(findings[0].present, true);
  assert.equal(findings[1].present, false);
  assert.equal(findings[2].present, true);
});

test("header analyzer tolerates empty input", () => {
  assert.equal(analyzeHeaders("").every(item => !item.present), true);
});

test("entropy estimate is zero for empty input", () => {
  assert.equal(estimateEntropy("").bits, 0);
});

test("entropy estimate increases with longer mixed input", () => {
  const short = estimateEntropy("Ab1!");
  const long = estimateEntropy("Ab1!Ab1!Ab1!");
  assert.ok(long.bits > short.bits);
});

test("entropy estimate identifies character pools", () => {
  assert.equal(estimateEntropy("abc").pool, 26);
  assert.equal(estimateEntropy("abcABC").pool, 52);
});

test("learning progress clamps completion and calculates percentage", () => {
  assert.deepEqual(calculateLearningProgress(["headers", "entropy"], 3), { completed: 2, total: 3, percent: 67 });
  assert.deepEqual(calculateLearningProgress(["a", "b", "c", "d"], 3), { completed: 3, total: 3, percent: 100 });
  assert.deepEqual(calculateLearningProgress([], 0), { completed: 0, total: 0, percent: 0 });
});
