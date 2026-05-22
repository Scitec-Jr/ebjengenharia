import type { Metadata } from "next";
import "./globals.css";
import { actor } from "../../public/fonts/fonts";

export const metadata: Metadata = {
	title: {
		default: "EBJ Engenharia - Construindo legados, edificando o bem",
		template: "%s | EBJ Engenharia",
	},
	description: "Soluções em engenharia residencial, industrial e comercial em Campinas - SP. Construindo legados com excelência técnica e responsabilidade.",
	keywords: "engenharia, construção, reformas, Campinas, residencial, industrial, comercial, projetos",
	metadataBase: new URL("https://ebjengenharia.com.br"),
	openGraph: {
		title: "EBJ Engenharia - Construindo legados",
		description: "Soluções em engenharia residencial, industrial e comercial",
		url: "https://ebjengenharia.com.br",
		siteName: "EBJ Engenharia",
		images: [
			{
				url: "/og-image.jpg",
				width: 1200,
				height: 630,
				alt: "EBJ Engenharia",
			},
		],
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "EBJ Engenharia",
		description: "Construindo legados, edificando o bem",
		images: ["/og-image.jpg"],
	},
	robots: {
		index: true,
		follow: true,
	},
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt" className={`${actor.variable}`} suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}