import { renderHook, act } from "@testing-library/react";
import { useDebouncedValue } from "../../src/hooks/useDebouncedValue";

vi.useFakeTimers();

test("useDebouncedValue debounces updates", () => {
  const { result, rerender } = renderHook(
    ({ v }) => useDebouncedValue(v, 500),
    { initialProps: { v: "a" } }
  );
  expect(result.current).toBe("a");

  rerender({ v: "ab" });

  expect(result.current).toBe("a");

  act(() => {
    vi.advanceTimersByTime(499);
  });
  expect(result.current).toBe("a");

  act(() => {
    vi.advanceTimersByTime(1);
  });
  expect(result.current).toBe("ab");
});
