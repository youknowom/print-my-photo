import Link from "next/link";
import { Printer } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight hover:opacity-80 transition-opacity"
        >
          <Printer className="w-5 h-5" />
          <span>Print My Photo</span>
        </Link>

        <nav className="flex items-center gap-1" aria-label="Main navigation">
          <Link
            href="/editor"
            className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50"
          >
            Editor
          </Link>
          <Link
            href="/faq"
            className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50"
          >
            FAQ
          </Link>
          <Link
            href="/privacy"
            className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50"
          >
            Privacy
          </Link>
        </nav>
      </div>
    </header>
  );
}
