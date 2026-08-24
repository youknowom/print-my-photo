import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fafafa",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Simple photo grid illustration */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "40px",
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                width: "80px",
                height: "100px",
                backgroundColor: "#e4e4e7",
                borderRadius: "4px",
                border: "1px solid #d4d4d8",
              }}
            />
          ))}
        </div>

        <div
          style={{
            fontSize: "48px",
            fontWeight: 700,
            color: "#18181b",
            marginBottom: "16px",
          }}
        >
          Print My Photo
        </div>

        <div
          style={{
            fontSize: "22px",
            color: "#71717a",
            maxWidth: "700px",
            textAlign: "center",
          }}
        >
          Create print-ready photo sheets at exact dimensions
        </div>

        <div
          style={{
            display: "flex",
            gap: "24px",
            marginTop: "32px",
            fontSize: "16px",
            color: "#a1a1aa",
          }}
        >
          <span>Passport</span>
          <span>·</span>
          <span>Visa</span>
          <span>·</span>
          <span>ID</span>
          <span>·</span>
          <span>Custom Sizes</span>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
