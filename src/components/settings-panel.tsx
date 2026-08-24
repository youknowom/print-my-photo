"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { photoPresets, getVerifiedPresets, getStandardPresets } from "@/data/photo-presets";
import { paperPresets } from "@/data/paper-presets";
import { calculateLayout } from "@/lib/layout-engine";
import { formatDimensionsMm } from "@/lib/dimensions";
import type { PhotoPreset, PaperPreset, Orientation } from "@/lib/types";

interface SettingsPanelProps {
  selectedPhotoPreset: PhotoPreset;
  useCustomSize: boolean;
  customWidthMm: number;
  customHeightMm: number;
  onPhotoPresetChange: (preset: PhotoPreset) => void;
  onCustomSizeChange: (widthMm: number, heightMm: number) => void;
  selectedPaperPreset: PaperPreset;
  onPaperPresetChange: (preset: PaperPreset) => void;
  copies: number | "max";
  marginMm: number;
  gapMm: number;
  orientation: Orientation;
  onCopiesChange: (copies: number | "max") => void;
  onMarginChange: (marginMm: number) => void;
  onGapChange: (gapMm: number) => void;
  onOrientationChange: (orientation: Orientation) => void;
  effectivePhotoWidthMm: number;
  effectivePhotoHeightMm: number;
  dpi: number;
  hasImage: boolean;
}

