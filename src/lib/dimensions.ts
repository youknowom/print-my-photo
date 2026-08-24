/**
 * Dimension conversion utilities.
 *
 * Internal unit: millimetres (mm).
 * All conversions funnel through mm so we maintain a single source of truth
 * for the conversion factors.
 */

/** 1 inch = 25.4 mm (exact, by definition) */
const MM_PER_INCH = 25.4;

/** 1 cm = 10 mm */
const MM_PER_CM = 10;

// ── mm ↔ inches ────────────────────────────────────────────────────────

export function mmToInches(mm: number): number {
  return mm / MM_PER_INCH;
}

export function inchesToMm(inches: number): number {
  return inches * MM_PER_INCH;
}

// ── mm ↔ cm ────────────────────────────────────────────────────────────

export function mmToCm(mm: number): number {
  return mm / MM_PER_CM;
}

export function cmToMm(cm: number): number {
  return cm * MM_PER_CM;
}

// ── mm ↔ pixels (DPI-dependent) ────────────────────────────────────────

export function mmToPixels(mm: number, dpi: number): number {
  return (mm / MM_PER_INCH) * dpi;
}

export function pixelsToMm(px: number, dpi: number): number {
  return (px / dpi) * MM_PER_INCH;
}

// ── inches ↔ pixels ────────────────────────────────────────────────────

export function inchesToPixels(inches: number, dpi: number): number {
  return inches * dpi;
}

export function pixelsToInches(px: number, dpi: number): number {
  return px / dpi;
}

// ── Display formatting ─────────────────────────────────────────────────

/**
 * Formats a dimension in mm to a readable string.
 * Example: formatMm(35, 45) → "35 × 45 mm"
 */
export function formatDimensionsMm(widthMm: number, heightMm: number): string {
  return `${widthMm} × ${heightMm} mm`;
}

/**
 * Formats a dimension in inches to a readable string.
 * Example: formatDimensionsInches(2, 2) → "2 × 2 in"
 */
export function formatDimensionsInches(
  widthIn: number,
  heightIn: number,
): string {
  return `${widthIn} × ${heightIn} in`;
}

// ── Constants ──────────────────────────────────────────────────────────

export const DEFAULT_DPI = 300;
export { MM_PER_INCH, MM_PER_CM };
