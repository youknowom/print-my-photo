"use client";

import { useState, useCallback } from "react";
import { Download, FileImage, FileText, Printer, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { downloadPdf } from "@/lib/pdf-generator";
import { downloadImage } from "@/lib/image-exporter";
import type { LayoutConfig } from "@/lib/types";

interface ExportControlsProps {
  croppedImageDataUrl: string | null;
  config: LayoutConfig;
  photoName: string;
  paperName: string;
}

export function ExportControls({
  croppedImageDataUrl,
  config,
  photoName,
  paperName,
}: ExportControlsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const isDisabled = !croppedImageDataUrl || isExporting;

  const handlePdfExport = useCallback(async () => {
    if (!croppedImageDataUrl) return;

    setIsExporting(true);
    setExportError(null);

    try {
      downloadPdf({
        croppedImageDataUrl,
        config,
        photoName,
        paperName,
      });
    } catch (err) {
      setExportError(
        err instanceof Error
          ? err.message
          : "Could not create PDF. Try again with a smaller image.",
      );
    } finally {
      setIsExporting(false);
    }
  }, [croppedImageDataUrl, config, photoName, paperName]);

  const handleImageExport = useCallback(
    async (format: "jpg" | "png") => {
      if (!croppedImageDataUrl) return;

      setIsExporting(true);
      setExportError(null);

      try {
        await downloadImage({
          croppedImageDataUrl,
          config,
          format,
          quality: 0.92,
          photoName,
          paperName,
        });
      } catch (err) {
        setExportError(
          err instanceof Error
            ? err.message
            : "Could not create image. Try again with a smaller image.",
        );
      } finally {
        setIsExporting(false);
      }
    },
    [croppedImageDataUrl, config, photoName, paperName],
  );

  return (
    <div className="space-y-3">
      {/* Primary: PDF download */}
      <Button
        className="w-full"
        size="lg"
        disabled={isDisabled}
        onClick={handlePdfExport}
        id="export-pdf-button"
      >
        <Download className="w-4 h-4 mr-2" />
        {isExporting ? "Creating..." : "Download PDF"}
      </Button>

      {/* Secondary: Image download */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
          disabled={isDisabled}
          onClick={() => handleImageExport("jpg")}
        >
          <FileImage className="w-3.5 h-3.5 mr-1.5" />
          JPG
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
          disabled={isDisabled}
          onClick={() => handleImageExport("png")}
        >
          <FileText className="w-3.5 h-3.5 mr-1.5" />
          PNG
        </Button>
      </div>

      {/* Print instructions */}
      <Tooltip>
        <TooltipTrigger>
          <div className="flex items-start gap-2 p-2.5 rounded-md bg-muted/50 text-xs text-muted-foreground cursor-help text-left">
            <Printer className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <p>
              For exact dimensions, select <strong>&quot;Actual Size&quot;</strong> or{" "}
              <strong>100%</strong> in your printer settings. Avoid
              &quot;Fit to Page&quot; when physical dimensions matter.
            </p>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs text-xs">
          Different printers use different terminology. Look for &quot;Actual
          Size&quot;, &quot;100%&quot;, &quot;None&quot; (scaling), or &quot;No Scaling&quot; in
          your print dialog.
        </TooltipContent>
      </Tooltip>

      {/* Error display */}
      {exportError && (
        <div
          className="flex items-start gap-2 p-2.5 rounded-md bg-destructive/10 text-xs text-destructive"
          role="alert"
        >
          <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <p>{exportError}</p>
        </div>
      )}
    </div>
  );
}
