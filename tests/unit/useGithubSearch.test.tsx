import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { useGithubSearch } from "../../src/hooks/useGithubSearch";

function setup(mocks: { url: string; payload: any }[]) {
  const client = new QueryClient();
  vi.spyOn(global, "fetch").mockImplementation((url: any) => {
    const m = mocks.find((x) =>
      (typeof url === "string" ? url : url.url).startsWith(x.url)
    );
    if (!m) return Promise.resolve(new Response("not found", { status: 404 }));
    return Promise.resolve(
      new Response(JSON.stringify(m.payload), { status: 200 })
    );
  });

  const wrapper = ({ children }: any) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { wrapper, client };
}

afterEach(() => {
  vi.restoreAllMocks();
});

test("useGithubSearch fetches first page and paginates", async () => {
  const { wrapper } = setup([
    {
      url: "/api/github/search/repositories",
      payload: { total_count: 1, items: [{ id: 1 }], hasNextPage: true },
    },
    {
      url: "/api/github/search/repositories?q=",
      payload: { total_count: 1, items: [{ id: 2 }], hasNextPage: false },
    },
  ]);

  const { result } = renderHook(
    () => useGithubSearch({ query: "react", type: "repositories" }),
    { wrapper }
  );
  await waitFor(() => expect(result.current.isPending).toBe(false));
  expect(result.current.pages.flatMap((p) => p.items).length).toBe(1);
});
