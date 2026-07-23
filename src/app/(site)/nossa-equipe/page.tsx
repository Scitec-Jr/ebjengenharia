import Image from "next/image";
import Link from "next/link";

export default function NossaEquipe() {
	return (
		<main className="pt-4 bg-[url('/assets/images/equipe.png')] bg-cover bg-center">
			<section className="max-w-440 mx-auto">
				<div className="px-4 md:px-8 lg:px-16">
					<Link href={"/"} className="flex items-center gap-4">
						<Image src={"/assets/icons/voltar.png"} alt="Voltar" width={30} height={30} />

						<span>Voltar</span>
					</Link>

					<div className="px-4 py-8">
						<h1 className="mb-4 text-4xl text-(--main-color)">Nossa equipe</h1>

                        <div className="mb-4 pb-4 border-b-2 border-(--secondary-color)">
                            <p>Nossa equipe reúne profissionais com sólida experiência no setor industrial e da construção, atuando de forma integrada em todas as etapas do ciclo de vida dos ativos, da implantação à operação.</p>

                            <br />

                            <p>Com uma abordagem prática e orientada a resultados, combinamos conhecimento técnico, visão estratégica e proximidade com o cliente para garantir eficiência, qualidade e segurança em cada projeto.</p>
                        </div>

                        <div className="mb-4 pb-4 border-b-2 border-(--secondary-color)">
                            <h2 className="mb-4 text-xl text-(--main-color)">Planejamento e Controle</h2>

                            <p>Nossa equipe desenvolve soluções em engenharia de custos e planejamento, criando indicadores e rotinas que aumentam a eficiência operacional e reduzem desperdícios ao longo das obras.</p>
                        </div>

                        <div className="mb-4 pb-4 border-b-2 border-(--secondary-color)">
                            <h2 className="mb-4 text-xl text-(--main-color)">Qualidade, Segurança e Conformidade</h2>

                            <p>Trabalhamos com base em normas e boas práticas reconhecidas, garantindo alto padrão de qualidade, segurança operacional e conformidade em todos os processos.</p>
                        </div>

                        <div className="mb-4 pb-4 border-b-2 border-(--secondary-color)">
                            <h2 className="mb-4 text-xl text-(--main-color)">Manutenção e Relacionamento</h2>

                            <p>Atuamos na estruturação de planos de manutenção e no acompanhamento pós-obra, assegurando o desempenho contínuo dos ativos e um relacionamento próximo com clientes e parceiros.</p>
                        </div>

                        <div className="mb-4 pb-4">
                            <h2 className="mb-4 text-xl text-(--main-color)">Experiência e Visão Global</h2>

                            <p>Nossa liderança conta com formação executiva e experiência internacional, trazendo uma visão atualizada das melhores práticas e inovações do setor para cada projeto</p>
                        </div>
					</div>
				</div>
			</section>
		</main>
	);
}
