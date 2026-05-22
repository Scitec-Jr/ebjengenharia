import Image from "next/image";

export default function Footer() {
	return (
		<footer id="footer" className="bg-(--main-color) text-white py-8 px-4 md:px-8 lg:px-16">
			<hr className="w-3/4 mx-auto my-4 border-(--secondary-color) border-3"/>

			<div className="flex flex-col md:flex-row gap-8 mb-8">
				<div className="flex-1">
                    <h2 className="mb-4 text-3xl">Contato</h2>

                    <a href="mailto:ebjengenharia28@gmail.com" target="_blank" rel="noopener noreferrer" className="flex gap-4 items-center mb-4">
                        <Image src={"/assets/icons/email.png"} alt="email" width={30} height={20} />
                        ebjengenharia28@gmail.com
                    </a>

                    <a href="tel:+5519999576107" target="_blank" rel="noopener noreferrer" className="flex gap-4 items-center mb-4">
                        <Image src={"/assets/icons/telefone.png"} alt="telefone" width={30} height={20} />
                        (19) 99957-6107
                    </a>

                    <a href="https://maps.google.com/?q=Rua+Viscondessa+de+Campinas,+522+-+Nova+Campinas,+Campinas,+SP" className="flex gap-4 items-center mb-4">
                        <Image src={"/assets/icons/mapa.png"} alt="localização" width={30} height={20} />
                        Rua Viscondessa de Campinas, 522 - Nova Campinas, Campinas, SP
                    </a>
                </div>

				<div className="flex flex-col gap-4 flex-1 text-center">
                    <a href="#">Home</a>

                    <a href="#quem-somos">Quem Somos</a>

                    <a href="#nossos-servicos">Nossos Serviços</a>

                    <a href="#faca-seu-orcamento">Faça seu orçamento</a>

                    <a href="#footer">Contato</a>
                </div>
			</div>

            <div className="flex flex-col-reverse items-center md:flex-row">
                <div className="flex flex-col text-center w-fit md:ml-auto">
                    <Image src={"/assets/icons/logo1.png"} alt="EBJ Engenharia" width={250} height={150} />
                    <small>Feito por <a href="https://www.scitecjr.com.br/" target="_blank" rel="noopener noreferrer">SciTec Jr.</a></small>
                </div>

                <div className="flex gap-8 py-4 md:ml-auto">
                    <a href="https://www.instagram.com/ebjengenharia/" target="_blank" rel="noopener noreferrer">
                        <Image src={"/assets/icons/instagram.png"} alt="Instagram" width={30} height={30} />
                    </a>
                    <a href="https://wa.me/5519999576107" target="_blank" rel="noopener noreferrer">
                        <Image src={"/assets/icons/whatsapp.png"} alt="Whatsapp" width={30} height={30} />
                    </a>
                    <a href="mailto:ebjengenharia28@gmail.com" target="_blank" rel="noopener noreferrer">
                        <Image src={"/assets/icons/email.png"} alt="Email" width={30} height={30} />
                    </a>
                </div>
            </div>
		</footer>
	);
}
