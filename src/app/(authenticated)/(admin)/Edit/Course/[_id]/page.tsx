"use client";
import React from "react";

// Next
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

// API
import api from "@/services/api";
import { getAllPlaylists } from "@/services/playlist";
import { getCourseById, putCourseById } from "@/services/course";
import { postImage } from "@/services/image";

// Lucide Icons
import { Upload, ArrowLeft } from "lucide-react";

// Components
import TextEditorTiptap from "@/components/TextEditorTiptap";
import { Button } from "@/components/ui/button";

// Shadcn
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Course = {
  _id: string;
  title: string;
  description: string;
  playlistId: string;
  file: File | null;
  url: string;
};

interface Playlist {
  _id: string;
  title: string;
}

export default function Page({
  _id,
  title,
  description,
  playlistId,
  file,
  url,
}: Course) {
  // Params
  const params = useParams<{ _id: string }>();

  // Enviando curso
  const [isLoading, setIsLoading] = React.useState(false);
  const [courseSended, setCourseSended] = React.useState(false);

  const router = useRouter();

  // Erro no envio da publicação
  const [error, setError] = React.useState("");

  // Referencia da imagem
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [newImageUrl, setNewImageUrl] = React.useState(""); // Adicione um estado para a nova URL da imagem
  const [selectedNewFile, setSelectedNewFile] = React.useState<File | null>(
    null
  );
  const [newImagemUploaded, setNewImageUploaded] = React.useState(false);

  // State editar curso
  const [editedCourse, setEditedCourse] = React.useState({
    title: title,
    description: description,
    playlistId: playlistId,
    file: file,
    url: url,
  });
  const [courseTitle, setCourseTitle] = React.useState("");

  // Tiptap
  const [richText, setRichText] = React.useState("");

  // Função de submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Impede o comportamento padrão do formulário de atualizar a página
    setIsLoading(true);
    try {
      const response = await putCourseById(params._id, editedCourse);
      setCourseSended(true);
    } catch (error) {
      setError("Erro ao atualizar o curso:");
    }
    setIsLoading(false);
  };

  // Tratar o envio do formulário
  const handleInputChange = (e: any) => {
    const { name, value, files, type } = e.target;

    if (type === "file" && files) {
      // Se o campo for um arquivo, armazene o arquivo selecionado
      setEditedCourse({
        ...editedCourse,
        [name]: (e.target as HTMLInputElement).files?.[0] || null, // Use apenas o primeiro arquivo se houver vários
      });

      // Exiba o modal de preview da imagem
      const file = files[0];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        //setPreviewImage(e.target.result);
        //setShowImageModal(true);
      };

      reader.readAsDataURL(file);
    } else {
      setEditedCourse({
        ...editedCourse,
        [name]: value,
      });
    }
  };

  // Limpar o campo de file
  const handleClearFile = () => {
    setEditedCourse({
      ...editedCourse,
      url: "", // Limpe a URL da imagem
      file: null, // Limpe o arquivo
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Limpe o valor do elemento de entrada de arquivo
    }
  };

  // Nova imagem selecionada
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFile = e.target.files[0];
      setSelectedNewFile(newFile);

      // Atualize o estado do novo arquivo no objeto editedProduct
      setEditedCourse((prevData) => ({
        ...prevData,
        file: newFile,
      }));
    }
  };

  // Função para enviar a imagem para a API
  const handleUploadImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editedCourse.file) {
      const newImageUrl = await postImage(editedCourse.file);
      if (newImageUrl) {
        setNewImageUploaded(true);
        setEditedCourse({
          ...editedCourse,
          url: newImageUrl,
        });
        console.log("URL da imagem do curso: " + editedCourse.url);
      }
    }
  };

  // Buscar dados do curso a ser editado
  React.useEffect(() => {
    try {
      const response = getCourseById(params._id).then((response) => {
        setEditedCourse({
          title: response.title,
          description: response.description,
          playlistId: response.playlistId,
          file: null,
          url: response.url,
        });
        setCourseTitle(response.title);
      });
    } catch (error) {
      console.log("Não foi possível buscar o curso" + error);
    }
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

  // Receber a lista de todas as playlists
  const [playlistsArray, setPlaylistsArray] = React.useState<Playlist[]>([]);
  React.useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const playlists = await getAllPlaylists();
        setPlaylistsArray(playlists);
      } catch (e: any) {
        console.error("Erro ao buscar playlists:", e);
      }
    };

    fetchPlaylists();
  }, []); // O array vazio assegura que o useEffect só será executado uma vez, equivalente ao componentDidMount

  // Pesquisar playlists por nome para anexar o curso
  const [searchTerm, setSearchTerm] = React.useState("");
  const filteredPlaylists = playlistsArray.filter((playlist) =>
    playlist.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section
      className={`${windowWidth > 880 ? "w-[900px]" : "w-full"} relative mt-2`}
    >
      {courseSended && (
        <article className="fixed flex flex-col items-start justify-center px-10 py-10 gap-5 bg-white border border-gray-300 shadow-md rounded-lg z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <h3 className="text-xl font-extrabold">Curso criado com sucesso!</h3>
          <p className="text-sm text-gray-500">
            Retorne para a página inicial clicando no botão abaixo:
          </p>
          <Button onClick={() => router.push("/")} className="self-end">
            Concluir
          </Button>
        </article>
      )}
      <article className={`relative ${courseSended ? "blur" : ""}`}>
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
            Editar {courseTitle}
          </h2>
        </div>
        <form
          onSubmit={handleSubmit}
          method="post"
          className="px-5 py-3 flex flex-col gap-5"
        >
          {/*Enviar imagem de capa */}
          <label
            htmlFor="file"
            className={`relative group flex w-full ${
              windowWidth > 680 ? "h-[400px]" : "h-[300px] aspect-video"
            } ${
              windowWidth < 480 && "aspect-video h-[250px]"
            } bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-md overflow-hidden cursor-pointer`}
          >
            {editedCourse.url && (
              <>
                <img
                  src={editedCourse.url}
                  alt="Imagem selecionada"
                  className={`absolute inset-0 z-10 object-cover w-full h-full border-dashed border-2 group-hover:opacity-50 transition-all ease-in-out duration-300`}
                />
                <Button
                  onClick={handleClearFile}
                  className="z-10 -mt-5 absolute top-1/2 right-1/2 translate-x-1/2 translate-y-1/2 shadow-md hidden group-hover:block transition-all ease-in-out duration-300"
                >
                  Remover imagem
                </Button>
              </>
            )}
            {!url && (
              <input
                type="file"
                id="file"
                name="file"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            )}
            {editedCourse.file && (
              <>
                <img
                  src={URL.createObjectURL(editedCourse.file)}
                  alt="Imagem selecionada"
                  className={`absolute inset-0 z-10 object-cover w-full h-full border-dashed border-2 group-hover:opacity-50 transition-all ease-in-out duration-300`}
                />
                <Button
                  onClick={handleClearFile}
                  className="z-10 -mt-5 absolute top-1/2 right-1/2 translate-x-1/2 translate-y-1/2 shadow-md hidden group-hover:block transition-all ease-in-out duration-300"
                >
                  Remover imagem
                </Button>
              </>
            )}
          </label>
          {editedCourse.file && newImagemUploaded ? (
            <p className="w-full text-center text-white font-semibold py-2 rounded bg-green-900">
              Imagem enviada!
            </p>
          ) : (
            <Button onClick={handleUploadImage}>Anexar nova imagem</Button>
          )}
          {/* Titulo */}
          <label htmlFor="title" className="mb-4">
            <span className="font-bold block text-lg">Título do curso</span>
            <input
              type="text"
              id="title"
              name="title"
              value={editedCourse.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 font-normal border rounded-lg focus:outline-none focus:ring focus:border-blue-100"
            />
          </label>
          {/* Descricão */}
          <label htmlFor="description" className="mb-4">
            <span className="font-bold block text-lg">Descricão do curso</span>
            <TextEditorTiptap
              content={editedCourse.description}
              onChange={(newDescription: string) => {
                setRichText(newDescription);
                setEditedCourse({
                  ...editedCourse,
                  description: newDescription,
                });
              }}
            />
          </label>
          {/* Lista das playlists */}
          <label htmlFor="playlistId" className="mb-4">
            <span className="font-bold block text-lg">
              Anexe o curso a uma playlist
            </span>
            <div className="flex flex-col border rounded-lg focus:outline-none focus:ring focus:border-blue-100">
              <label htmlFor="search" className="-mb-3 pl-1">
                <input
                  type="text"
                  id="search"
                  placeholder="Digite aqui para buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 font-normal border-none rounded-lg focus:outline-none"
                />
              </label>
              <select
                id="playlistId"
                name="playlistId"
                value={editedCourse.playlistId}
                onChange={(e) => {
                  setEditedCourse({
                    ...editedCourse,
                    playlistId: e.target.value,
                  });
                }}
                className="w-full px-3 py-2 font-normal border-none rounded-lg focus:outline-none"
              >
                <option value="" disabled>
                  Selecionar playlist
                </option>
                {filteredPlaylists.map((playlist) => (
                  <option key={playlist._id} value={playlist._id}>
                    {playlist.title}
                  </option>
                ))}
              </select>
            </div>
          </label>
          {/* Botão de enviar */}
          {isLoading ? (
            <h3 className="w-full flex items-center justify-center py-3 mt-4 bg-blue-300 hover:bg-blue-600 text-white font-bold rounded-lg focus:outline-none focus:ring focus:border-blue-300">
              Enviando...
            </h3>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading} // Se estiver carregando, desabilite o botão
              className="w-full py-3 mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            >
              Editar Curso
            </button>
          )}
        </form>
      </article>
    </section>
  );
}
