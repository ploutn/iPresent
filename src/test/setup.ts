// src/test/setup.ts
import "@testing-library/jest-dom";
import { vi } from "vitest";

// You can add other global setup configurations here if needed
// For example, mocking global objects or functions:

// Mock matchMedia - often needed for components that use it for responsive design
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver - often needed for components that use it for layout changes
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// If you are using Zustand and want to reset stores between tests, you might do something like:
// import { useSongStore } from '../store/songStore'; // Adjust path as needed
// import { useContentStore } from '../stores/useContentStore'; // Adjust path as needed

// beforeEach(() => {
//   // Reset Zustand stores before each test
//   useSongStore.setState(useSongStore.getInitialState());
//   useContentStore.setState(useContentStore.getInitialState());
// });

console.log("Jest-dom and mocks configured for Vitest.");
