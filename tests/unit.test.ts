import { describe, it, expect } from "vitest";
import {
  mmToInches,
  inchesToMm,
  mmToCm,
  cmToMm,
  mmToPixels,
  pixelsToMm,
  inchesToPixels,
  pixelsToInches,
  formatDimensionsMm,
  formatDimensionsInches,
  DEFAULT_DPI,
  MM_PER_INCH,
  MM_PER_CM,
} from "@/lib/dimensions";
import { calculateLayout, getCopyPosition } from "@/lib/layout-engine";
import { photoPresets, getVerifiedPresets, getStandardPresets } from "@/data/photo-presets";
import { paperPresets, getPaperPreset } from "@/data/paper-presets";

describe("Dimensions utilities", () => {
  it("converts mm to inches and back accurately", () => {
    expect(mmToInches(25.4)).toBeCloseTo(1.0, 5);
    expect(inchesToMm(1.0)).toBeCloseTo(25.4, 5);
    expect(inchesToMm(2.0)).toBeCloseTo(50.8, 5);
    expect(mmToInches(50.8)).toBeCloseTo(2.0, 5);
  });

  it("converts mm to cm and back", () => {
    expect(mmToCm(35)).toBe(3.5);
    expect(cmToMm(4.5)).toBe(45);
  });

  it("converts mm to pixels at 300 DPI", () => {
    // 25.4 mm = 1 inch = 300 px at 300 DPI
    expect(mmToPixels(25.4, 300)).toBeCloseTo(300, 5);
    expect(pixelsToMm(300, 300)).toBeCloseTo(25.4, 5);

    // 51 mm (2 inch) at 300 DPI ≈ 602.36 px
    expect(mmToPixels(51, 300)).toBeCloseTo((51 / 25.4) * 300, 2);
  });

  it("converts inches to pixels", () => {
    expect(inchesToPixels(2, 300)).toBe(600);
    expect(pixelsToInches(600, 300)).toBe(2);
  });

  it("formats dimensions strings properly", () => {
    expect(formatDimensionsMm(35, 45)).toBe("35 × 45 mm");
    expect(formatDimensionsInches(2, 2)).toBe("2 × 2 in");
  });
});

describe("Layout Engine", () => {
  it("calculates 35x45mm photos on A4 paper (210x297mm)", () => {
    const layout = calculateLayout({
      photoWidthMm: 35,
      photoHeightMm: 45,
      paperWidthMm: 210,
      paperHeightMm: 297,
      copies: "max",
      marginMm: 5,
      gapMm: 2,
      orientation: "portrait",
      dpi: 300,
    });

    // Usable width = 210 - 10 = 200mm
    // (200 + 2) / (35 + 2) = 202 / 37 = 5.45 => 5 columns
    // Usable height = 297 - 10 = 287mm
    // (287 + 2) / (45 + 2) = 289 / 47 = 6.14 => 6 rows
    expect(layout.columns).toBe(5);
    expect(layout.rows).toBe(6);
    expect(layout.maxCopies).toBe(30);
    expect(layout.actualCopies).toBe(30);
    expect(layout.offsetXMm).toBeGreaterThanOrEqual(5);
    expect(layout.offsetYMm).toBeGreaterThanOrEqual(5);
  });

  it("calculates 2x2 in (51x51mm) photos on 4x6 in paper (101.6x152.4mm)", () => {
    const layout = calculateLayout({
      photoWidthMm: 51,
      photoHeightMm: 51,
      paperWidthMm: 101.6,
      paperHeightMm: 152.4,
      copies: "max",
      marginMm: 5,
      gapMm: 2,
      orientation: "portrait",
      dpi: 300,
    });

    // Usable width = 101.6 - 10 = 91.6mm
    // (91.6 + 2) / (51 + 2) = 93.6 / 53 = 1 column
    // Usable height = 152.4 - 10 = 142.4mm
    // (142.4 + 2) / (51 + 2) = 144.4 / 53 = 2 rows
    expect(layout.columns).toBe(1);
    expect(layout.rows).toBe(2);
    expect(layout.maxCopies).toBe(2);
  });

  it("handles custom copy counts less than maximum", () => {
    const layout = calculateLayout({
      photoWidthMm: 35,
      photoHeightMm: 45,
      paperWidthMm: 210,
      paperHeightMm: 297,
      copies: 4,
      marginMm: 5,
      gapMm: 2,
      orientation: "portrait",
      dpi: 300,
    });

    expect(layout.maxCopies).toBe(30);
    expect(layout.actualCopies).toBe(4);
  });

  it("calculates positions for individual copies correctly", () => {
    const layout = calculateLayout({
      photoWidthMm: 35,
      photoHeightMm: 45,
      paperWidthMm: 210,
      paperHeightMm: 297,
      copies: 6,
      marginMm: 5,
      gapMm: 2,
      orientation: "portrait",
      dpi: 300,
    });

    const pos0 = getCopyPosition(0, layout, 35, 45, 2);
    expect(pos0.xMm).toBeCloseTo(layout.offsetXMm, 4);
    expect(pos0.yMm).toBeCloseTo(layout.offsetYMm, 4);

    const pos1 = getCopyPosition(1, layout, 35, 45, 2);
    expect(pos1.xMm).toBeCloseTo(layout.offsetXMm + 37, 4);
    expect(pos1.yMm).toBeCloseTo(layout.offsetYMm, 4);
  });

  it("handles zero or negative usable area gracefully", () => {
    const layout = calculateLayout({
      photoWidthMm: 100,
      photoHeightMm: 100,
      paperWidthMm: 50,
      paperHeightMm: 50,
      copies: "max",
      marginMm: 30, // margin exceeds paper
      gapMm: 2,
      orientation: "portrait",
      dpi: 300,
    });

    expect(layout.maxCopies).toBe(0);
    expect(layout.actualCopies).toBe(0);
    expect(layout.columns).toBe(0);
    expect(layout.rows).toBe(0);
  });
});

describe("Data Integrity & Provenance", () => {
  it("all VERIFIED photo presets have authoritative sources and verification dates", () => {
    const verified = getVerifiedPresets();
    expect(verified.length).toBeGreaterThanOrEqual(5);

    for (const preset of verified) {
      expect(preset.evidenceState).toBe("VERIFIED");
      expect(preset.sourceName).toBeDefined();
      expect(preset.sourceName?.length).toBeGreaterThan(0);
      expect(preset.verifiedAt).toBeDefined();
      expect(preset.widthMm).toBeGreaterThan(0);
      expect(preset.heightMm).toBeGreaterThan(0);
    }
  });

  it("all paper presets follow standard physical dimensions", () => {
    const a4 = getPaperPreset("a4");
    expect(a4).toBeDefined();
    expect(a4?.widthMm).toBe(210);
    expect(a4?.heightMm).toBe(297);

    const a5 = getPaperPreset("a5");
    expect(a5).toBeDefined();
    expect(a5?.widthMm).toBe(148);
    expect(a5?.heightMm).toBe(210);

    const letter = getPaperPreset("letter");
    expect(letter).toBeDefined();
    expect(letter?.widthMm).toBeCloseTo(215.9, 1);
    expect(letter?.heightMm).toBeCloseTo(279.4, 1);
  });
});
