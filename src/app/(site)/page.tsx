import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Nossos_servicos from "@/components/Nossos_servicos/Nossos_servicos";
import Carrossel_Nossos_Servicos from "@/components/Nossos_servicos/Carrossel";

export const metadata: Metadata = {
	title: "Home - EBJ Engenharia",
	description: "Bem-vindo à EBJ Engenharia. Conheça nossos serviços em construção, reformas e projetos residenciais, industriais e comerciais em Campinas.",
};

export default function Home() {
	return (
		<main>
			<section className="relative max-w-440 max-h-225 h-[calc(100vh-80px)] mx-auto">
				<div className="absolute inset-0 bg-(--main-color-blur)"></div>
				<Image src={"/assets/images/banner_home.jpg"} alt="Construindo legados" width={1200} height={900} className="w-full h-full" />

				<div className="absolute top-1/2 -translate-y-1/2 w-full px-6 md:px-16">
					<h1 className="mb-4 text-5xl md:text-7xl text-white">
						Construindo legado,
						<br /> edificando o bem
					</h1>

					<div className="flex justify-between">
						<Image src={"/assets/icons/logo1.png"} alt="EBJ Engenharia" width={150} height={100} />

						<div className="flex items-center gap-4">
							<a href="https://wa.me/5519999576107" target="_blank" rel="noopener noreferrer">
								<Image src={"/assets/icons/whatsapp.png"} alt="Whatsapp" width={30} height={30} />
							</a>

							<a href="mailto:ebjengenharia28@gmail.com" target="_blank" rel="noopener noreferrer">
								<Image src={"/assets/icons/email.png"} alt="Email" width={30} height={30} />
							</a>
						</div>
					</div>
				</div>
			</section>

			<section id="quem-somos" className="relative max-w-440 mx-auto">
				<div className="relative flex flex-col lg:flex-row items-center gap-8 px-20 pe-10 md:pe-20 py-20 z-10">
					<div className="flex-1 text-white">
						<h2 className="mb-4 text-3xl">Quem somos</h2>

						<p className="mb-4">A EBJ Engenharia consolida sua trajetória através do rigor técnico e da sensibilidade humana. Nascemos no setor residencial, onde cada metro quadrado exige máxima eficiência e cuidado — expertise que nos levou a executar projetos para instituições como a APAE e a Casa da Criança Paralítica de Campinas. Hoje, nossa evolução nos permite ampliar horizontes. Levamos nossa cultura de precisão e gestão de prazos para o setor industrial e comercial. Com foco em galpões, cozinhas industriais e reformas estruturais de grande porte, a EBJ Engenharia une a experiência do morar com a funcionalidade da produção, entregando obras sólidas que impulsionam negócios e transformam espaços.</p>

						<Link href={"/nossa-equipe"} className="block w-fit mx-auto px-4 py-2 bg-(--secondary-color) rounded-full text-white">
							Nossa equipe
						</Link>
					</div>

					<div className="relative flex flex-1 flex-col items-center">
						<div className="mb-4">
							<Image src={"/assets/images/banner_nossos_servicos.jpg"} alt="Quem somos" width={400} height={400} />
						</div>

						<a href="#nossos-servicos" className="block w-fit mx-auto px-4 py-2 bg-(--secondary-color) rounded-full text-white">
							Nossos serviços
						</a>
					</div>
				</div>

				<Image src={"/assets/images/banner_quem_somos.jpg"} alt="Quem somos" width={1200} height={400} className="absolute inset-0 w-full h-full" />
				<div className="absolute inset-0 bg-(--main-color-blur)">
					<div className="absolute top-0 right-0 w-12 h-40 bg-(--secondary-color)"></div>
					<div className="absolute top-0 right-8 w-20 h-25 bg-white"></div>

					<div className="absolute bottom-0 left-0 w-12 h-40 bg-(--secondary-color)"></div>
					<div className="absolute bottom-0 left-8 w-20 h-25 bg-white"></div>
				</div>
			</section>

			<section className="max-w-440 mx-auto">
				<div className="flex flex-wrap justify-center gap-16 px-4 py-12 bg-(--main-color) text-white">
					<div className="flex flex-col items-center max-w-60">
						<hr className="w-1/4 mb-2 border-(--secondary-color) border-3" />

						<h2 className="mb-4 text-3xl">Missão</h2>

						<Image src={"/assets/icons/missao.png"} alt="Missão" width={60} height={60} className="mb-4" />

						<p className="text-center">Prover soluções de engenharia com excelência técnica e responsabilidade, transformando projetos residenciais, sociais e industriais em espaços seguros, funcionais e de alto desempenho, sempre priorizando a ética e o impacto positivo na sociedade.</p>
					</div>

					<div className="flex flex-col items-center max-w-60">
						<hr className="w-1/4 mb-2 border-(--secondary-color) border-3" />

						<h2 className="mb-4 text-3xl">Visão</h2>

						<Image src={"/assets/icons/lampada.png"} alt="Visão" width={60} height={60} className="mb-4" />

						<p className="text-center">Ser referência em engenharia multidisciplinar em Campinas e região, reconhecida pela versatilidade em transitar entre obras de alto impacto social e grandes infraestruturas industriais, mantendo o padrão de qualidade que edifica confiança.</p>
					</div>

					<div className="flex flex-col items-center max-w-60">
						<hr className="w-1/4 mb-2 border-(--secondary-color) border-3" />

						<h2 className="mb-4 text-3xl">Valores</h2>

						<Image src={"/assets/icons/valores.png"} alt="Valores" width={60} height={60} className="mb-4" />

						<ul className="text-center">
							<li>Rigor técnico;</li>
							<li>Olhar Humano;</li>
							<li>Transparência e Ética;</li>
							<li>Versatilidade Operacional;</li>
							<li>Eficiência e Prazo;</li>
							<li>Comprometimento com a gestão de custos.</li>
						</ul>
					</div>
				</div>
			</section>

			<section id="nossos-servicos" className="relative max-w-440 mx-auto">
				<div className="relative flex flex-col lg:flex-row z-20">
					<div className="relative flex-3">
						<div className="relative px-10 py-20 z-10">
							<h2 className="mb-4 text-4xl text-white">Nossos serviços</h2>

							<Nossos_servicos></Nossos_servicos>
						</div>

						<Image src={"/assets/images/banner_nossos_servicos.jpg"} alt="Nossos servicos" width={1200} height={400} className="absolute inset-0 w-full h-full" />

						<div className="absolute inset-0 bg-(--main-color-blur)"></div>
					</div>

					<div className="flex-1 bg-(--secondary-color)">
						<div className="flex flex-col justify-center h-full p-4 text-white">
							<Carrossel_Nossos_Servicos showDots={false} />

							<div className="flex items-center justify-between mt-8">
								<p className="text-lg">Entre em contato</p>

								<div className="flex gap-4">
									<a href="https://wa.me/5519999576107" target="_blank" rel="noopener noreferrer">
										<Image src={"/assets/icons/whatsapp.png"} alt="Whatsapp" width={30} height={30} />
									</a>

									<a href="mailto:ebjengenharia28@gmail.com" target="_blank" rel="noopener noreferrer">
										<Image src={"/assets/icons/email.png"} alt="Email" width={30} height={30} />
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="absolute inset-0 z-10">
					<div className="absolute top-0 right-0 w-10 h-40 bg-white"></div>
					<div className="absolute top-0 right-10 w-10 h-25 bg-(--main-color)"></div>
				</div>
			</section>

			<section id="faca-seu-orcamento" className="relative max-w-440 mx-auto bg-(--main-color)">
				<div className="relative flex flex-col lg:flex-row items-center gap-8 px-14 md:px-20 py-30 text-white z-10">
					<div>
						<div className="flex items-center gap-2">
							<div className="w-7 h-1 bg-(--secondary-color)"></div>
							<h2 className="flex items-center text-4xl">Faça seu orçamento</h2>
						</div>

						<h3 className="mb-4 text-2xl">Construindo legados, edificando o bem</h3>

						<h2 className="mb-4 text-2xl">Como funciona?</h2>
						<ul className="ps-4">
							<li className="flex items-center gap-4 mb-4">
								<div className="flex items-center justify-center min-w-10 min-h-10 bg-(--secondary-color) text-xl">1</div>
								Envie uma mensagem pelo Whataspp ou Email
							</li>
							<li className="flex items-center gap-4 mb-4">
								<div className="flex items-center justify-center min-w-10 min-h-10 bg-(--secondary-color) text-xl">2</div>
								Nossa equipe analisa seu pedido ou projeto
							</li>
							<li className="flex items-center gap-4 mb-4">
								<div className="flex items-center justify-center min-w-10 min-h-10 bg-(--secondary-color) text-xl">3</div>
								Entramos em contato para entender sua necessidade
							</li>
							<li className="flex items-center gap-4 mb-4">
								<div className="flex items-center justify-center min-w-10 min-h-10 bg-(--secondary-color) text-xl">4</div>
								Enviamos um orçamento detalhado
							</li>
						</ul>
					</div>

					<div>
						<div className="w-fit mb-4 px-16 py-4 bg-(--secondary-color)">
							<span className="flex items-center gap-4 mb-4">
								<Image src={"/assets/icons/check.png"} alt="Vantagem 1" width={30} height={30} /> Orçamento gratuito
							</span>

							<span className="flex items-center gap-4">
								<Image src={"/assets/icons/check.png"} alt="Vantagem 2" width={30} height={30} /> Atendimento personalizado
							</span>
						</div>

						<div className="flex items-center justify-between">
							<p className="text-2xl">Faça já seu orçamento</p>

							<div className="flex gap-4">
								<a href="https://wa.me/5519999576107" target="_blank" rel="noopener noreferrer">
									<Image src={"/assets/icons/whatsapp.png"} alt="Whatsapp" width={40} height={40} />
								</a>

								<a href="mailto:ebjengenharia28@gmail.com" target="_blank" rel="noopener noreferrer">
									<Image src={"/assets/icons/email.png"} alt="Email" width={40} height={40} />
								</a>
							</div>
						</div>
					</div>
				</div>

				<div className="absolute inset-0 bg-(--main-color-blur)">
					<div className="absolute top-0 right-0 w-12 h-40 bg-(--secondary-color)"></div>
					<div className="absolute top-0 right-8 w-20 h-25 bg-white"></div>

					<div className="absolute bottom-0 left-0 w-12 h-40 bg-(--secondary-color)"></div>
					<div className="absolute bottom-0 left-8 w-20 h-25 bg-white"></div>
				</div>
			</section>
		</main>
	);
}
