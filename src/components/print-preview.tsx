"use client";

import { useRef, useEffect, useCallback } from "react";
import { calculateLayout, getCopyPosition } from "@/lib/layout-engine";
import type { LayoutConfig } from "@/lib/types";

interface PrintPreviewProps {
  croppedImageDataUrl: string | null;
  config: LayoutConfig;
  className?: string;
}

/**
 * Canvas-based print preview.
 * Uses the same layout engine as the PDF/image export
 * so the preview always matches the final output.
 */
export function PrintPreview({
  croppedImageDataUrl,
  config,
  className,
}: PrintPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const layout = calculateLayout(config);

    // Scale to fit container while maintaining paper aspect ratio
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const paperAspect = layout.paperWidthMm / layout.paperHeightMm;
    const containerAspect = containerWidth / containerHeight;

    let drawWidth: number;
    let drawHeight: number;

    if (paperAspect > containerAspect) {
      drawWidth = containerWidth;
      drawHeight = containerWidth / paperAspect;
    } else {
      drawHeight = containerHeight;
      drawWidth = containerHeight * paperAspect;
    }

    // Account for device pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(drawWidth * dpr);
    canvas.height = Math.round(drawHeight * dpr);
    canvas.style.width = `${drawWidth}px`;
    canvas.style.height = `${drawHeight}px`;
    ctx.scale(dpr, dpr);

    // Scale factor: pixels-on-screen per mm
    const scale = drawWidth / layout.paperWidthMm;

    // White paper background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, drawWidth, drawHeight);

    // Paper border
    ctx.strokeStyle = "#d4d4d8"; // zinc-300
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, drawWidth - 1, drawHeight - 1);

    // Margin guides (subtle dashed lines)
    const marginPx = config.marginMm * scale;
    ctx.strokeStyle = "#e4e4e7"; // zinc-200
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 0.5;
    ctx.strokeRect(
      marginPx,
      marginPx,
      drawWidth - 2 * marginPx,
      drawHeight - 2 * marginPx,
    );
    ctx.setLineDash([]);

    if (!croppedImageDataUrl || layout.actualCopies === 0) {
      // Empty state — show placeholder grid
      ctx.fillStyle = "#f4f4f5"; // zinc-100
      ctx.strokeStyle = "#d4d4d8";
      ctx.lineWidth = 0.5;

      for (let i = 0; i < layout.maxCopies; i++) {
        const { xMm, yMm } = getCopyPosition(
          i,
          layout,
          config.photoWidthMm,
          config.photoHeightMm,
          config.gapMm,
        );

        const x = xMm * scale;
        const y = yMm * scale;
        const w = config.photoWidthMm * scale;
        const h = config.photoHeightMm * scale;

        ctx.fillRect(x, y, w, h);
        ctx.strokeRect(x, y, w, h);
      }
      return;
    }

    // Draw photo copies
    const img = new Image();
    img.onload = () => {
      for (let i = 0; i < layout.actualCopies; i++) {
        const { xMm, yMm } = getCopyPosition(
          i,
          layout,
          config.photoWidthMm,
          config.photoHeightMm,
          config.gapMm,
        );

        const x = xMm * scale;
        const y = yMm * scale;
        const w = config.photoWidthMm * scale;
        const h = config.photoHeightMm * scale;

        ctx.drawImage(img, x, y, w, h);

        // Subtle border around each photo
        ctx.strokeStyle = "#d4d4d8";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x, y, w, h);
      }
    };
    img.src = croppedImageDataUrl;
  }, [croppedImageDataUrl, config]);

  useEffect(() => {
    draw();

    const handleResize = () => draw();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [draw]);

  return (
    <div
      ref={containerRef}
      className={`flex items-center justify-center bg-muted/30 rounded-lg border border-border p-4 ${className ?? ""}`}
    >
      <canvas
        ref={canvasRef}
        className="block max-w-full max-h-full"
        aria-label="Print layout preview showing how photos will be arranged on the paper"
      />
    </div>
  );
}
