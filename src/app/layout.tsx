import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ΜΙΝΩΑ — Σύστημα Διαχείρισης",
  description: "Καταγραφή αιτημάτων αλλαγών παροχών",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="el">
      <body>{children}</body>
    </html>
  );
}
