"use client";

/**
 * Editor state management hook.
 * Central state for the entire photo editor workflow.
 */

import { useState, useCallback, useRef } from "react";
import type { PhotoPreset, PaperPreset, Orientation, CropArea } from "@/lib/types";
import { photoPresets } from "@/data/photo-presets";
import { paperPresets } from "@/data/paper-presets";
import { DEFAULT_DPI } from "@/lib/dimensions";
import { validateImageFile, loadImage, revokeSafeObjectUrl } from "@/lib/image-utils";

export type EditorStep = "upload" | "edit" | "export";

interface EditorState {
  // Upload
  imageFile: File | null;
  imageSrc: string | null;
  imageWidth: number;
  imageHeight: number;
  uploadError: string | null;

  // Photo size
  selectedPhotoPreset: PhotoPreset;
  customWidthMm: number;
  customHeightMm: number;
  useCustomSize: boolean;

  // Crop
  cropArea: CropArea | null;
  croppedImageDataUrl: string | null;
  zoom: number;
  rotation: number;

  // Paper & layout
  selectedPaperPreset: PaperPreset;
  copies: number | "max";
  marginMm: number;
  gapMm: number;
  orientation: Orientation;
  dpi: number;

  // UI state
  currentStep: EditorStep;
  isExporting: boolean;
  exportError: string | null;
}

const initialState: EditorState = {
  imageFile: null,
  imageSrc: null,
  imageWidth: 0,
  imageHeight: 0,
  uploadError: null,

  selectedPhotoPreset: photoPresets[0],
  customWidthMm: 35,
  customHeightMm: 45,
  useCustomSize: false,

  cropArea: null,
  croppedImageDataUrl: null,
  zoom: 1,
  rotation: 0,

  selectedPaperPreset: paperPresets[0],
  copies: "max",
  marginMm: 5,
  gapMm: 2,
  orientation: "portrait",
  dpi: DEFAULT_DPI,

  currentStep: "upload",
  isExporting: false,
  exportError: null,
};

export function useEditorState() {
  const [state, setState] = useState<EditorState>(initialState);
  const objectUrlRef = useRef<string | null>(null);

  // ── Upload ─────────────────────────────────────────────────────────

  const handleFile = useCallback(async (file: File) => {
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setState((s) => ({ ...s, uploadError: validation.error ?? "Invalid file." }));
      return;
    }

    // Clean up previous object URL
    if (objectUrlRef.current) {
      revokeSafeObjectUrl(objectUrlRef.current);
    }

    try {
      const img = await loadImage(file);
      const src = URL.createObjectURL(file);
      objectUrlRef.current = src;

      setState((s) => ({
        ...s,
        imageFile: file,
        imageSrc: src,
        imageWidth: img.width,
        imageHeight: img.height,
        uploadError: null,
        cropArea: null,
        croppedImageDataUrl: null,
        zoom: 1,
        rotation: 0,
        currentStep: "edit",
      }));
    } catch (err) {
      setState((s) => ({
        ...s,
        uploadError:
          err instanceof Error
            ? err.message
            : "Could not load image. Please try another file.",
      }));
    }
  }, []);

  // ── Photo preset ───────────────────────────────────────────────────

  const setPhotoPreset = useCallback((preset: PhotoPreset) => {
    setState((s) => ({
      ...s,
      selectedPhotoPreset: preset,
      useCustomSize: false,
      croppedImageDataUrl: null,
    }));
  }, []);

  const setCustomSize = useCallback((widthMm: number, heightMm: number) => {
    setState((s) => ({
      ...s,
      customWidthMm: widthMm,
      customHeightMm: heightMm,
      useCustomSize: true,
      croppedImageDataUrl: null,
    }));
  }, []);

  // ── Crop ───────────────────────────────────────────────────────────

  const setCropArea = useCallback((area: CropArea) => {
    setState((s) => ({ ...s, cropArea: area }));
  }, []);

  const setCroppedImage = useCallback((dataUrl: string) => {
    setState((s) => ({ ...s, croppedImageDataUrl: dataUrl }));
  }, []);

  const setZoom = useCallback((zoom: number) => {
    setState((s) => ({ ...s, zoom }));
  }, []);

  const setRotation = useCallback((rotation: number) => {
    setState((s) => ({ ...s, rotation }));
  }, []);

  const resetCrop = useCallback(() => {
    setState((s) => ({
      ...s,
      zoom: 1,
      rotation: 0,
      cropArea: null,
      croppedImageDataUrl: null,
    }));
  }, []);

  // ── Paper & layout ─────────────────────────────────────────────────

  const setPaperPreset = useCallback((preset: PaperPreset) => {
    setState((s) => ({ ...s, selectedPaperPreset: preset }));
  }, []);

  const setCopies = useCallback((copies: number | "max") => {
    setState((s) => ({ ...s, copies }));
  }, []);

  const setMargin = useCallback((marginMm: number) => {
    setState((s) => ({ ...s, marginMm }));
  }, []);

  const setGap = useCallback((gapMm: number) => {
    setState((s) => ({ ...s, gapMm }));
  }, []);

  const setOrientation = useCallback((orientation: Orientation) => {
    setState((s) => ({ ...s, orientation }));
  }, []);

  // ── Export ─────────────────────────────────────────────────────────

  const setExporting = useCallback((isExporting: boolean) => {
    setState((s) => ({ ...s, isExporting }));
  }, []);

  const setExportError = useCallback((error: string | null) => {
    setState((s) => ({ ...s, exportError: error }));
  }, []);

  // ── Navigation ─────────────────────────────────────────────────────

  const goToStep = useCallback((step: EditorStep) => {
    setState((s) => ({ ...s, currentStep: step }));
  }, []);

  const startOver = useCallback(() => {
    if (objectUrlRef.current) {
      revokeSafeObjectUrl(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setState(initialState);
  }, []);

  // ── Derived values ─────────────────────────────────────────────────

  const effectivePhotoWidthMm = state.useCustomSize
    ? state.customWidthMm
    : state.selectedPhotoPreset.widthMm;

  const effectivePhotoHeightMm = state.useCustomSize
    ? state.customHeightMm
    : state.selectedPhotoPreset.heightMm;

  const effectivePhotoName = state.useCustomSize
    ? `${state.customWidthMm}×${state.customHeightMm}mm`
    : state.selectedPhotoPreset.name;

  return {
    state,
    effectivePhotoWidthMm,
    effectivePhotoHeightMm,
    effectivePhotoName,

    handleFile,
    setPhotoPreset,
    setCustomSize,
    setCropArea,
    setCroppedImage,
    setZoom,
    setRotation,
    resetCrop,
    setPaperPreset,
    setCopies,
    setMargin,
    setGap,
    setOrientation,
    setExporting,
    setExportError,
    goToStep,
    startOver,
  };
}
