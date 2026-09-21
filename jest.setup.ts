import '@testing-library/jest-dom';

// Radix (Tooltip/Popper) mide con ResizeObserver, que jsdom no implementa.
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
