import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How Print My Photo handles your photos and data. All image processing happens in your browser.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Privacy</h1>

      <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-base font-medium text-foreground mb-2">
            Image processing
          </h2>
          <p>
            Your photos are processed entirely in your browser using
            client-side JavaScript. Images are never uploaded to, stored on,
            or transmitted to any server for the purpose of image processing.
          </p>
          <p className="mt-2">
            When you close or refresh the page, all image data in browser
            memory is discarded. Print My Photo does not retain copies of your
            photos.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground mb-2">
            What we do not collect
          </h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Photo contents or image data</li>
            <li>EXIF metadata from your images</li>
            <li>Filenames that may contain personal information</li>
            <li>Personal information such as name, email, or address</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground mb-2">
            Website hosting
          </h2>
          <p>
            This website is served as a static Next.js application. Standard
            web server logs (IP address, browser type, pages visited) may be
            collected by the hosting provider as part of normal operations.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground mb-2">
            Cookies
          </h2>
          <p>
            Print My Photo does not set tracking cookies or use third-party
            advertising cookies. Only essential cookies required for the
            website to function may be used.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground mb-2">
            Analytics
          </h2>
          <p>
            This application does not currently include any analytics or
            tracking scripts. If analytics are added in the future, this page
            will be updated to describe what is collected and how it is used.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground mb-2">
            Third-party services
          </h2>
          <p>
            Google Fonts are self-hosted through Next.js font optimization, so
            no requests are sent to Google when you visit this site. No other
            third-party services are loaded.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-foreground mb-2">
            Changes to this policy
          </h2>
          <p>
            If the privacy practices of this application change, this page
            will be updated accordingly.
          </p>
        </section>
      </div>
    </div>
  );
}
