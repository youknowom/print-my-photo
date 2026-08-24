import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Print My Photo</p>
            <p className="text-xs text-muted-foreground">
              Browser-based photo printing utility. No uploads, no accounts.
            </p>
          </div>

          <nav
            className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground"
            aria-label="Footer navigation"
          >
            <Link
              href="/editor"
              className="hover:text-foreground transition-colors"
            >
              Editor
            </Link>
            <Link
              href="/faq"
              className="hover:text-foreground transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
          </nav>
        </div>

        <div className="mt-6 pt-4 border-t border-border text-xs text-muted-foreground">
          <p>
            Print My Photo is an independent browser utility. Photo presets
            reference official government specifications but this tool is not
            affiliated with or endorsed by any government agency. Always verify
            current requirements with the relevant authority.
          </p>
        </div>
      </div>
    </footer>
  );
}
