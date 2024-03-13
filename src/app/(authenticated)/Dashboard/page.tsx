"use client";
import React from "react";

import axios from "axios";

// Next
import Link from "next/link";
import { useRouter } from "next/navigation";

// services
import { getPostsDesc } from "@/services/get-posts-desc";
import { deletePost } from "@/services/delete-post";
import { getPostsSearch } from "@/services/get-posts-search";

// Components
import AsideDashboard from "@/components/AsideDashboard";

type Post = {
  _id: string;
  title: string;
  content: string;
  tags: string;
  category: string;
  urlPost: string;
  url: string;
  file: File | null;
};

// Shadcn
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function Dashboard({}: Post) {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refresh, setRefresh] = React.useState(false);

  // Router
  const router = useRouter();

  // Input de pesquisa das publicações para editar ou excluir
  const [searchInput, setSearchInput] = React.useState("");

  // Colocar pontos no final do titulo se passar de 40 caracteres
  const titleTruncatedUpper = (title: string) => {
    if (title.length > 50) {
      return (
        title.charAt(0).toUpperCase() + title.slice(1).substring(0, 50) + "..."
      );
    }
    return title.charAt(0).toUpperCase() + title.slice(1);
  };

  // Deixar a primeira letra maiúscula da categoria
  const categoryUpper = (category: string) => {
    if (category) {
      return category.charAt(0).toUpperCase() + category.slice(1);
    } else {
      // Handle the case when category is undefined or null
      console.error("Category is undefined or null");
      return "";
    }
  };

  // Deletar publicação
  const handleDelete = async (_id: string) => {
    try {
      await deletePost(_id);
      setRefresh(!refresh);
    } catch (error) {
      console.error("Erro ao deletar publicação:", error);
    }
  };

  React.useEffect(() => {
    try {
      const response = getPostsSearch(searchInput).then((response) => {
        setLoading(false);
        setPosts(response);
        return response;
      });
    } catch (error) {
      console.error("Erro ao buscar postagens:", error);
    }
  }, [refresh, searchInput]);

  console.log(posts);

  return (
    <section className="relative min-h-screen !w-full flex justify-between">
      <AsideDashboard />
      {/* Lista das publicações (editar, deletar) */}
      <article className="w-full flex flex-col items-start justify-start pl-[240px] mt-4 gap-3">
        <div className="flex flex-col gap-4">
          <h3 className="text-3xl font-extrabold drop-shadow-xl text-gray-500">
            Publicações
          </h3>
          <p className="text-gray-500">
            Abaixo você pode alterar ou deletar as publicações que desejar.
          </p>
        </div>
        <form action="">
          <label htmlFor="search" className="flex gap-2">
            <input
              type="text"
              id="search"
              placeholder="Pesquisar"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-[1000px] border rounded px-3 py-1 focus:outline-none focus:border-black focus:border-b-2 shadow-sm"
            />
          </label>
        </form>
        <table className="w-[1000px] flex flex-col border rounded px-3 py-2 shadow-sm">
          {/*Cabecalho da tabela*/}
          <thead className="flex w-full justify-between font-semibold text-slate-500 border-b mb-2">
            <tr className="flex gap-[7rem]">
              <td>
                <p>Imagem</p>
              </td>
              <td>
                <p>Título</p>
              </td>
            </tr>
            <tr className="flex gap-[3.5rem]">
              <td className="">
                <p>Categoria</p>
              </td>
              <td>
                <p>Opções</p>
              </td>
            </tr>
          </thead>
          {/*Dados da tabela (Publicações)*/}
          <tbody className="flex flex-col w-full gap-4">
            {posts ? (
              posts.map((post) => (
                <tr
                  key={post._id}
                  className="flex w-full justify-between border-b pb-1"
                >
                  <td className="flex">
                    <figure>
                      <img
                        src={post.url}
                        alt="Imagem"
                        className="w-[100px] max-h-[80px] shadow-sm rounded-sm bg-center bg-cover"
                      />
                    </figure>
                    <p className="ml-[4.5rem] text-gray-500">
                      {titleTruncatedUpper(post.title)}
                    </p>
                  </td>
                  <td className="flex">
                    <p className="pr-[4.2rem] text-gray-500">
                      {categoryUpper(post.category)}
                    </p>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="pb-1 font-bold mr-2 h-[35px] shadow-sm cursor-pointer hover:border-slate-500 border border-white rounded-md px-2 transition-all ease-in-out duration-300">
                        ...
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="">
                        <DropdownMenuItem>
                          <Link
                            href={`/${categoryUpper(post.category)}/${
                              post.urlPost
                            }`}
                            className="cursor-pointer"
                          >
                            Ver
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link
                            href={`Dashboard/EditPost/${post._id}`}
                            className="cursor-pointer"
                          >
                            Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(post._id)}
                          className="cursor-pointer"
                        >
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            ) : (
              <p>Nenhuma publicação encontrada</p>
            )}
          </tbody>
        </table>
      </article>
    </section>
  );
}
