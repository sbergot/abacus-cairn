import "./globals.css";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
import ClientLayout from "./client-layout";
import Script from "next/script";

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
      <head>
        <Script
          src="https://cdn.counter.dev/script.js"
          data-id="0a776176-2929-44d5-a070-2d66750cdcdc"
          data-utcoffset="2"
        />
      </head>
      <body className={inter.className}>
        <NoSSR>
          <ClientLayout>{children}</ClientLayout>
        </NoSSR>
      </body>
    </html>
  );
}
