import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Flow Money Tracker",
    short_name: "Flow",
    description: "Track your money, monthly plan, and daily spending.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#e8f4f3",
    theme_color: "#003f35",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
