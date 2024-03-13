import React from "react";

// Next
import Link from "next/link";

// Icons
import { FilePlus } from "lucide-react";

type Props = {};

function AsideDashboard({}: Props) {
  return (
    <aside className="fixed left-0 flex flex-col w-[200px] h-full bg-slate-800 pt-2">
      <article className="flex flex-col pl-5">
        <p className="text-white font-thin text-md">Bem vindo!</p>
        <h2 className="text-white font-thin tracking-widest text-xl">
          Filipe Rios
        </h2>
      </article>
      <article className="flex flex-col mt-5 ">
        <Link
          href={"/PostCreationForm"}
          className="flex items-center gap-2 text-white font-semibold text-md hover:bg-slate-600 pl-5 py-2 rounded-sm transition-all ease-in-out duration-300"
        >
          <i>
            <FilePlus size={20} />
          </i>
          Criar Publicação
        </Link>
      </article>
    </aside>
  );
}

export default AsideDashboard;
