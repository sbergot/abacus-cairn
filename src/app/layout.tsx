import "./globals.css";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
import ClientLayout from "./client-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Abacus - Cairn",
  description: "Mapless VTT",
};

const NoSSR = dynamic(() => import("@/components/ui/wrapper"), { ssr: false });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NoSSR><ClientLayout>{children}</ClientLayout></NoSSR>
      </body>
    </html>
  );
}
