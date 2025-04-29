import type { Metadata } from "next";
import { Merriweather } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const merriweather = Merriweather({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title:
    "Public Spending World - Better insights, better transparency, no barriers",
  description: "Explore public spending data from countries around the world",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${merriweather.className} antialiased`}>
        {children}
        <Toaster richColors expand={true} position="top-right" />
      </body>
    </html>
  );
}
