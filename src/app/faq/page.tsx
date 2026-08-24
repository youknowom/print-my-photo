import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about Print My Photo — photo sizing, printing, privacy, and supported formats.",
};

const faqs = [
  {
    question: "Does Print My Photo upload my photos?",
    answer:
      "No. All image processing — cropping, resizing, layout, and PDF generation — happens in your browser using client-side JavaScript. Your photos are never sent to any server.",
  },
  {
    question: "What does \"35 × 45 mm\" mean?",
    answer:
      "It means the printed photo will be 35 millimetres wide and 45 millimetres tall. This is the most common biometric photo size, used by many countries for passports and visas. The tool generates a PDF at these exact physical dimensions so your printer produces a correctly sized photo.",
  },
  {
    question: "Are the preset sizes accurate?",
    answer:
      "Verified presets reference dimensions from official government sources and include the source name and verification date. However, government requirements can change at any time. Always verify the current requirements with the relevant authority (embassy, passport office, etc.) before submitting your application.",
  },
  {
    question: "What happens when I print the PDF?",
    answer:
      "The PDF is created with exact physical page dimensions (e.g., 210 × 297 mm for A4). When printing, select \"Actual Size\" or \"100%\" in your printer settings to preserve the correct dimensions. Avoid \"Fit to Page\" or \"Scale to Fit\" as these will change the photo sizes.",
  },
  {
    question: "Can I use this on my phone?",
    answer:
      "Yes. The editor works on modern mobile browsers (Chrome, Safari, Firefox). You can select a photo from your camera roll or take a new photo directly. The interface adapts to smaller screens, though a larger screen provides a more comfortable editing experience.",
  },
  {
    question: "What image formats are supported?",
    answer:
      "JPG (JPEG), PNG, and WebP. These are the formats reliably supported across all modern browsers. HEIC (used by iPhones) is not currently supported because browser support is inconsistent — convert to JPG first if needed.",
  },
  {
    question: "What DPI are exports generated at?",
    answer:
      "Exports are generated at 300 DPI (dots per inch), which is the standard resolution for photo printing. This means a 35 × 45 mm photo will be approximately 413 × 531 pixels in the output. Note that the actual print quality also depends on your source image resolution and your printer.",
  },
  {
    question: "What export formats are available?",
    answer:
      "PDF (recommended for printing, preserves exact physical dimensions), JPG, and PNG. PDF is the best choice when exact physical sizes matter because it embeds the page dimensions that your printer can use.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No. Print My Photo works immediately without registration, login, or any form of account. There is nothing to sign up for.",
  },
  {
    question: "Is this tool free?",
    answer:
      "Yes. The core tool is free to use.",
  },
  {
    question: "Is this an official government tool?",
    answer:
      "No. Print My Photo is an independent utility. It references official government specifications for photo dimensions but is not affiliated with, endorsed by, or connected to any government agency. The tool helps you produce photos at the specified dimensions, but acceptance of your photo is determined by the relevant authority.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="text-2xl font-semibold tracking-tight mb-8">
        Frequently asked questions
      </h1>

      <div className="space-y-6">
        {faqs.map((faq, i) => (
          <div key={i}>
            <h2 className="text-sm font-medium mb-1.5">{faq.question}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link href="/editor" className={buttonVariants()}>
          Create a photo sheet
        </Link>
      </div>
    </div>
  );
}
