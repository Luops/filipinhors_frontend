"use client";
import React from "react";

// Next
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

// API
import api from "@/services/api";
import { getAllModules } from "@/services/module";
import { getLessonById, putLessonById } from "@/services/lesson";
import { postImage } from "@/services/image";

// Lucide Icons
import { Upload, ArrowLeft } from "lucide-react";
import { BsFilePdf } from "react-icons/bs"; // Importe o ícone de PDF

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

type Lesson = {
  title: string;
  description: string;
  videoUrl: string;
  minutes: number;
  moduleId: string;
  file: File | null;
  url: string;
  nameImage: string;
  key: string;
};

interface Module {
  _id: string;
  title: string;
}

export default function Page({
  title,
  description,
  videoUrl,
  minutes,
  moduleId,
  file,
  url,
  nameImage,
  key,
}: Lesson) {
  // Params
  const params = useParams<{ _id: string }>();

  // Enviando aula
  const [isLoading, setIsLoading] = React.useState(false);
  const [lessonSended, setLessonSended] = React.useState(false);

  const router = useRouter();

  // Erro no envio da publicação
  const [error, setError] = React.useState("");

  // Referencia o arquivo
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [newFileUrl, setNewFileUrl] = React.useState(""); // Adicione um estado para a nova URL da imagem
  const [selectedNewFile, setSelectedNewFile] = React.useState<File | null>(
    null
  );
  const [newFileUploaded, setNewFileUploaded] = React.useState(false);

  //useState da aula
  const [editedLesson, setEditedLesson] = React.useState({
    title: title,
    description: description,
    videoUrl: videoUrl,
    minutes: minutes,
    moduleId: moduleId,
    url: url,
    nameImage: nameImage,
    file: file,
    key: key,
  });
  const [lessonTitle, setLessonTitle] = React.useState("");

  // Tiptap
  const [richText, setRichText] = React.useState("");

  // Função de submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Impede o comportamento padrão do formulário de atualizar a página
    setIsLoading(true);
    try {
      const response = await putLessonById(params._id, editedLesson);
      if (response.message === "Título da aula já existe") {
        setError(response.message);
        throw new Error(response.e);
      } else {
        setLessonSended(true);
      }
    } catch (e: any) {
      console.log("Erro ao atualizar a aula:" + e.message);
    }
    setIsLoading(false);
  };

  // Tratar o envio do formulário
  const handleInputChange = (e: any) => {
    const { name, value, files, type } = e.target;

    if (type === "file" && files) {
      // Se o campo for um arquivo, armazene o arquivo selecionado
      setEditedLesson({
        ...editedLesson,
        [name]: (e.target as HTMLInputElement).files?.[0] || null, // Use apenas o primeiro arquivo se houver vários
      });

      // Exiba o nome do arquivo selecionado
      if (files.length > 0) {
        console.log(files[0].name);
      }
    } else {
      setEditedLesson({
        ...editedLesson,
        [name]: value,
      });
    }
  };

  // Limpar o campo de file
  const handleClearFile = () => {
    setEditedLesson({
      ...editedLesson,
      url: "", // Limpe a URL da imagem
      nameImage: "",
      key: "",
      file: null, // Limpe o arquivo
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Limpe o valor do elemento de entrada de arquivo
    }
  };

  // Novo arquivo selecionads
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFile = e.target.files[0];
      setSelectedNewFile(newFile);

      // Atualize o estado do novo arquivo no objeto editedProduct
      setEditedLesson((prevData) => ({
        ...prevData,
        file: newFile,
      }));
    }
  };

  // Função para enviar o arquivo para a API
  const handleUploadFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editedLesson.file) {
      const newFileUrl = await postImage(editedLesson.file);
      if (newFileUrl) {
        setNewFileUploaded(true);
        setEditedLesson({
          ...editedLesson,
          url: newFileUrl.url,
          nameImage: newFileUrl.nameImage,
          key: newFileUrl.key,
        });

        console.log("editedLesson atualizado:", editedLesson);
      }
    }
  };

  // Buscar dados da aula a ser editado
  React.useEffect(() => {
    try {
      const response = getLessonById(params._id).then((response) => {
        setEditedLesson({
          title: response.title,
          description: response.description,
          videoUrl: response.videoUrl,
          minutes: response.minutes,
          moduleId: response.moduleId,
          file: null,
          url: response.url,
          nameImage: response.nameImage,
          key: response.key,
        });
        setLessonTitle(response.title);
      });
    } catch (error) {
      console.log("Não foi possível buscar a aula" + error);
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

  // Receber a lista de todos os modulos
  const [modulesArray, setModulesArray] = React.useState<Module[]>([]);
  React.useEffect(() => {
    const fetchModules = async () => {
      try {
        const modules = await getAllModules();
        setModulesArray(modules);
      } catch (e: any) {
        console.error("Erro ao buscar modulos:", e);
      }
    };

    fetchModules();
  }, []); // O array vazio assegura que o useEffect só será executado uma vez, equivalente ao componentDidMount

  // Pesquisar modulos por nome para anexar o curso
  const [searchTerm, setSearchTerm] = React.useState("");
  const filteredModules = modulesArray.filter((modules) =>
    modules.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section
      className={`${windowWidth > 880 ? "w-[900px]" : "w-full"} relative mt-2`}
    >
      {!lessonSended && (
        <article
          className={`fixed flex flex-col ${windowWidth < 631 && "w-[85%] text-justify"} z-50 items-start justify-center px-10 py-10 gap-5 bg-white border border-gray-300 shadow-md rounded-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
        >
          <h3 className="text-xl font-extrabold">Aula criada com sucesso!</h3>
          <p className="text-sm text-gray-500">
            Retorne para a página inicial clicando no botão abaixo:
          </p>
          <Button onClick={() => router.push("/Dashboard")} className="self-end">
            Concluir
          </Button>
        </article>
      )}
      <article className={`relative ${lessonSended ? "blur" : ""}`}>
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
            Editar {lessonTitle}
          </h2>
        </div>
        <form
          onSubmit={handleSubmit}
          method="post"
          className="px-5 py-3 flex flex-col gap-5"
        >
          {/* Titulo */}
          <label htmlFor="title" className="mb-4">
            <span className="font-bold block text-lg">Título da aula</span>
            <input
              type="text"
              id="title"
              name="title"
              value={editedLesson.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 font-normal border rounded-lg focus:outline-none focus:ring focus:border-blue-100"
            />
            <p className="text-sm text-red-500">{error}</p>
          </label>
          {/* Descricão */}
          <label htmlFor="description" className="mb-4">
            <span className="font-bold block text-lg">Descricão da aula</span>
            <TextEditorTiptap
              content={editedLesson.description}
              onChange={(newDescription: string) => {
                setRichText(newDescription);
                setEditedLesson({
                  ...editedLesson,
                  description: newDescription,
                });
              }}
            />
          </label>
          {/* Lista dos módulos */}
          <label htmlFor="moduleId" className={`w-full`}>
            <span className="font-bold block text-lg">
              Anexe a aula a um módulo
            </span>
            <div
              className={`flex flex-col border rounded-lg focus:outline-none focus:ring focus:border-blue-100`}
            >
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
                id="moduleId"
                name="moduleId"
                value={editedLesson.moduleId}
                onChange={(e) => {
                  setEditedLesson({
                    ...editedLesson,
                    moduleId: e.target.value,
                  });
                }}
                className="w-full px-3 py-2 font-normal border-none rounded-lg focus:outline-none"
              >
                <option value="" disabled>
                  Selecione um módulo
                </option>
                {filteredModules.map((module: any) => (
                  <option key={module._id} value={module._id}>
                    {module.title}
                  </option>
                ))}
              </select>
            </div>
          </label>
          {/* Url do video e minutos */}
          <div
            className={`flex gap-4 justify-between ${
              windowWidth < 680 && "flex-col"
            }`}
          >
            {/* Url do video */}
            <label
              htmlFor="videoUrl"
              className={`mb-4 w-1/2 ${windowWidth < 680 && "w-full"}`}
            >
              <span className="font-bold block text-lg">Url do video</span>
              <input
                type="text"
                id="videoUrl"
                name="videoUrl"
                value={editedLesson.videoUrl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 font-normal border rounded-lg focus:outline-none focus:ring focus:border-blue-100"
              />
            </label>
            {/* Minutos da aula */}
            <label
              htmlFor="minutes"
              className={`mb-4 w-1/2 ${windowWidth < 680 && "w-full"}`}
            >
              <span className="font-bold block text-lg">Minutos de aula</span>
              <input
                type="text"
                id="minutes"
                name="minutes"
                value={editedLesson.minutes}
                onChange={handleInputChange}
                className="w-full px-3 py-2 font-normal border rounded-lg focus:outline-none focus:ring focus:border-blue-100"
              />
            </label>
          </div>
          {/* Extras - Enviar arquivos extras (pdf)*/}
          <label htmlFor="file" className="mb-4">
            <span className="font-bold block text-lg">Anexar PDF</span>
            {editedLesson.url && !newFileUploaded ? (
              <div className="mt-3 flex flex-col items-center">
                <BsFilePdf size={60} className="mr-2 text-red-500" />
                <span className="text-sm font-medium">
                  {editedLesson.nameImage}
                </span>
                <div className="flex gap-5 text-sm">
                  <a
                    href={editedLesson.url}
                    target="_blank"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Visualizar
                  </a>
                  <button
                    type="button"
                    onClick={() => handleClearFile()}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  id="file"
                  name="file"
                  onChange={handleFileChange}
                  accept="application/pdf"
                  className="w-full px-3 py-2 font-normal border rounded-lg focus:outline-none focus:ring focus:border-blue-100"
                />
                <div className="flex gap-5 text-sm">
                  {editedLesson.file && newFileUploaded ? (
                    <p>PDF enviado!</p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleUploadFile}
                      className="text-green-600 hover:text-green-800"
                    >
                      Anexar novo PDF
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      setEditedLesson({ ...editedLesson, file: null })
                    }
                    className="text-red-600 hover:text-red-800"
                  >
                    Remover
                  </button>
                </div>
              </>
            )}
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
              Editar Aula
            </button>
          )}
        </form>
      </article>
    </section>
  );
}
