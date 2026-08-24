"use client";

import { useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";
import { RotateCcw, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import type { CropArea } from "@/lib/types";

interface CropEditorProps {
  imageSrc: string;
  aspectRatio: number;
  zoom: number;
  rotation: number;
  onZoomChange: (zoom: number) => void;
  onRotationChange: (rotation: number) => void;
  onCropComplete: (area: CropArea) => void;
  onReset: () => void;
}

export function CropEditor({
  imageSrc,
  aspectRatio,
  zoom,
  rotation,
  onZoomChange,
  onRotationChange,
  onCropComplete,
  onReset,
}: CropEditorProps) {
  const handleCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      onCropComplete({
        x: croppedAreaPixels.x,
        y: croppedAreaPixels.y,
        width: croppedAreaPixels.width,
        height: croppedAreaPixels.height,
      });
    },
    [onCropComplete],
  );

  return (
    <div className="flex flex-col gap-3">
      {/* Crop area */}
      <div className="relative w-full aspect-[4/3] bg-muted/30 rounded-lg overflow-hidden border border-border">
        <Cropper
          image={imageSrc}
          crop={{ x: 0, y: 0 } as Point}
          zoom={zoom}
          rotation={rotation}
          aspect={aspectRatio}
          onCropChange={() => {
            // react-easy-crop handles position internally
          }}
          onCropComplete={handleCropComplete}
          onZoomChange={onZoomChange}
          onRotationChange={onRotationChange}
          showGrid={true}
          style={{
            containerStyle: {
              borderRadius: "0.5rem",
            },
          }}
        />
      </div>

      {/* Controls */}
      <div className="space-y-3">
        {/* Zoom */}
        <div className="flex items-center gap-3">
          <ZoomOut className="w-4 h-4 text-muted-foreground shrink-0" />
          <Slider
            value={[zoom]}
            onValueChange={(val) => {
              const v = Array.isArray(val) ? val[0] : val;
              onZoomChange(v);
            }}
            min={1}
            max={3}
            step={0.01}
            aria-label="Zoom level"
            className="flex-1"
          />
          <ZoomIn className="w-4 h-4 text-muted-foreground shrink-0" />
        </div>

        {/* Rotation */}
        <div className="flex items-center gap-3">
          <RotateCcw className="w-4 h-4 text-muted-foreground shrink-0" />
          <Slider
            value={[rotation]}
            onValueChange={(val) => {
              const v = Array.isArray(val) ? val[0] : val;
              onRotationChange(v);
            }}
            min={-180}
            max={180}
            step={1}
            aria-label="Rotation angle"
            className="flex-1"
          />
          <RotateCw className="w-4 h-4 text-muted-foreground shrink-0" />
        </div>

        {/* Reset */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
