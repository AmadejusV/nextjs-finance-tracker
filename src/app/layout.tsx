import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: "PWASSRAPP",
  description: "Generated for idp",
  icons: {
    icon: [{ url: "/acounts_icon.png", sizes: "192x192", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="https://amadejusv.github.io/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/acounts_icon.png" />
        <link rel="apple-touch-icon" href="/acounts_icon.png" />
      </head>
      <body className="bg-gray-100">
        <Header />
        <ServiceWorkerRegister />
        <div>{children}</div>
      </body>
    </html>
  );
}
