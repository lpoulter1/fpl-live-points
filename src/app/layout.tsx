import "./globals.css";
import { Roboto_Mono } from "next/font/google";

const inter = Roboto_Mono({ subsets: ["latin"] });
// force reload of data
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ minHeight: "100svh" }}>
      <body className={inter.className}>
        <div className="bg-sky-600 min-h-[100svh]">
          <div className="container pt-4 mx-auto">{children}</div>
        </div>
      </body>
    </html>
  );
}
