import Modal from "@/components/ReModal";
import "./globals.css";
import type { Metadata } from "next";
import Provider from "./provider";

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
    <html lang="en" suppressHydrationWarning>
      <body className="">
        <Provider>
          {children}
          <Modal />
        </Provider>
      </body>
    </html>
  );
}
