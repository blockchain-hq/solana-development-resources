import type { Metadata } from "next";
import "./globals.css";
import { AppWalletProvider } from "./providers/WalletProvider";

export const metadata: Metadata = {
  title: "Solana Counter App",
  description: "Interact with a Solana counter program",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppWalletProvider>{children}</AppWalletProvider>
      </body>
    </html>
  );
}

