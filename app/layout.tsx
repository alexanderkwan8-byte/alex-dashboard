import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alex Command Center",
  description: "Task management and progress tracking dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-950 text-slate-100 font-sans">
        {children}
      </body>
    </html>
  );
}
