"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error: any) => {
              const status = error?.status ?? error?.cause?.status;
              if (
                status &&
                status >= 400 &&
                status < 500 &&
                status !== 408 &&
                status !== 429
              )
                return false;
              return failureCount < 2;
            },
            staleTime: 1000 * 60 * 2,
            gcTime: 1000 * 60 * 10,
          },
        },
      })
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
