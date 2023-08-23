import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ticktask",
  description:
    "your ultimate task management solution. Stay organized and supercharge your productivity with TickTask",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#F5F6F8]">{children}</body>
    </html>
  );
}
