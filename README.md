# GitHub Search (Next.js 15 + TypeScript)

A single-page app to search **GitHub Users** and **Repositories**. Built with **Next.js 15 (App Router)**, **TypeScript**, **TanStack Query**, and secure **Route Handlers**. Includes unit tests (Vitest + RTL) and E2E tests (Playwright).

> Personal note: I kept the UI lean and fast (CSS Modules, accessible controls) and focused on correctness, performance, and clear code.

## Features

- Toggle: **Users** | **Repositories**
- **Users**: avatar, full name, profile link
- **Repositories**:
  - Language badges (`GET /repos/{owner}/{repo}/languages`)
  - Metrics with icons: stars, forks, open issues, license
- Clear **loading/empty/error** states
- **Infinite scroll** via `IntersectionObserver` + `page`/`per_page` (= 20) for Users & (= 10) for Repos
- **Performance**:
  - Debounced search (~500 ms)
  - TanStack Query caching by (type + query + page)
  - Lazy details per card; **global concurrency cap (3)** for detail requests
- **Security**: GitHub token is server-only (never exposed)
- **Type safety**: strict TS + `zod` on server responses
- **Accessibility**: labeled controls, focus ring, aria titles/labels for icon-only metrics

## Quickstart

```bash
cp .env.example .env
# Put your token in .env:
# GITHUB_TOKEN=ghp_xxx   # (classic token with no scopes is fine) This will only increase the limit and not necessary for the app to function
npm run dev
# http://localhost:3000
```
