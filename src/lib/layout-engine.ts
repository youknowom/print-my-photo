/**
 * Layout engine — calculates how many photo copies fit on a given paper
 * and where each copy should be placed.
 *
 * This is the single source of truth for layout calculations. Both the
 * on-screen preview and the PDF/image export use this function so the
 * output always matches the preview.
 */

import type { ComputedLayout, LayoutConfig } from "./types";

/**
 * Calculate the grid layout for photos on paper.
 *
 * @returns A ComputedLayout with grid dimensions, offsets and copy counts.
 */
export function calculateLayout(config: LayoutConfig): ComputedLayout {
  const {
    photoWidthMm,
    photoHeightMm,
    paperWidthMm: rawPaperW,
    paperHeightMm: rawPaperH,
    copies,
    marginMm,
    gapMm,
    orientation,
    dpi: _dpi,
  } = config;

  // Apply orientation to paper
  const paperWidthMm =
    orientation === "landscape"
      ? Math.max(rawPaperW, rawPaperH)
      : Math.min(rawPaperW, rawPaperH);
  const paperHeightMm =
    orientation === "landscape"
      ? Math.min(rawPaperW, rawPaperH)
      : Math.max(rawPaperW, rawPaperH);

  // Usable area after margins
  const usableWidthMm = paperWidthMm - 2 * marginMm;
  const usableHeightMm = paperHeightMm - 2 * marginMm;

  if (usableWidthMm <= 0 || usableHeightMm <= 0) {
    return {
      columns: 0,
      rows: 0,
      maxCopies: 0,
      actualCopies: 0,
      usableWidthMm: Math.max(0, usableWidthMm),
      usableHeightMm: Math.max(0, usableHeightMm),
      offsetXMm: marginMm,
      offsetYMm: marginMm,
      paperWidthMm,
      paperHeightMm,
    };
  }

  // Calculate how many columns and rows fit.
  // First photo takes its full width/height; each additional photo adds
  // (gap + photoSize).
  const columns = Math.max(
    0,
    Math.floor((usableWidthMm + gapMm) / (photoWidthMm + gapMm)),
  );
  const rows = Math.max(
    0,
    Math.floor((usableHeightMm + gapMm) / (photoHeightMm + gapMm)),
  );

  const maxCopies = columns * rows;

  const actualCopies =
    copies === "max" ? maxCopies : Math.min(copies, maxCopies);

  // Calculate the actual width/height occupied by the grid
  const gridWidthMm =
    columns > 0 ? columns * photoWidthMm + (columns - 1) * gapMm : 0;
  const gridHeightMm =
    rows > 0 ? rows * photoHeightMm + (rows - 1) * gapMm : 0;

  // Centre the grid within the usable area
  const offsetXMm = marginMm + (usableWidthMm - gridWidthMm) / 2;
  const offsetYMm = marginMm + (usableHeightMm - gridHeightMm) / 2;

  return {
    columns,
    rows,
    maxCopies,
    actualCopies,
    usableWidthMm,
    usableHeightMm,
    offsetXMm,
    offsetYMm,
    paperWidthMm,
    paperHeightMm,
  };
}

/**
 * Returns the (x, y) position in mm for the nth copy (0-indexed).
 */
export function getCopyPosition(
  index: number,
  layout: ComputedLayout,
  photoWidthMm: number,
  photoHeightMm: number,
  gapMm: number,
): { xMm: number; yMm: number } {
  const col = index % layout.columns;
  const row = Math.floor(index / layout.columns);

  return {
    xMm: layout.offsetXMm + col * (photoWidthMm + gapMm),
    yMm: layout.offsetYMm + row * (photoHeightMm + gapMm),
  };
}
