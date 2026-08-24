/**
 * Paper size presets.
 *
 * Dimensions sourced from:
 *   - ISO 216 (A-series): A4, A5
 *   - ANSI: US Letter
 *   - Common photo print sizes: 4×6, 5×7
 */

import type { PaperPreset } from "@/lib/types";

export const paperPresets: PaperPreset[] = [
  {
    id: "a4",
    name: "A4",
    widthMm: 210,
    heightMm: 297,
    standard: "ISO 216",
  },
  {
    id: "a5",
    name: "A5",
    widthMm: 148,
    heightMm: 210,
    standard: "ISO 216",
  },
  {
    id: "letter",
    name: "US Letter",
    widthMm: 215.9,
    heightMm: 279.4,
    standard: "ANSI",
  },
  {
    id: "4x6",
    name: '4 × 6 in',
    widthMm: 101.6,
    heightMm: 152.4,
    standard: "common",
  },
  {
    id: "5x7",
    name: '5 × 7 in',
    widthMm: 127,
    heightMm: 177.8,
    standard: "common",
  },
];

/**
 * Get a paper preset by ID.
 */
export function getPaperPreset(id: string): PaperPreset | undefined {
  return paperPresets.find((p) => p.id === id);
}
