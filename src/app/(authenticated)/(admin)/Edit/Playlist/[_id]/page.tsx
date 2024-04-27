"use client";
import React from "react";

// Next
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

// Lucide Icons
import { ArrowLeft } from "lucide-react";

// Components
import { Button } from "@/components/ui/button";

// API
import { getPlaylistById, putPlaylistById } from "@/services/playlist";

type Playlist = {
  _id: string;
  title: string;
};

function Page({ _id, title }: Playlist) {
  // Params
  const params = useParams<{ _id: string }>();

  // Enviando playlist
  const [isLoading, setIsLoading] = React.useState(false);

  const [refresh, setRefresh] = React.useState(false);
  const [playlistSended, setPlaylistSended] = React.useState(false);

  const router = useRouter();

  // Erro no envio da publicação
  const [error, setError] = React.useState("");

  // State editar playlist
  const [editedPlaylist, setEditedPlaylist] = React.useState({
    title: title,
  });
  const [playlistTitle, setPlaylistTitle] = React.useState(title);

  // Função de submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Impede o comportamento padrão do formulário de atualizar a página
    setIsLoading(true);
    try {
      const response = await putPlaylistById(params._id, editedPlaylist);
      setPlaylistSended(true);
    } catch (error) {
      setError("Erro ao atualizar a publicação:");
    }
    setIsLoading(false);
  };

  // Tratar o envio do formulário
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;

    setEditedPlaylist({
      ...editedPlaylist,
      [name]: value,
    });
  };

  // Buscar dados da playlist a ser editada
  React.useEffect(() => {
    const response = getPlaylistById(params._id).then((response) => {
      setEditedPlaylist({
        title: response.title,
      });
      setPlaylistTitle(response.title);
    });
  }, []);

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
    <section
      className={`${windowWidth > 880 ? "w-[900px]" : "w-full"} relative mt-2`}
    >
      {playlistSended && (
        <article className="fixed flex flex-col items-start justify-center px-10 py-10 gap-5 bg-white border border-gray-300 shadow-md rounded-lg z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <h3 className="text-xl font-extrabold">
            Playlist editada com sucesso!
          </h3>
          <p className="text-sm text-gray-500">
            Retorne para a página inicial clicando no botão abaixo:
          </p>
          <Button onClick={() => router.push("/")} className="self-end">
            Concluir
          </Button>
        </article>
      )}
      <article className={`relative ${playlistSended ? "blur" : ""}`}>
        <Button
          onClick={() => router.back()}
          className={`absolute top-5 ${
            windowWidth > 1080 ? "left-[-70px]" : "left-[20px]"
          }`}
        >
          <ArrowLeft />
        </Button>
        <div className={`px-5 ${windowWidth > 1080 ? "py-3" : "pt-[5rem]"}`}>
          <h2 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Editar {playlistTitle}
          </h2>
        </div>
        <form
          onSubmit={handleSubmit}
          method="post"
          className="px-5 py-3 flex flex-col gap-5"
        >
          {/* Titulo */}
          <label htmlFor="title" className="mb-4">
            <span className="font-bold block text-lg">Título da playlist</span>
            <input
              type="text"
              id="title"
              name="title"
              value={editedPlaylist.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 font-normal border rounded-lg focus:outline-none focus:ring focus:border-blue-100"
            />
          </label>
          {/* Botão de enviar */}
          {!editedPlaylist ||
          !editedPlaylist.title ||
          editedPlaylist.title.length === 0 ? (
            <p className="flex items-center justify-center w-full py-3 mt-4 bg-gray-500 text-white font-bold rounded-lg focus:outline-none focus:ring focus:border-blue-300">
              Preencha todos os campos corretamente
            </p>
          ) : (
            <>
              {isLoading ? (
                <Button
                  type="submit"
                  className="w-full py-6 mt-4 text-md bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                >
                  Enviando...
                </Button>
              ) : (
                <button
                  type="submit"
                  className="w-full py-3 mt-4 text-md bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                >
                  Editar Playlist
                </button>
              )}
            </>
          )}
        </form>
      </article>
    </section>
  );
}

export default Page;
