import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateSalaryTax } from './taxCalculator';

test('Tax Calculator - Salary up to 600,000/year (50k/month) has 0% tax', () => {
  const result = testTax(50_000);
  assert.equal(result.annualGross, 600_000);
  assert.equal(result.annualTax, 0);
  assert.equal(result.monthlyTax, 0);
  assert.equal(result.monthlyNet, 50_000);
  assert.equal(result.effectiveTaxRate, 0);
});

test('Tax Calculator - Salary 100,000/month (1.2M/year) falls in slab 2 (5% of excess over 600k)', () => {
  const result = testTax(100_000);
  assert.equal(result.annualGross, 1_200_000);
  // (1,200,000 - 600,000) * 0.05 = 30,000 annual tax
  assert.equal(result.annualTax, 30_000);
  assert.equal(result.monthlyTax, 2500);
  assert.equal(result.monthlyNet, 97_500);
  assert.equal(result.effectiveTaxRate, 2.5);
});

test('Tax Calculator - Salary 150,000/month (1.8M/year) falls in slab 3 (30k + 15% of excess over 1.2M)', () => {
  const result = testTax(150_000);
  assert.equal(result.annualGross, 1_800_000);
  // 30,000 + (1,800,000 - 1,200,000) * 0.15 = 30,000 + 90,000 = 120,000
  assert.equal(result.annualTax, 120_000);
  assert.equal(result.monthlyTax, 10_000);
  assert.equal(result.monthlyNet, 140_000);
  assert.equal(result.effectiveTaxRate, 6.67);
});

test('Tax Calculator - Handles zero and negative values gracefully', () => {
  const resultZero = testTax(0);
  assert.equal(resultZero.annualTax, 0);
  assert.equal(resultZero.monthlyNet, 0);

  const resultNegative = testTax(-5000);
  assert.equal(resultNegative.annualTax, 0);
  assert.equal(resultNegative.monthlyNet, 0);
});

function testTax(monthly: number) {
  return calculateSalaryTax(monthly);
}
