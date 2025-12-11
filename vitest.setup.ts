import '@testing-library/dom';
import '@testing-library/jest-dom';

// ResizeObserverのモック（Radix UI Tooltipで必要）
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
