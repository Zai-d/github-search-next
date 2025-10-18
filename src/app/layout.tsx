import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "GitHub Search – Next.js 15",
  description: "Search GitHub users and repositories with infinite scroll.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="container" style={{ paddingTop: "1.25rem" }}>
          <h1 style={{ margin: 0, fontSize: "1.6rem" }}>GitHub Search</h1>
          <p style={{ marginTop: ".25rem", color: "var(--muted)" }}>
            Done by: Zaid Haddadin
          </p>
        </header>
        <Providers>
          <main className="container" role="main">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
