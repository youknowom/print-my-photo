"use client";

import { useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UploadZone } from "@/components/upload-zone";
import { CropEditor } from "@/components/crop-editor";
import { SettingsPanel } from "@/components/settings-panel";
import { PrintPreview } from "@/components/print-preview";
import { ExportControls } from "@/components/export-controls";
import { useEditorState } from "@/hooks/use-editor-state";
import { cropImage } from "@/lib/image-utils";
import { mmToPixels } from "@/lib/dimensions";
import type { CropArea } from "@/lib/types";

export function PhotoEditor() {
  const editor = useEditorState();
  const { state } = editor;

  const aspectRatio =
    editor.effectivePhotoWidthMm / editor.effectivePhotoHeightMm;

  // Handle crop completion — generate the cropped image
  const handleCropComplete = useCallback(
    async (area: CropArea) => {
      editor.setCropArea(area);

      if (!state.imageSrc) return;

      // Generate cropped image at 300 DPI
      const outputWidth = Math.round(
        mmToPixels(editor.effectivePhotoWidthMm, state.dpi),
      );
      const outputHeight = Math.round(
        mmToPixels(editor.effectivePhotoHeightMm, state.dpi),
      );

      try {
        const cropped = await cropImage(
          state.imageSrc,
          area,
          outputWidth,
          outputHeight,
        );
        editor.setCroppedImage(cropped);
      } catch {
        // Silently handle — user can retry
      }
    },
    [state.imageSrc, state.dpi, editor],
  );

  const layoutConfig = {
    photoWidthMm: editor.effectivePhotoWidthMm,
    photoHeightMm: editor.effectivePhotoHeightMm,
    paperWidthMm: state.selectedPaperPreset.widthMm,
    paperHeightMm: state.selectedPaperPreset.heightMm,
    copies: state.copies,
    marginMm: state.marginMm,
    gapMm: state.gapMm,
    orientation: state.orientation,
    dpi: state.dpi,
  };

  // Upload step
  if (state.currentStep === "upload") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight mb-2">
            Upload your photo
          </h1>
          <p className="text-sm text-muted-foreground max-w-md">
            Select a photo to begin. Your image stays in your browser and is
            never uploaded to any server.
          </p>
        </div>
        <UploadZone
          onFileSelected={editor.handleFile}
          error={state.uploadError}
        />
      </div>
    );
  }

  // Edit step — main editor layout
  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">
      {/* Left column — Preview & Crop */}
      <div className="flex-1 min-w-0 space-y-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={editor.startOver}
            className="text-xs text-muted-foreground"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            New photo
          </Button>
          <span className="text-xs text-muted-foreground">
            {state.imageWidth} × {state.imageHeight} px
          </span>
        </div>

        {/* Crop editor */}
        {state.imageSrc && (
          <CropEditor
            imageSrc={state.imageSrc}
            aspectRatio={aspectRatio}
            zoom={state.zoom}
            rotation={state.rotation}
            onZoomChange={editor.setZoom}
            onRotationChange={editor.setRotation}
            onCropComplete={handleCropComplete}
            onReset={editor.resetCrop}
          />
        )}

        {/* Print preview */}
        <div>
          <h2 className="text-sm font-medium mb-2">Print Preview</h2>
          <PrintPreview
            croppedImageDataUrl={state.croppedImageDataUrl}
            config={layoutConfig}
            className="h-64 sm:h-80"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            This preview shows how photos will be arranged on {state.selectedPaperPreset.name} paper.
          </p>
        </div>
      </div>

      {/* Right column — Settings & Export */}
      <div className="w-full lg:w-80 xl:w-96 shrink-0">
        <div className="sticky top-20 space-y-5">
          <h2 className="text-sm font-medium">Settings</h2>

          <SettingsPanel
            selectedPhotoPreset={state.selectedPhotoPreset}
            useCustomSize={state.useCustomSize}
            customWidthMm={state.customWidthMm}
            customHeightMm={state.customHeightMm}
            onPhotoPresetChange={editor.setPhotoPreset}
            onCustomSizeChange={editor.setCustomSize}
            selectedPaperPreset={state.selectedPaperPreset}
            onPaperPresetChange={editor.setPaperPreset}
            copies={state.copies}
            marginMm={state.marginMm}
            gapMm={state.gapMm}
            orientation={state.orientation}
            onCopiesChange={editor.setCopies}
            onMarginChange={editor.setMargin}
            onGapChange={editor.setGap}
            onOrientationChange={editor.setOrientation}
            effectivePhotoWidthMm={editor.effectivePhotoWidthMm}
            effectivePhotoHeightMm={editor.effectivePhotoHeightMm}
            dpi={state.dpi}
            hasImage={!!state.imageSrc}
          />

          <Separator />

          <ExportControls
            croppedImageDataUrl={state.croppedImageDataUrl}
            config={layoutConfig}
            photoName={editor.effectivePhotoName}
            paperName={state.selectedPaperPreset.name}
          />
        </div>
      </div>
    </div>
  );
}
