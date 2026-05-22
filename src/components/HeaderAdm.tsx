"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

interface HeaderAdmProps {
  userName: string;
}

export default function HeaderAdm({ userName }: HeaderAdmProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: "Dashboard", href: "/adm", icon: "📊" },
    { label: "Projetos", href: "/adm/projetos", icon: "🏗️" },
    { label: "Usuários", href: "/adm/usuarios", icon: "👥" },
  ];

  const isActive = (href: string) => {
    if (href === "/adm") {
      return pathname === "/adm";
    }
    return pathname.startsWith(href);
  };

  async function handleLogout() {
    try {
      await fetch("/api/user/logout", { method: "POST" });
      router.push("/adm/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  }

  return (
    <>
      <nav className="bg-linear-to-r from-blue-600 to-blue-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="shrink-0">
                <span className="text-2xl font-bold text-white">🏢 EBJ</span>
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-semibold text-white">Painel Admin</h1>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-1">
              {menuItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-blue-700 text-white"
                      : "text-blue-100 hover:bg-blue-700 hover:text-white"
                  }`}
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:block">
                <span className="text-blue-100 text-sm">
                  Olá, <span className="font-semibold text-white">{userName}</span>
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                🚪 Logout
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-blue-100 hover:bg-blue-700"
              >
                <span className="text-xl">{isMenuOpen ? "✕" : "☰"}</span>
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-blue-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => {
                    router.push(item.href);
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-blue-800 text-white"
                      : "text-blue-100 hover:bg-blue-800"
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