export function SettingsPanel({
  selectedPhotoPreset,
  useCustomSize,
  customWidthMm,
  customHeightMm,
  onPhotoPresetChange,
  onCustomSizeChange,
  selectedPaperPreset,
  onPaperPresetChange,
  copies,
  marginMm,
  gapMm,
  orientation,
  onCopiesChange,
  onMarginChange,
  onGapChange,
  onOrientationChange,
  effectivePhotoWidthMm,
  effectivePhotoHeightMm,
  dpi,
  hasImage,
}: SettingsPanelProps) {
  const [showCustom, setShowCustom] = useState(useCustomSize);

  const verifiedPresets = getVerifiedPresets();
  const standardPresets = getStandardPresets();

  const layout = calculateLayout({
    photoWidthMm: effectivePhotoWidthMm,
    photoHeightMm: effectivePhotoHeightMm,
    paperWidthMm: selectedPaperPreset.widthMm,
    paperHeightMm: selectedPaperPreset.heightMm,
    copies: "max",
    marginMm,
    gapMm,
    orientation,
    dpi,
  });

  return (
    <div className="space-y-5">
      {/* ── Photo Size ──────────────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-2 mb-2.5">
          <Label className="text-sm font-medium">Photo Size</Label>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs text-xs">
              <p>Select a preset or enter custom dimensions. Verified presets show dimensions from official government sources.</p>
              <p className="mt-1 text-muted-foreground">Always verify current requirements with the relevant authority before submission.</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Select
          value={showCustom ? "custom" : selectedPhotoPreset.id}
          onValueChange={(value) => {
            if (value === "custom") {
              setShowCustom(true);
              onCustomSizeChange(customWidthMm, customHeightMm);
            } else {
              setShowCustom(false);
              const preset = photoPresets.find((p) => p.id === value);
              if (preset) onPhotoPresetChange(preset);
            }
          }}
        >
          <SelectTrigger id="photo-size-select" className="w-full">
            <SelectValue placeholder="Select photo size" />
          </SelectTrigger>
          <SelectContent>
            <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
              Official sizes (verified)
            </div>
            {verifiedPresets.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                <span>{p.name}</span>
                <span className="ml-2 text-muted-foreground">
                  {formatDimensionsMm(p.widthMm, p.heightMm)}
                </span>
              </SelectItem>
            ))}

            <Separator className="my-1" />

            <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
              Standard sizes
            </div>
            {standardPresets.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                <span>{p.name}</span>
                <span className="ml-2 text-muted-foreground">
                  {formatDimensionsMm(p.widthMm, p.heightMm)}
                </span>
              </SelectItem>
            ))}

            <Separator className="my-1" />

            <SelectItem value="custom">Custom size</SelectItem>
          </SelectContent>
        </Select>

        {showCustom && (
          <div className="flex gap-2 mt-2">
            <div className="flex-1">
              <Label htmlFor="custom-width" className="text-xs text-muted-foreground">
                Width (mm)
              </Label>
              <Input
                id="custom-width"
                type="number"
                min={10}
                max={300}
                value={customWidthMm}
                onChange={(e) =>
                  onCustomSizeChange(
                    Math.max(10, Math.min(300, Number(e.target.value) || 10)),
                    customHeightMm,
                  )
                }
                className="mt-1"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="custom-height" className="text-xs text-muted-foreground">
                Height (mm)
              </Label>
              <Input
                id="custom-height"
                type="number"
                min={10}
                max={300}
                value={customHeightMm}
                onChange={(e) =>
                  onCustomSizeChange(
                    customWidthMm,
                    Math.max(10, Math.min(300, Number(e.target.value) || 10)),
                  )
                }
                className="mt-1"
              />
            </div>
          </div>
        )}

        {!showCustom && selectedPhotoPreset.evidenceState === "VERIFIED" && (
          <p className="mt-1.5 text-xs text-muted-foreground">
            Source: {selectedPhotoPreset.sourceName}
          </p>
        )}
      </section>

      <Separator />

      {/* ── Paper Size ──────────────────────────────────────────── */}
      <section>
        <Label className="text-sm font-medium mb-2.5 block">Paper Size</Label>
        <Select
          value={selectedPaperPreset.id}
          onValueChange={(value) => {
            const preset = paperPresets.find((p) => p.id === value);
            if (preset) onPaperPresetChange(preset);
          }}
        >
          <SelectTrigger id="paper-size-select" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {paperPresets.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                <span>{p.name}</span>
                <span className="ml-2 text-muted-foreground">
                  {formatDimensionsMm(p.widthMm, p.heightMm)}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      <Separator />

      {/* ── Copies ──────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-2.5">
          <Label className="text-sm font-medium">Copies</Label>
          <span className="text-xs text-muted-foreground">
            Max: {layout.maxCopies}
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            variant={copies === "max" ? "default" : "outline"}
            size="sm"
            onClick={() => onCopiesChange("max")}
            className="text-xs"
          >
            Maximum ({layout.maxCopies})
          </Button>
          <div className="flex items-center gap-1.5 flex-1">
            <Input
              type="number"
              min={1}
              max={layout.maxCopies}
              value={copies === "max" ? layout.maxCopies : copies}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val > 0) onCopiesChange(Math.min(val, layout.maxCopies));
              }}
              className="w-20"
              aria-label="Number of copies"
            />
          </div>
        </div>
      </section>

      <Separator />

      {/* ── Margins & Gaps ──────────────────────────────────────── */}
      <section>
        <Label className="text-sm font-medium mb-2.5 block">Margins & Spacing</Label>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Page margin</span>
              <span className="text-xs tabular-nums">{marginMm} mm</span>
            </div>
            <Slider
              value={[marginMm]}
              onValueChange={(val) => {
                const v = Array.isArray(val) ? val[0] : val;
                onMarginChange(v);
              }}
              min={0}
              max={25}
              step={1}
              aria-label="Page margin in millimeters"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Gap between photos</span>
              <span className="text-xs tabular-nums">{gapMm} mm</span>
            </div>
            <Slider
              value={[gapMm]}
              onValueChange={(val) => {
                const v = Array.isArray(val) ? val[0] : val;
                onGapChange(v);
              }}
              min={0}
              max={15}
              step={1}
              aria-label="Gap between photos in millimeters"
            />
          </div>
        </div>
      </section>

      <Separator />

      {/* ── Orientation ─────────────────────────────────────────── */}
      <section>
        <Label className="text-sm font-medium mb-2.5 block">Paper Orientation</Label>
        <div className="flex gap-2">
          <Button
            variant={orientation === "portrait" ? "default" : "outline"}
            size="sm"
            onClick={() => onOrientationChange("portrait")}
            className="flex-1 text-xs"
          >
            Portrait
          </Button>
          <Button
            variant={orientation === "landscape" ? "default" : "outline"}
            size="sm"
            onClick={() => onOrientationChange("landscape")}
            className="flex-1 text-xs"
          >
            Landscape
          </Button>
        </div>
      </section>

      {/* ── Layout summary ──────────────────────────────────────── */}
      {hasImage && (
        <>
          <Separator />
          <section className="rounded-md bg-muted/50 p-3 text-xs space-y-1">
            <p>
              <span className="text-muted-foreground">Photo:</span>{" "}
              {effectivePhotoWidthMm} × {effectivePhotoHeightMm} mm
            </p>
            <p>
              <span className="text-muted-foreground">Paper:</span>{" "}
              {selectedPaperPreset.name} ({orientation})
            </p>
            <p>
              <span className="text-muted-foreground">Layout:</span>{" "}
              {layout.columns} × {layout.rows} grid, {copies === "max" ? layout.maxCopies : Math.min(copies as number, layout.maxCopies)} copies
            </p>
            <p>
              <span className="text-muted-foreground">Export:</span>{" "}
              {dpi} DPI
            </p>
          </section>
        </>
      )}
    </div>
  );
}
