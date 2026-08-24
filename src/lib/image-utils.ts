/**
 * Image validation and utility functions.
 *
 * Handles file validation, safe image loading, and canvas operations.
 * Designed to protect the browser from malicious or oversized images.
 */

const ACCEPTED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const ACCEPTED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

/** Maximum file size: 50 MB */
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;

/** Maximum source dimension (width or height) */
const MAX_DIMENSION = 8000;

/** Maximum total pixels (width × height) — conservative for Safari */
const MAX_TOTAL_PIXELS = 16_000_000;

import type { ImageValidationResult, CropArea } from "./types";

/**
 * Validate an image file before loading.
 */
export function validateImageFile(file: File): ImageValidationResult {
  // Check MIME type
  if (!ACCEPTED_TYPES.has(file.type)) {
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!ACCEPTED_EXTENSIONS.has(ext)) {
      return {
        valid: false,
        error:
          "That image format is not supported. Please use JPG, PNG, or WebP.",
        sizeBytes: file.size,
      };
    }
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `This file is too large (${Math.round(file.size / 1024 / 1024)} MB). Maximum supported size is 50 MB.`,
      sizeBytes: file.size,
    };
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: "This file appears to be empty.",
      sizeBytes: 0,
    };
  }

  return { valid: true, sizeBytes: file.size };
}

/**
 * Load an image from a File and validate its dimensions.
 * Returns a promise that resolves to the loaded HTMLImageElement.
 */
export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);

    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);

      if (img.width === 0 || img.height === 0) {
        reject(new Error("This image appears to be corrupt or has zero dimensions."));
        return;
      }

      if (img.width > MAX_DIMENSION || img.height > MAX_DIMENSION) {
        reject(
          new Error(
            `This image is too large (${img.width} × ${img.height} px). Maximum supported dimension is ${MAX_DIMENSION} px per side.`,
          ),
        );
        return;
      }

      if (img.width * img.height > MAX_TOTAL_PIXELS) {
        reject(
          new Error(
            "This image has too many pixels to process reliably in your browser. Try a smaller image.",
          ),
        );
        return;
      }

      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not load this image. The file may be corrupt."));
    };

    img.src = url;
  });
}

/**
 * Create a cropped image from a source image and crop area.
 * Returns a data URL of the cropped image.
 */
export function cropImage(
  imageSrc: string,
  cropArea: CropArea,
  outputWidth: number,
  outputHeight: number,
  format: "image/jpeg" | "image/png" = "image/jpeg",
  quality: number = 0.95,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = outputWidth;
      canvas.height = outputHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not create canvas context."));
        return;
      }

      ctx.drawImage(
        img,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        outputWidth,
        outputHeight,
      );

      const dataUrl = canvas.toDataURL(format, quality);

      // Clean up
      canvas.width = 0;
      canvas.height = 0;

      resolve(dataUrl);
    };

    img.onerror = () => {
      reject(new Error("Could not load image for cropping."));
    };

    img.src = imageSrc;
  });
}

/**
 * Create an object URL and track it for cleanup.
 */
export function createSafeObjectUrl(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revoke an object URL to free memory.
 */
export function revokeSafeObjectUrl(url: string): void {
  try {
    URL.revokeObjectURL(url);
  } catch {
    // Silently ignore — URL may have already been revoked
  }
}

/**
 * Generate a meaningful filename for exports.
 */
export function generateExportFilename(
  photoName: string,
  paperName: string,
  format: "pdf" | "jpg" | "png",
): string {
  const sanitized = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const photoSlug = sanitized(photoName);
  const paperSlug = sanitized(paperName);

  return `${photoSlug}-${paperSlug}-photo-sheet.${format}`;
}
