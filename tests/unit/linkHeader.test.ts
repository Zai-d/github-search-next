import {
  capBySearchLimit,
  parseHasNextFromLink,
  parseLinkHeader,
} from "src/lib/link-header";

test("parseLinkHeader extracts rel urls", () => {
  const link =
    '<https://api.github.com/search/repositories?q=x&page=2>; rel="next", <https://api.github.com/search/repositories?q=x&page=34>; rel="last"';
  const map = parseLinkHeader(link);
  expect(map.next).toContain("page=2");
  expect(map.last).toContain("page=34");
});

test("parseHasNextFromLink detects next", () => {
  const link = '<url?page=2>; rel="next"';
  expect(parseHasNextFromLink(link)).toBe(true);
  expect(parseHasNextFromLink(undefined)).toBe(false);
});

test("capBySearchLimit enforces 1k cap", () => {
  expect(capBySearchLimit(49, 20)).toBe(true);

  expect(capBySearchLimit(50, 20)).toBe(false);
  expect(capBySearchLimit(49, 21)).toBe(false);
});
