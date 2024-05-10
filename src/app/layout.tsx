import "./globals.css";
import { Roboto_Mono } from "next/font/google";
import { Seagull } from "./_components/Seagull";

const inter = Roboto_Mono({ subsets: ["latin"] });
// force reload of data
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Brighton FPL Points Tracker",
  description: "For James and Laurie to bet",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ minHeight: "100svh" }}>
      <body className={inter.className}>
        <div className="bg-sky-600 min-h-[100svh] text-white">
          <div className="container mx-auto">{children}</div>
          <div className="absolute inset-0 flex items-center self-end justify-center mt-5 opacity-10">
            <Seagull />
          </div>
        </div>
      </body>
    </html>
  );
}
