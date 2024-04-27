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
import { FilePlus } from "lucide-react";

type Props = {};

function AsideDashboard({}: Props) {
  // Abrir e fechar o aside
  const [showAside, setShowAside] = React.useState(false);

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
  return (
    <>
      <aside
        className={`transform transition-transform ${
          showAside || windowWidth >= 1000
            ? "animate-slideInFromLeft"
            : "animate-slideOutToLeft"
        } ${
          windowWidth < 1000 ? "absolute" : "relative"
        } left-0 flex flex-col justify-start !w-[250px] h-screen bg-slate-800 pt-2 z-10`}
      >
        <Button
          onClick={() => setShowAside(!showAside)}
          className={`${
            windowWidth < 1000 ? "absolute" : "hidden"
          }  top-50 right-5 text-white z-50 bg-transparent text-xl`}
        >
          X
        </Button>
        <article className="flex flex-col pl-4">
          <p className="text-white font-thin text-sm">Bem vindo!</p>
          <h2 className="text-white font-thin tracking-widest text-[1rem]">
            Fabricio Lopes
          </h2>
        </article>
        <article className="flex flex-col mt-5 ">
          <Link
            href={"/Create/Playlist"}
            className="flex items-center gap-2 pl-4 text-white font-semibold text-md hover:bg-slate-600 py-2 rounded-sm transition-all ease-in-out duration-300"
          >
            <i>
              <FilePlus size={20} />
            </i>
            Criar Playlist
          </Link>
        </article>
      </aside>
    </>
  );
}

export default AsideDashboard;
