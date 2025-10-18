import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { UsersList } from "../../../src/app/(components)/UserComponents/UsersList";

function renderWithClient(ui: any) {
  const client = new QueryClient();
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>
  );
}

afterEach(() => vi.restoreAllMocks());

test("UsersList shows empty prompt without query", async () => {
  renderWithClient(<UsersList query="" />);
  expect(
    await screen.findByText(/Type to search GitHub users/i)
  ).toBeInTheDocument();
});

test("UsersList handles empty result", async () => {
  vi.spyOn(global, "fetch").mockResolvedValue(
    new Response(
      JSON.stringify({
        total_count: 0,
        items: [],
        hasNextPage: false,
      }),
      { status: 200 }
    )
  );
  renderWithClient(<UsersList query="unknown-user-xyz" />);
  await waitFor(() => screen.getByText(/No users found/i));
});
