# Illustrator - Browser-based Image Editor

> Work in progress - personal project; temporary README.md for documentation.

A Photoshop-inspired image editor built entirely in the browser. Fully functional drawing tools, layer system, adjustment filters, and cloud project saving, built as a learning project covering Next.js fullstack development from scratch.

## Progress (Phases)

| Phase | Description                                                      | Status      |
| ----- | ---------------------------------------------------------------- | ----------- |
| p1    | Shell & canvas w/ template, types initialization                 | done        |
| p2    | Theming & UI components, core tools (move, marquee, lasso, etc.) | done        |
| p3    | Layer manager (OffscreenCanvas)                                  | done        |
| p4    | Adjustments & filters (pure calculation, no libraries)           | done        |
| p4.1  | Code docs & filter tests                                         | done        |
| p-    | Blend Modes                                                      | done        |
| p-.-  | Blend Modes docs & tests                                         | not yet     |
| p5    | PostgreSQL & Prisma with Docker (local)                          | done        |
| p6    | Posterize, vibrance, and curves filter                           | done        |
| p6.1  | Code docs & tests                                                | done        |
| p7    | Tools                                                            | done        |
| p7.1  | Tool tests                                                       | done        |
| p8    | UI polish                                                        | done        |
| p8.1  | Landing page                                                     | done        |
| p8.2  | Auth page                                                        | done        |
| p8.3  | Dashboard, Editor & Canvas                                       | partial     |
| p\*   | Deployment (Neon)                                                | on progress |

## Features

### Editor

- **Tools** - Brush, Eraser, Fill, Eyedropper, Marquee, Lasso, Crop, Move, Hand, Text, Shape, Zoom, and more
- **Layer Compositing** - independent `OffscreenCanvas` per layer with compositing, opacity, blend modes, and reordering
- **Undo / Redo** - full history stack (50) with `Ctrl+Z` / `Ctrl+Y`
- **Zoom** - Ctrl+scroll, keyboard shortcuts, fit-to-screen
- **Rulers** - toggleable with `Ctrl+R`
- **Selection** - live dashed overlay (e.g. Marquee, Lasso)
- **Crop tool** - darkened outside region with rule-of-thirds grid and corner handles
- **Hand tool** - pan the canvas freely

### Adjustments (10 filters)

| Filter                | Description                                                          |
| --------------------- | -------------------------------------------------------------------- |
| Brightness / Contrast | Linear pixel math                                                    |
| Levels                | Input/output range remapping with gamma correction                   |
| Curves                | Cubic spline interpolation with draggable control points per channel |
| Hue / Saturation      | RGB → HSL → adjust → RGB                                             |
| Vibrance              | Smart saturation boost - protects already-vivid colours              |
| B&W (Grayscale)       | BT.709 luminance formula                                             |
| Invert                | 255 - value per channel                                              |
| Posterize             | Quantise channels to N discrete levels                               |
| Gaussian Blur         | Separable two-pass kernel for performance                            |
| Sharpen               | Unsharp mask built on top of Gaussian blur                           |

All filters feature **live non-destructive preview**. Cancel fully restores the original.

## Blend Modes (16 modes)

A full per-pixel blend engine built from scratch; no `globalCompositeOperation`.
Each mode is implemented as a pure function operating on normalised (0–1) channel values,
alpha-composited using the Porter-Duff source-over formula.

| Mode        | Group      | Description                                         |
| ----------- | ---------- | --------------------------------------------------- |
| Normal      | Normal     | Standard source-over alpha compositing              |
| Multiply    | Darken     | Multiplies source and backdrop - always darkens     |
| Darken      | Darken     | Keeps the darker of source or backdrop per channel  |
| Color Burn  | Darken     | Darkens backdrop toward source, increases contrast  |
| Screen      | Lighten    | Inverse of Multiply - always lightens               |
| Lighten     | Lighten    | Keeps the lighter of source or backdrop per channel |
| Color Dodge | Lighten    | Brightens backdrop toward source, reduces contrast  |
| Overlay     | Contrast   | Multiply if backdrop dark, Screen if backdrop light |
| Soft Light  | Contrast   | Gentler Overlay using W3C curved formula            |
| Hard Light  | Contrast   | Overlay with source and backdrop roles swapped      |
| Difference  | Difference | Absolute difference between source and backdrop     |
| Exclusion   | Difference | Softer Difference with reduced contrast             |
| Hue         | Component  | Source hue + backdrop saturation and luminosity     |
| Saturation  | Component  | Source saturation + backdrop hue and luminosity     |
| Color       | Component  | Source hue and saturation + backdrop luminosity     |
| Luminosity  | Component  | Source luminosity + backdrop hue and saturation     |

Component modes (Hue, Saturation, Color, Luminosity) operate in HSL space
via `rgbToHsl` / `hslToRgb` conversions rather than per-channel arithmetic.

### Fullstack

- **Authentication** - email/password + optional Google OAuth via NextAuth v4
- **Cloud save** - projects serialised as JSON with base64 layer pixel data, stored in PostgreSQL
- **Dashboard** - project grid with thumbnails, rename, delete
- **Share links** - generate a public `/share/:token` read-only URL per project
- **Route protection** - middleware guards `/editor` and `/dashboard`

---

## Tech Stack

| Layer     | Technology                         |
| --------- | ---------------------------------- |
| Framework | Next.js 16 (App Router)            |
| Language  | TypeScript 5                       |
| State     | Zustand                            |
| Canvas    | HTML5 Canvas API + OffscreenCanvas |
| Auth      | NextAuth.js v4                     |
| Database  | PostgreSQL via Prisma ORM          |
| Hosting   | Vercel + Neon (free tier)          |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Docker Desktop (for local PostgreSQL) **or** a [Neon](https://neon.tech) account

### 1. Clone and install

```bash
git clone https://github.com/your-username/illustrator.git
cd illustrator
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env
```

Edit `.env` and fill in:

```bash
# Database - local Docker (see step 3) or Neon connection string
DATABASE_URL="postgresql://postgres:password@localhost:5432/illustrator?schema=public"

# NextAuth - required
NEXTAUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth - optional
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### 3. Start PostgreSQL

**Option A: Docker (local development)**

```bash
docker run --name illustrator-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=illustrator \
  -p 5432:5432 \
  -d postgres
```

**Option B: Neon (free cloud PostgreSQL)**

> On progress for configuartion.

### 4. Run database migrations

```bash
npx prisma migrate dev --name init
```

This creates all tables and generates the Prisma TypeScript client.

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Author

Developed by [Kim Charles](https://github.com/gh-kimcharles).
