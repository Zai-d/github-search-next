export function parseLinkHeader(link?: string | null): Record<string, string> {
  if (!link) return {};
  const parts = link.split(",");
  const map: Record<string, string> = {};
  for (const p of parts) {
    const m = p.match(/<([^>]+)>;\s*rel="([^"]+)"/);
    if (m) map[m[2]] = m[1];
  }
  return map;
}

export function parseHasNextFromLink(link?: string | null): boolean {
  const rels = parseLinkHeader(link);
  return Boolean(rels["next"]);
}

export function capBySearchLimit(page: number, perPage: number): boolean {
  return page * perPage < 1000;
}
