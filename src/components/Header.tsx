"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="bg-(--light-color) text-white overflow-hidden shadow shadow-zinc-500">
           <nav className="flex items-center justify-between px-4 md:px-8 lg:px-16">
                <a href="#" className="">
                    <Image src={"/assets/icons/logo_colorida.png"} alt={"EBJ Engenharia"} width={140} height={40} />
                </a>

                {/* Desktop */}
                <div className="hidden md:flex gap-4 lg:gap-8">
                    <Link href="/" className="text-lg text-(--main-color)">Home</Link>
                    <Link href="/#quem-somos" className="text-lg text-(--main-color)">Quem somos</Link>
                    <Link href="/#nossos-servicos" className="text-lg text-(--main-color)">Nossos serviços</Link>
                    <Link href="/#faca-seu-orcamento" className="text-lg text-(--main-color)">Faça seu orçamento</Link>
                    <Link href="/#footer" className="text-lg text-(--main-color)">Contato</Link>
                </div>

                {/* Mobile */}
                <button
                    onClick={toggleMenu}
                    className="md:hidden flex flex-col gap-1.5 focus:outline-none cursor-pointer"
                    aria-label="Toggle menu"
                >
                    <span className={`w-6 h-0.5 bg-(--main-color) transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
                    <span className={`w-6 h-0.5 bg-(--main-color) transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`}></span>
                    <span className={`w-6 h-0.5 bg-(--main-color) transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
                </button>
           </nav>

           <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"}`}>
               <div className="bg-(--light-color) flex flex-col gap-4  min-h-0">
                   <Link href="/" className="px-4 pt-4 text-lg text-(--main-color) border-t border-opacity-20 border-(--main-color)">Home</Link>
                   <Link href="/#quem-somos" className="px-4 text-lg text-(--main-color)">Quem somos</Link>
                   <Link href="/#nossos-servicos" className="px-4 text-lg text-(--main-color)">Nossos serviços</Link>
                   <Link href="/#faca-seu-orcamento" className="px-4 text-lg text-(--main-color)">Faça seu orçamento</Link>
                   <Link href="/#footer" className="px-4 pb-4 text-lg text-(--main-color)">Contato</Link>
               </div>
           </div>
        </header>
    )
}