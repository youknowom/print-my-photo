# Print My Photo

Print My Photo is a browser-first utility that helps users prepare photographs for printing at an exact physical size and arrange multiple copies on a printable sheet.

## Features

- **Exact Dimensions**: Prepare photos at verified official sizes (e.g. 35×45 mm, 2×2 in, 50×70 mm) or any custom dimensions.
- **Client-Side Processing**: All cropping, canvas rendering, grid calculation, and PDF generation happen in the user's browser. No photos are uploaded to any server.
- **Smart Layout Engine**: Calculates rows, columns, and maximum fitting copies on standard paper sizes (A4, A5, US Letter, 4×6 in, 5×7 in) with adjustable margins and spacing.
- **Dual Export Modes**: Download a vector-positioned PDF with physical page dimensions or raster images (JPG/PNG) at 300 DPI.
- **WYSIWYG Print Preview**: The exact same layout calculation engine powers the on-screen preview, PDF generator, and image exporter.
- **No Registration**: Immediate utility access with zero account creation or onboarding barriers.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4 + Base UI / shadcn
- **Icons**: Lucide React
- **Image Cropping**: `react-easy-crop`
- **PDF Generation**: `jspdf`
- **Testing**: `vitest`

## Architecture & Privacy Model

This application intentionally uses **no image-processing backend**.

```
Client-Side Processing Pipeline
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐
│ Image File   │ ──> │ Canvas Crop  │ ──> │ Layout Engine    │ ──> │ jsPDF / Canvas   │
│ (User device)│     │ (HTML Canvas)│     │ (Exact mm grid)  │     │ (Download File)  │
└──────────────┘     └──────────────┘     └──────────────────┘     └──────────────────┘
```

1. **Local Object URLs**: Images loaded into memory use temporary `blob:` URLs that are revoked upon session reset.
2. **Zero Uploads**: Images are never sent over the network.
3. **No External Fonts/Trackers**: Typography is self-hosted via `next/font`, eliminating third-party analytics or external requests.

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run unit tests
npm test

# Run TypeScript typecheck
npm run typecheck

# Run linter
npm run lint

# Build for production
npm run build
```

## Verified Preset Provenance

| Preset | Dimensions | Source Authority | Verification Date |
| --- | --- | --- | --- |
| **US Passport** | 51 × 51 mm (2×2 in) | U.S. Department of State | 2026-08-24 |
| **UK Passport** | 35 × 45 mm | GOV.UK | 2026-08-24 |
| **India Passport** | 35 × 45 mm | Passport Seva, Govt of India | 2026-08-24 |
| **Canada Passport** | 50 × 70 mm | Government of Canada | 2026-08-24 |
| **Schengen Visa** | 35 × 45 mm | EU Schengen Regulations | 2026-08-24 |
| **Japan Passport** | 35 × 45 mm | Ministry of Foreign Affairs of Japan | 2026-08-24 |

## Future Roadmap

- [ ] Batch multi-photo sheet arrangements
- [ ] Direct Web Share API support on mobile devices
- [ ] ICC colour profile support for professional photography workflows
