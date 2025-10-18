import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { ReposList } from "@components/RepoComponents/ReposList"; // keep your alias

function renderWithClient(ui: any) {
  const client = new QueryClient();
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>
  );
}

afterEach(() => vi.restoreAllMocks());

test("ReposList renders results", async () => {
  vi.spyOn(global, "fetch").mockImplementation((url: any) => {
    const href = typeof url === "string" ? url : url.url;

    if (href.startsWith("/api/github/search/repositories")) {
      // 👇 Include "strapi/strapi" so the assertion matches
      return Promise.resolve(
        new Response(
          JSON.stringify({
            total_count: 1,
            items: [
              {
                id: 1,
                name: "strapi",
                full_name: "strapi/strapi",
                owner: { login: "strapi" },
                html_url: "https://github.com/strapi/strapi",
                stargazers_count: 100,
                forks_count: 10,
                open_issues_count: 1,
                license: { spdx_id: "MIT" },
              },
            ],
            hasNextPage: false,
          }),
          { status: 200 }
        )
      );
    }

    // details endpoints are not needed because our IntersectionObserver mock never triggers inView
    return Promise.resolve(new Response("[]", { status: 200 }));
  });

  renderWithClient(<ReposList query="strapi" />);

  // Assert via accessible link text (the repo name shown in UI)
  await waitFor(() =>
    expect(
      screen.getByRole("link", { name: /strapi\/strapi/i })
    ).toBeInTheDocument()
  );
});
