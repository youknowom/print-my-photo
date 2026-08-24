/**
 * PDF generator using jsPDF.
 *
 * Creates PDFs with exact physical page dimensions and precisely placed
 * photo copies. Uses the same layout calculations as the preview canvas
 * to guarantee output matches what the user sees.
 */

import { jsPDF } from "jspdf";
import { calculateLayout, getCopyPosition } from "./layout-engine";
import { generateExportFilename } from "./image-utils";
import type { LayoutConfig } from "./types";

interface PdfGenerateOptions {
  /** The cropped photo as a data URL (base64 JPEG or PNG) */
  croppedImageDataUrl: string;
  /** Layout configuration */
  config: LayoutConfig;
  /** Photo preset name (for filename) */
  photoName: string;
  /** Paper preset name (for filename) */
  paperName: string;
}

/**
 * Generate a PDF with the photo grid layout.
 * Returns the PDF as a Blob.
 */
export function generatePdf(options: PdfGenerateOptions): Blob {
  const { croppedImageDataUrl, config, photoName, paperName } = options;

  const layout = calculateLayout(config);

  if (layout.actualCopies === 0) {
    throw new Error(
      "No copies fit on the selected paper with the current settings. Try reducing margins or choosing a larger paper size.",
    );
  }

  // Create PDF with exact paper dimensions in mm
  const pdf = new jsPDF({
    orientation: layout.paperWidthMm > layout.paperHeightMm ? "landscape" : "portrait",
    unit: "mm",
    format: [layout.paperWidthMm, layout.paperHeightMm],
  });

  // Determine image format from data URL
  const imageFormat = croppedImageDataUrl.startsWith("data:image/png")
    ? "PNG"
    : "JPEG";

  // Place each copy at the calculated position
  for (let i = 0; i < layout.actualCopies; i++) {
    const { xMm, yMm } = getCopyPosition(
      i,
      layout,
      config.photoWidthMm,
      config.photoHeightMm,
      config.gapMm,
    );

    pdf.addImage(
      croppedImageDataUrl,
      imageFormat,
      xMm,
      yMm,
      config.photoWidthMm,
      config.photoHeightMm,
    );
  }

  return pdf.output("blob");
}

/**
 * Generate a PDF and trigger a download.
 */
export function downloadPdf(options: PdfGenerateOptions): void {
  const blob = generatePdf(options);
  const filename = generateExportFilename(
    options.photoName,
    options.paperName,
    "pdf",
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
