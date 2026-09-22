import '@testing-library/jest-dom';

// Radix (Tooltip/Popper) mide con ResizeObserver, que jsdom no implementa.
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// Radix Select (Dropdown) llama scrollIntoView al resaltar una opcion y
// hasPointerCapture/setPointerCapture/releasePointerCapture al manejar el
// puntero; jsdom no implementa ninguno de los cuatro.
if (typeof Element.prototype.scrollIntoView !== 'function') {
  Element.prototype.scrollIntoView = () => {};
}
if (typeof Element.prototype.hasPointerCapture !== 'function') {
  Element.prototype.hasPointerCapture = () => false;
}
if (typeof Element.prototype.setPointerCapture !== 'function') {
  Element.prototype.setPointerCapture = () => {};
}
if (typeof Element.prototype.releasePointerCapture !== 'function') {
  Element.prototype.releasePointerCapture = () => {};
}

// jsdom no implementa matchMedia; SideBar/AppShell lo usan para colapsar el
// sidebar por defecto en tablet (DEC-005A2). "matches: false" por defecto
// (viewport de escritorio); una prueba que necesite simular tablet puede
// sobreescribir window.matchMedia puntualmente antes de renderizar.
if (typeof window.matchMedia !== 'function') {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}
