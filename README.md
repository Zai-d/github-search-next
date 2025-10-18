![App Landing Page](/docs/GitHub-SPA-Search.png "App Landing Page")

# GitHub Search – Next.js 15 + TypeScript

A single-page app to search **GitHub Users** and **Repositories** with infinite scroll, lazy details, and strict typing. Built with **Next.js 15 (App Router)**, **TypeScript**, **TanStack Query**, and secure **Route Handlers**.

> I kept the UI lean (CSS Modules), keyboard-friendly, and focused on correctness, performance, and clear code.

---

## Features

- **Search type toggle**: Users | Repositories
- **Users**: avatar, profile link, and full name (fetched lazily via `GET /users/{username}` if missing)
- **Repositories**:
  - Language badges from `GET /repos/{owner}/{repo}/languages`
  - Metrics with icons: stars, forks, open issues, license
- Strong states: **loading skeletons**, **empty**, and **error with retry**
- **Infinite scroll** via `IntersectionObserver` + `page/per_page` (20 for Users) (10 For Repos)
- **Performance**
  - Debounced search (~500 ms)
  - TanStack Query caching by **(type + query + page)**
  - Per-card lazy requests (e.g., languages) with a **global concurrency cap (3)**
- **Security**: GitHub token never leaves the server; all calls go through Next.js Route Handlers
- **Type safety**: strict TypeScript + `zod` validation on server responses
- **Accessibility**: labeled controls, focus ring, `aria-live` for loading, titles/labels for icon-only metrics

---

## Quickstart

### Requirements

- Node.js **18+**
- npm

### Setup

```bash
cp .env.example .env
# Optional to add a token, only to increase the limit:
# GITHUB_TOKEN=ghp_xxx   # classic token for public data

npm run dev
# http://localhost:3000
```

### Scripts

- `npm run dev` – start development server
- `npm run build && npm start` – production build & serve
- `npm run typecheck` – TypeScript type checking
- `npm run test:unit` – Vitest + React Testing Library
- `npm run test:e2e` – Playwright end-to-end tests (first run: `npx playwright install`)
- `npm run coverage` – unit test coverage report

---

## How the token works (optional)

The app functions without a token, but adding one raises rate limits and reduces 403s:

- **Get a token**: GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)** → _Generate new token_.
  Pick a short expiration; **no scopes are required** for public data.
- Put it in `.env` as `GITHUB_TOKEN=ghp_xxx`.

> With a token, Search endpoints allow ~**30 req/min**, and Core REST endpoints allow up to **5000 req/hour**.

---

## Architecture

- **App Router (Next 15)** with a small component library (CSS Modules).
- **Route Handlers** proxy all GitHub calls (token stays server-side) and add headers:

  - `Accept: application/vnd.github+json`
  - `X-GitHub-Api-Version: 2022-11-28`
  - `User-Agent: github-search-next`

- **Core endpoints**

  - `/api/github/search/users?q=&page=&per_page=`
  - `/api/github/search/repositories?q=&page=&per_page=`
  - `/api/github/users/[username]` (for full name)
  - `/api/github/repos/[owner]/[repo]/languages`

- **Data flow**

  - `SearchBar` debounces input.
  - `useGithubSearch` uses `useInfiniteQuery` to fetch/collapse pages.
  - Repo/User cards fetch extra details **when visible**; a tiny limiter caps concurrency to **3**.

- **Pagination end detection**

  - Stop when `Link` header has no `rel="next"`, **or**
  - When `page * per_page >= 1000` (Search API exposes at most 1000 results).

---

## Testing

- **Unit** (Vitest + RTL)

  - Debounce behavior
  - Loading/empty/error states
  - Link header parsing & 1000-result cap
  - List rendering basics

- **E2E** (Playwright)

  - Users flow + infinite scroll
  - Repos flow + lazy details
  - First time only: `npx playwright install`


