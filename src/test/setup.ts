import "@testing-library/jest-dom/vitest";

//Mock de ResizeObserver para evitar errores en los tests

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
