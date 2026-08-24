/**
 * Verified photo presets.
 *
 * IMPORTANT: Every preset marked "VERIFIED" has a government or official
 * standards-body source. Do not add a VERIFIED preset from memory.
 *
 * Evidence states:
 *   VERIFIED          — backed by authoritative source
 *   USER_CONFIGURABLE — generic size, no official-compliance claim
 *   EXAMPLE           — labelled example data
 *   UNKNOWN           — not displayed as fact
 */

import type { PhotoPreset } from "@/lib/types";

export const photoPresets: PhotoPreset[] = [
  // ── Passport presets (VERIFIED) ─────────────────────────────────────

  {
    id: "us-passport",
    name: "US Passport",
    category: "passport",
    country: "US",
    purpose: "Passport / Visa",
    widthMm: 51,
    heightMm: 51,
    sourceName: "U.S. Department of State",
    sourceUrl: "https://travel.state.gov/content/travel/en/passports/how-apply/photos.html",
    verifiedAt: "2026-08-24",
    evidenceState: "VERIFIED",
    notes: "2 × 2 inches. Head height 25–35 mm. No glasses permitted.",
  },
  {
    id: "uk-passport",
    name: "UK Passport",
    category: "passport",
    country: "GB",
    purpose: "Passport",
    widthMm: 35,
    heightMm: 45,
    sourceName: "GOV.UK",
    sourceUrl: "https://www.gov.uk/photos-for-passports",
    verifiedAt: "2026-08-24",
    evidenceState: "VERIFIED",
    notes: "Head height 29–34 mm. Plain white/light grey/cream background.",
  },
  {
    id: "india-passport",
    name: "India Passport",
    category: "passport",
    country: "IN",
    purpose: "Passport",
    widthMm: 35,
    heightMm: 45,
    sourceName: "Passport Seva, Government of India",
    sourceUrl: "https://www.passportindia.gov.in",
    verifiedAt: "2026-08-24",
    evidenceState: "VERIFIED",
    notes: "White background. Dark-colored clothing recommended.",
  },
  {
    id: "canada-passport",
    name: "Canada Passport",
    category: "passport",
    country: "CA",
    purpose: "Passport",
    widthMm: 50,
    heightMm: 70,
    sourceName: "Government of Canada",
    sourceUrl: "https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-passports/photos.html",
    verifiedAt: "2026-08-24",
    evidenceState: "VERIFIED",
    notes: "Face height 31–36 mm. Must be taken by a commercial photographer.",
  },
  {
    id: "schengen-visa",
    name: "Schengen Visa",
    category: "visa",
    purpose: "Schengen Visa",
    widthMm: 35,
    heightMm: 45,
    sourceName: "EU Schengen Regulations",
    verifiedAt: "2026-08-24",
    evidenceState: "VERIFIED",
    notes: "Head height 32–36 mm. Plain white or light grey background.",
  },
  {
    id: "japan-passport",
    name: "Japan Passport",
    category: "passport",
    country: "JP",
    purpose: "Passport",
    widthMm: 35,
    heightMm: 45,
    sourceName: "Ministry of Foreign Affairs of Japan",
    sourceUrl: "https://www.mofa.go.jp",
    verifiedAt: "2026-08-24",
    evidenceState: "VERIFIED",
    notes: "Head height 32–36 mm. White/light grey/light blue background.",
  },

  // ── Standard print sizes (USER_CONFIGURABLE) ───────────────────────

  {
    id: "wallet-size",
    name: "Wallet Size",
    category: "standard",
    widthMm: 64,
    heightMm: 89,
    evidenceState: "USER_CONFIGURABLE",
    notes: "Approximately 2.5 × 3.5 inches. Common wallet photo size.",
  },
  {
    id: "35x45",
    name: "35 × 45 mm",
    category: "standard",
    widthMm: 35,
    heightMm: 45,
    evidenceState: "USER_CONFIGURABLE",
    notes: "Common biometric photo size used in many countries.",
  },
  {
    id: "25x30",
    name: "25 × 30 mm",
    category: "standard",
    widthMm: 25,
    heightMm: 30,
    evidenceState: "USER_CONFIGURABLE",
    notes: "Small ID photo format used in some applications.",
  },
  {
    id: "2x2in",
    name: "2 × 2 in (51 × 51 mm)",
    category: "standard",
    widthMm: 51,
    heightMm: 51,
    evidenceState: "USER_CONFIGURABLE",
    notes: "Common square photo format.",
  },
];

/**
 * Get a photo preset by ID. Returns undefined if not found.
 */
export function getPhotoPreset(id: string): PhotoPreset | undefined {
  return photoPresets.find((p) => p.id === id);
}

/**
 * Get only verified (government-sourced) presets.
 */
export function getVerifiedPresets(): PhotoPreset[] {
  return photoPresets.filter((p) => p.evidenceState === "VERIFIED");
}

/**
 * Get standard (user-configurable, non-official) presets.
 */
export function getStandardPresets(): PhotoPreset[] {
  return photoPresets.filter((p) => p.evidenceState === "USER_CONFIGURABLE");
}
