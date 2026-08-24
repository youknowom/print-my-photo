import type { Metadata } from "next";
import { PhotoEditor } from "@/components/photo-editor";

export const metadata: Metadata = {
  title: "Photo Editor",
  description:
    "Upload a photo, choose exact dimensions, crop, arrange copies on paper, and download a print-ready PDF or image.",
};

export default function EditorPage() {
  return <PhotoEditor />;
}
