import { describe, expect, it } from 'vitest';
import {
  formatCurrency,
  formatGainRatio,
  formatHoldingRatio,
  formatGainAmount,
  getGainStatus,
} from './formatters';

describe('formatCurrency', () => {
  it('正の整数をカンマ区切りでフォーマットする', () => {
    expect(formatCurrency(115500)).toBe('115,500');
  });

  it('0をフォーマットする', () => {
    expect(formatCurrency(0)).toBe('0');
  });

  it('大きな数値をカンマ区切りでフォーマットする', () => {
    expect(formatCurrency(1234567890)).toBe('1,234,567,890');
  });

  it('小さな数値はカンマなしでフォーマットする', () => {
    expect(formatCurrency(999)).toBe('999');
  });
});

describe('formatGainRatio', () => {
  it('正の比率をプラス符号と小数点以下2桁でフォーマットする', () => {
    expect(formatGainRatio(12.87)).toBe('+12.87%');
  });

  it('負の比率をマイナス符号と小数点以下2桁でフォーマットする', () => {
    expect(formatGainRatio(-5.5)).toBe('-5.50%');
  });

  it('0の比率は符号なしでフォーマットする', () => {
    expect(formatGainRatio(0)).toBe('0.00%');
  });

  it('整数を小数点以下2桁でフォーマットする', () => {
    expect(formatGainRatio(20)).toBe('+20.00%');
  });
});

describe('formatHoldingRatio', () => {
  it('比率を小数点以下1桁でフォーマットする', () => {
    expect(formatHoldingRatio(39.8)).toBe('39.8%');
  });

  it('整数を小数点以下1桁でフォーマットする', () => {
    expect(formatHoldingRatio(25)).toBe('25.0%');
  });

  it('0をフォーマットする', () => {
    expect(formatHoldingRatio(0)).toBe('0.0%');
  });

  it('小数点以下1桁に丸める', () => {
    expect(formatHoldingRatio(12.345)).toBe('12.3%');
  });
});

describe('formatGainAmount', () => {
  it('正の金額をプラス符号とカンマ区切りでフォーマットする', () => {
    expect(formatGainAmount(15500)).toBe('+15,500');
  });

  it('負の金額をマイナス符号とカンマ区切りでフォーマットする', () => {
    expect(formatGainAmount(-3000)).toBe('-3,000');
  });

  it('0は符号なしでフォーマットする', () => {
    expect(formatGainAmount(0)).toBe('0');
  });

  it('大きな金額をフォーマットする', () => {
    expect(formatGainAmount(1234567)).toBe('+1,234,567');
  });
});

describe('getGainStatus', () => {
  it('正の金額に対してpositiveステータスを返す', () => {
    const result = getGainStatus(15500);
    expect(result.status).toBe('positive');
    expect(result.colorClass).toBe('text-green-500');
  });

  it('負の金額に対してnegativeステータスを返す', () => {
    const result = getGainStatus(-3000);
    expect(result.status).toBe('negative');
    expect(result.colorClass).toBe('text-red-500');
  });

  it('0に対してzeroステータスを返す', () => {
    const result = getGainStatus(0);
    expect(result.status).toBe('zero');
    expect(result.colorClass).toBe('text-gray-500');
  });
});
