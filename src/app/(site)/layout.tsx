import "../globals.css";
import { actor } from "../../../public/fonts/fonts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt" className={`${actor.variable}`} suppressHydrationWarning>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}