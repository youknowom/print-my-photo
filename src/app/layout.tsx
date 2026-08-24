import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Print My Photo — Print-Ready Photo Sheets at Exact Dimensions",
    template: "%s — Print My Photo",
  },
  description:
    "Create print-ready passport, visa, ID, and custom-sized photo sheets directly in your browser. No uploads, no accounts. Choose exact dimensions, arrange copies on paper, and download a PDF.",
  metadataBase: new URL("https://printmyphoto.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Print My Photo",
    title: "Print My Photo — Print-Ready Photo Sheets at Exact Dimensions",
    description:
      "Create print-ready passport, visa, ID, and custom-sized photo sheets directly in your browser. No uploads, no accounts.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Print My Photo — Print-Ready Photo Sheets at Exact Dimensions",
    description:
      "Create print-ready photo sheets at exact dimensions in your browser.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <TooltipProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </TooltipProvider>
      </body>
    </html>
  );
}
