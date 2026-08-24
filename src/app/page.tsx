import Link from "next/link";
import { ArrowRight, Shield, Monitor, Ruler, Upload, Crop, Grid3X3, Download } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { getVerifiedPresets } from "@/data/photo-presets";
import { formatDimensionsMm } from "@/lib/dimensions";

export default function HomePage() {
  const verifiedPresets = getVerifiedPresets();

  return (
    <div>
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Print your photos at the exact size you need.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Create passport, visa, ID, and custom-sized photo sheets directly in
            your browser. No uploads to any server. No account needed.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/editor"
              id="hero-cta-create"
              className={buttonVariants({ size: "lg" })}
            >
              Create a photo sheet
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <a
              href="#how-it-works"
              id="hero-cta-how"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* ── Trust facts ─────────────────────────────────────────── */}
      <section className="border-y border-border bg-muted/30 py-10 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="space-y-2">
            <Shield className="w-5 h-5 mx-auto text-muted-foreground" />
            <p className="text-sm font-medium">No account required</p>
            <p className="text-xs text-muted-foreground">
              Start immediately. No sign-up or login.
            </p>
          </div>
          <div className="space-y-2">
            <Monitor className="w-5 h-5 mx-auto text-muted-foreground" />
            <p className="text-sm font-medium">Browser-based processing</p>
            <p className="text-xs text-muted-foreground">
              Your photos stay on your device. Nothing is uploaded.
            </p>
          </div>
          <div className="space-y-2">
            <Ruler className="w-5 h-5 mx-auto text-muted-foreground" />
            <p className="text-sm font-medium">Exact physical dimensions</p>
            <p className="text-xs text-muted-foreground">
              Verified sizes for passport, visa, and ID photos.
            </p>
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────── */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 scroll-mt-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-semibold text-center mb-10">
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Upload,
                title: "Upload",
                desc: "Select a photo from your device or take one with your camera.",
              },
              {
                icon: Crop,
                title: "Size & crop",
                desc: "Choose a preset or custom dimensions and position your photo.",
              },
              {
                icon: Grid3X3,
                title: "Arrange",
                desc: "Pick paper size, number of copies, margins, and spacing.",
              },
              {
                icon: Download,
                title: "Export",
                desc: "Download a print-ready PDF or image file.",
              },
            ].map((step, i) => (
              <div key={i} className="text-center space-y-2.5">
                <div className="mx-auto w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <step.icon className="w-4.5 h-4.5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Supported sizes ─────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 bg-muted/20 border-y border-border">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-semibold text-center mb-2">
            Verified photo sizes
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-8">
            Dimensions verified from official government sources. Always confirm
            current requirements with the relevant authority.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {verifiedPresets.map((preset) => (
              <Link
                key={preset.id}
                href="/editor"
                className="flex items-center justify-between p-3.5 rounded-lg border border-border bg-background hover:border-foreground/20 transition-colors group"
              >
                <div>
                  <p className="text-sm font-medium group-hover:text-foreground transition-colors">
                    {preset.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDimensionsMm(preset.widthMm, preset.heightMm)}
                    {preset.sourceName && ` · ${preset.sourceName}`}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
              </Link>
            ))}
          </div>

          <p className="mt-4 text-xs text-muted-foreground text-center">
            Custom sizes are also supported. Enter any dimensions in mm, cm, or
            inches.
          </p>
        </div>
      </section>

      {/* ── FAQ preview ─────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-xl font-semibold text-center mb-8">
            Common questions
          </h2>

          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-medium mb-1">
                Does Print My Photo upload my photos?
              </h3>
              <p className="text-sm text-muted-foreground">
                No. All image processing happens in your browser using
                client-side JavaScript. Your photos are never sent to any
                server.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">
                Are the photo sizes accurate?
              </h3>
              <p className="text-sm text-muted-foreground">
                Verified presets reference official government specifications and
                include the source. However, requirements can change — always
                verify with the relevant authority before submitting.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">
                What format should I download?
              </h3>
              <p className="text-sm text-muted-foreground">
                PDF is recommended for printing because it preserves exact
                physical dimensions. JPG and PNG are available if your printer
                or service requires an image file.
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/faq"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              See all questions
            </Link>
          </div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 border-t border-border bg-muted/20">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-xl font-semibold mb-3">
            Ready to create your photo sheet?
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Upload a photo, choose its size, and download a print-ready sheet.
          </p>
          <Link
            href="/editor"
            id="final-cta-create"
            className={buttonVariants({ size: "lg" })}
          >
            Get started
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
