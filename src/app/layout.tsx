import "./globals.css";
import { Inter } from "next/font/google";
import { Dynamic } from "@/app/dynamic";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Abacus",
  description: "Mapless VTT",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <Dynamic>{children}</Dynamic> */}
        {children}
      </body>
    </html>
  );
}
