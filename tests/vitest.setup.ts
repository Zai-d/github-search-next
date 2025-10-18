import "@testing-library/jest-dom/vitest";

if (typeof (global as any).IntersectionObserver === "undefined") {
  class MockIntersectionObserver {
    root: Element | null = null;
    rootMargin: string = "";
    thresholds: ReadonlyArray<number> = [];
    constructor(
      public callback: IntersectionObserverCallback,
      public options?: IntersectionObserverInit
    ) {}
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  (global as any).IntersectionObserver = MockIntersectionObserver as any;
}
