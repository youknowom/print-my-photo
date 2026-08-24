/**
 * Image exporter — generates a raster image (JPG/PNG) of the photo grid
 * at the target DPI using the HTML Canvas API.
 */

import { calculateLayout, getCopyPosition } from "./layout-engine";
import { mmToPixels } from "./dimensions";
import { generateExportFilename } from "./image-utils";
import type { LayoutConfig } from "./types";

interface ImageExportOptions {
  /** The cropped photo as a data URL */
  croppedImageDataUrl: string;
  /** Layout configuration */
  config: LayoutConfig;
  /** Output format */
  format: "jpg" | "png";
  /** JPEG quality 0-1 (ignored for PNG) */
  quality?: number;
  /** Photo preset name (for filename) */
  photoName: string;
  /** Paper preset name (for filename) */
  paperName: string;
}

/**
 * Generate a raster image of the photo grid and trigger download.
 */
export async function downloadImage(
  options: ImageExportOptions,
): Promise<void> {
  const {
    croppedImageDataUrl,
    config,
    format,
    quality = 0.92,
    photoName,
    paperName,
  } = options;

  const layout = calculateLayout(config);

  if (layout.actualCopies === 0) {
    throw new Error(
      "No copies fit on the selected paper with the current settings.",
    );
  }

  const dpi = config.dpi;

  // Canvas dimensions in pixels at target DPI
  const canvasW = Math.round(mmToPixels(layout.paperWidthMm, dpi));
  const canvasH = Math.round(mmToPixels(layout.paperHeightMm, dpi));

  const canvas = document.createElement("canvas");
  canvas.width = canvasW;
  canvas.height = canvasH;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create canvas context for export.");

  // White background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvasW, canvasH);

  // Load the cropped image
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error("Could not load image for export."));
    i.src = croppedImageDataUrl;
  });

  // Photo dimensions in pixels
  const photoW = Math.round(mmToPixels(config.photoWidthMm, dpi));
  const photoH = Math.round(mmToPixels(config.photoHeightMm, dpi));

  // Place each copy
  for (let i = 0; i < layout.actualCopies; i++) {
    const { xMm, yMm } = getCopyPosition(
      i,
      layout,
      config.photoWidthMm,
      config.photoHeightMm,
      config.gapMm,
    );

    const xPx = Math.round(mmToPixels(xMm, dpi));
    const yPx = Math.round(mmToPixels(yMm, dpi));

    ctx.drawImage(img, xPx, yPx, photoW, photoH);
  }

  // Export
  const mimeType = format === "png" ? "image/png" : "image/jpeg";
  const dataUrl = canvas.toDataURL(mimeType, quality);

  // Clean up canvas
  canvas.width = 0;
  canvas.height = 0;

  // Trigger download
  const filename = generateExportFilename(photoName, paperName, format);
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
