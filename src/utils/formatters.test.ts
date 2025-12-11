import { describe, expect, it } from 'vitest';
import {
  formatWithSign,
  formatCurrency,
  formatGainRatio,
  formatHoldingRatio,
  formatGainAmount,
  formatGainAmountWithCurrency,
  getGainStatus,
} from './formatters';

describe('formatWithSign', () => {
  const identityFormatter = (v: number) => v.toString();

  it('正の値にプラス符号を付ける', () => {
    expect(formatWithSign(100, identityFormatter)).toBe('+100');
  });

  it('負の値にマイナス符号を付け、絶対値を使用する', () => {
    expect(formatWithSign(-100, identityFormatter)).toBe('-100');
  });

  it('0には符号を付けない', () => {
    expect(formatWithSign(0, identityFormatter)).toBe('0');
  });

  it('カスタムフォーマッターで正の値をフォーマットする', () => {
    const formatter = (v: number) => `${v.toFixed(2)}%`;
    expect(formatWithSign(12.5, formatter)).toBe('+12.50%');
  });

  it('カスタムフォーマッターで負の値をフォーマットする', () => {
    const formatter = (v: number) => `¥${v.toLocaleString('ja-JP')}`;
    expect(formatWithSign(-1500, formatter)).toBe('-¥1,500');
  });

  it('カスタムフォーマッターで0をフォーマットする', () => {
    const formatter = (v: number) => `¥${v.toLocaleString('ja-JP')}`;
    expect(formatWithSign(0, formatter)).toBe('¥0');
  });

  it('小数点以下の正の値を正しくフォーマットする', () => {
    expect(formatWithSign(0.5, identityFormatter)).toBe('+0.5');
  });

  it('小数点以下の負の値を正しくフォーマットする', () => {
    expect(formatWithSign(-0.5, identityFormatter)).toBe('-0.5');
  });
});

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

  it('NaNの場合は0を返す', () => {
    expect(formatCurrency(NaN)).toBe('0');
  });

  it('Infinityの場合は0を返す', () => {
    expect(formatCurrency(Infinity)).toBe('0');
  });

  it('-Infinityの場合は0を返す', () => {
    expect(formatCurrency(-Infinity)).toBe('0');
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

  it('NaNの場合は0.00%を返す', () => {
    expect(formatGainRatio(NaN)).toBe('0.00%');
  });

  it('Infinityの場合は0.00%を返す', () => {
    expect(formatGainRatio(Infinity)).toBe('0.00%');
  });

  it('-Infinityの場合は0.00%を返す', () => {
    expect(formatGainRatio(-Infinity)).toBe('0.00%');
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

  it('NaNの場合は0.0%を返す', () => {
    expect(formatHoldingRatio(NaN)).toBe('0.0%');
  });

  it('Infinityの場合は0.0%を返す', () => {
    expect(formatHoldingRatio(Infinity)).toBe('0.0%');
  });

  it('-Infinityの場合は0.0%を返す', () => {
    expect(formatHoldingRatio(-Infinity)).toBe('0.0%');
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

  it('NaNの場合は0を返す', () => {
    expect(formatGainAmount(NaN)).toBe('0');
  });

  it('Infinityの場合は0を返す', () => {
    expect(formatGainAmount(Infinity)).toBe('0');
  });

  it('-Infinityの場合は0を返す', () => {
    expect(formatGainAmount(-Infinity)).toBe('0');
  });
});

describe('formatGainAmountWithCurrency', () => {
  it('正の金額を+¥符号とカンマ区切りでフォーマットする', () => {
    expect(formatGainAmountWithCurrency(15500)).toBe('+¥15,500');
  });

  it('負の金額を-¥符号とカンマ区切りでフォーマットする', () => {
    expect(formatGainAmountWithCurrency(-3000)).toBe('-¥3,000');
  });

  it('0は¥符号のみでフォーマットする', () => {
    expect(formatGainAmountWithCurrency(0)).toBe('¥0');
  });

  it('大きな正の金額をフォーマットする', () => {
    expect(formatGainAmountWithCurrency(1234567)).toBe('+¥1,234,567');
  });

  it('大きな負の金額をフォーマットする', () => {
    expect(formatGainAmountWithCurrency(-1234567)).toBe('-¥1,234,567');
  });

  it('NaNの場合は¥0を返す', () => {
    expect(formatGainAmountWithCurrency(NaN)).toBe('¥0');
  });

  it('Infinityの場合は¥0を返す', () => {
    expect(formatGainAmountWithCurrency(Infinity)).toBe('¥0');
  });

  it('-Infinityの場合は¥0を返す', () => {
    expect(formatGainAmountWithCurrency(-Infinity)).toBe('¥0');
  });
});

describe('getGainStatus', () => {
  it('正の金額に対してpositiveを返す', () => {
    expect(getGainStatus(15500)).toBe('positive');
  });

  it('負の金額に対してnegativeを返す', () => {
    expect(getGainStatus(-3000)).toBe('negative');
  });

  it('0に対してzeroを返す', () => {
    expect(getGainStatus(0)).toBe('zero');
  });

  it('NaNに対してzeroを返す', () => {
    expect(getGainStatus(NaN)).toBe('zero');
  });

  it('Infinityに対してzeroを返す', () => {
    expect(getGainStatus(Infinity)).toBe('zero');
  });

  it('-Infinityに対してzeroを返す', () => {
    expect(getGainStatus(-Infinity)).toBe('zero');
  });
});
