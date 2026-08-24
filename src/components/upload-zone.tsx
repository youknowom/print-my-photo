"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, Camera, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onFileSelected: (file: File) => void;
  error?: string | null;
}

export function UploadZone({ onFileSelected, error }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (files && files.length > 0) {
        onFileSelected(files[0]);
      }
    },
    [onFileSelected],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload a photo. Click to browse or drag and drop an image here."
        className={cn(
          "relative flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-8 sm:p-12 transition-colors cursor-pointer",
          "hover:border-foreground/30 hover:bg-muted/50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          isDragOver
            ? "border-foreground/50 bg-muted/60"
            : "border-border",
          error && "border-destructive/50",
        )}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-muted">
          {isDragOver ? (
            <ImageIcon className="w-6 h-6 text-foreground" />
          ) : (
            <Upload className="w-6 h-6 text-muted-foreground" />
          )}
        </div>

        <div className="text-center space-y-1.5">
          <p className="text-sm font-medium text-foreground">
            {isDragOver ? "Drop your photo here" : "Drop a photo here, or click to browse"}
          </p>
          <p className="text-xs text-muted-foreground">
            JPG, PNG, or WebP — up to 50 MB
          </p>
        </div>

        {/* Camera capture for mobile */}
        <div className="flex gap-2 mt-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md border border-border hover:border-foreground/20"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Browse files
          </button>
          <label
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md border border-border hover:border-foreground/20 cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            Take photo
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              capture="environment"
              className="sr-only"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </label>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
          aria-label="Choose an image file"
        />
      </div>

      {error && (
        <p className="mt-3 text-sm text-destructive text-center" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
