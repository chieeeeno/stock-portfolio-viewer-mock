import { describe, expect, it } from 'vitest';
import { GAIN_STATUS_COLORS, getGainStatusColor } from './gainStatusStyles';

describe('GAIN_STATUS_COLORS', () => {
  it('positiveステータスに対して緑色のクラスを持つ', () => {
    expect(GAIN_STATUS_COLORS.positive).toBe('text-green-600 dark:text-green-300');
  });

  it('negativeステータスに対して赤色のクラスを持つ', () => {
    expect(GAIN_STATUS_COLORS.negative).toBe('text-red-600 dark:text-red-400');
  });

  it('zeroステータスに対してグレーのクラスを持つ', () => {
    expect(GAIN_STATUS_COLORS.zero).toBe('text-gray-500 dark:text-gray-400');
  });
});

describe('getGainStatusColor', () => {
  it('positiveステータスに対して緑色のクラスを返す', () => {
    expect(getGainStatusColor('positive')).toBe('text-green-600 dark:text-green-300');
  });

  it('negativeステータスに対して赤色のクラスを返す', () => {
    expect(getGainStatusColor('negative')).toBe('text-red-600 dark:text-red-400');
  });

  it('zeroステータスに対してグレーのクラスを返す', () => {
    expect(getGainStatusColor('zero')).toBe('text-gray-500 dark:text-gray-400');
  });
});
