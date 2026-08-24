/**
 * Core domain types for Print My Photo.
 */

// ── Evidence system ────────────────────────────────────────────────────

export type EvidenceState =
  | "VERIFIED"
  | "USER_CONFIGURABLE"
  | "EXAMPLE"
  | "UNKNOWN";

// ── Photo presets ──────────────────────────────────────────────────────

export type PhotoPresetCategory =
  | "passport"
  | "visa"
  | "id"
  | "standard"
  | "custom";

export interface PhotoPreset {
  id: string;
  name: string;
  category: PhotoPresetCategory;
  country?: string;
  purpose?: string;
  widthMm: number;
  heightMm: number;
  sourceUrl?: string;
  sourceName?: string;
  verifiedAt?: string;
  evidenceState: EvidenceState;
  notes?: string;
}

// ── Paper presets ──────────────────────────────────────────────────────

export type PaperStandard = "ISO 216" | "ANSI" | "common";

export interface PaperPreset {
  id: string;
  name: string;
  widthMm: number;
  heightMm: number;
  standard: PaperStandard;
}

// ── Layout configuration ───────────────────────────────────────────────

export type Orientation = "portrait" | "landscape";

export interface LayoutConfig {
  photoWidthMm: number;
  photoHeightMm: number;
  paperWidthMm: number;
  paperHeightMm: number;
  copies: number | "max";
  marginMm: number;
  gapMm: number;
  orientation: Orientation;
  dpi: number;
}

// ── Computed layout ────────────────────────────────────────────────────

export interface ComputedLayout {
  columns: number;
  rows: number;
  maxCopies: number;
  actualCopies: number;
  usableWidthMm: number;
  usableHeightMm: number;
  /** Horizontal offset to centre the grid on the page */
  offsetXMm: number;
  /** Vertical offset to centre the grid on the page */
  offsetYMm: number;
  /** Effective paper width (after applying orientation) */
  paperWidthMm: number;
  /** Effective paper height (after applying orientation) */
  paperHeightMm: number;
}

// ── Crop data ──────────────────────────────────────────────────────────

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

// ── Image validation ───────────────────────────────────────────────────

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
  width?: number;
  height?: number;
  type?: string;
  sizeBytes?: number;
}

// ── Export options ──────────────────────────────────────────────────────

export type ExportFormat = "pdf" | "jpg" | "png";

export interface ExportOptions {
  format: ExportFormat;
  dpi: number;
  quality: number; // 0-1, for JPEG
}
