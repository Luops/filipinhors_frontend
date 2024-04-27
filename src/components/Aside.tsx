"use client";
import React from "react";

// Icons

// Components
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

// Next
import Link from "next/link";

// Icons
import { UserRound, Home, Menu, X } from "lucide-react";

type Props = {};

function Aside({}: Props) {
  // Abrir e fechar o aside
  const [showAside, setShowAside] = React.useState(false);

  const [isWideAside, setIsWideAside] = React.useState(false);

  // Resolução da tela
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  // Função para atualizar o state com a largura atual da janela em pixels
  const updateWindowWidth = () => {
    setWindowWidth(window.innerWidth);
  };
  // Atualizar a largura da janela quando a janela for redimensionada
  React.useEffect(() => {
    window.addEventListener("resize", updateWindowWidth); // Adicione um listener de evento de redimensionamento da janela
    return () => {
      window.removeEventListener("resize", updateWindowWidth); // Remova o listener de evento de redimensionamento da janela quando o componente for desmontado
    };
  }, []);

  const toggleAsideWidth = () => {
    setIsWideAside(!isWideAside);
  };
  return (
    <>
      <aside
        className={`transition-all ease-in-out duration-300 z-0 fixed relatve ${
          isWideAside ? "w-[200px]" : "w-[60px]"
        } flex flex-col justify-start h-screen bg-slate-800 pt-2 overflow-y-hidden`}
      >
        <Button
          onClick={toggleAsideWidth}
          className="text-white z-50 bg-transparent text-xl"
        >
          {isWideAside ? <X size={25} /> : <Menu size={25} />}
        </Button>
        <nav className={`w-full absolute flex flex-col mt-10 gap-2`}>
          <Link
            href={"/Plataforma"}
            className="relatve flex items-center gap-2 pl-4 text-white font-semibold text-md hover:bg-slate-600 py-2 rounded-sm transition-all ease-in-out duration-300"
          >
            <i>
              <Home size={20} />
            </i>
            <p className={`w-[200px] absolute left-10 ${!isWideAside && "hidden"}`}>
              Início
            </p>
          </Link>
          <Link
            href={"/MinhaConta"}
            className="w-full relative flex items-center gap-2 pl-4 text-white font-semibold text-md hover:bg-slate-600 py-2 rounded-sm transition-all ease-in-out duration-300"
          >
            <i>
              <UserRound size={20} />
            </i>
            <p
              className={`w-[200px] absolute left-10
                ${!isWideAside && "hidden"}
              `}
            >
              Minha Conta
            </p>
          </Link>
        </nav>
      </aside>
    </>
  );
}

export default Aside;
