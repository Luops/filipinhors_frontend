"use client";
import React from "react";

// Next
import { useRouter } from "next/navigation";

// API
import api from "@/services/api";
import { getAllModules } from "@/services/module";

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

type Lesson = {
  title: string;
  description: string;
  videoUrl: string;
  minutes: number;
  moduleId: string;
  file: File | null;
};

interface Module {
  _id: string;
  title: string;
}

export default function CreateLesson() {
  // Enviando aula
  const [isLoading, setIsLoading] = React.useState(false);
  const [lessonSended, setLessonSended] = React.useState(false);

  const router = useRouter();

  // Erro no envio da publicação
  const [error, setError] = React.useState("");

  //useState da publicação
  const [formData, setFormData] = React.useState<Lesson>({
    title: "",
    description: "",
    moduleId: "",
    videoUrl: "",
    minutes: 0,
    file: null,
  });

  // Tiptap
  const [richText, setRichText] = React.useState("");

  // Função de submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Impede o comportamento padrão do formulário de atualizar a página
    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("moduleId", formData.moduleId);
      formDataToSend.append("videoUrl", formData.videoUrl);
      formDataToSend.append("minutes", formData.minutes.toString());
      if (formData.file) {
        formDataToSend.append("file", formData.file);
      }

      // Faça uma chamada para a API do backend com os dados do formulário
      const response = await api.post("lesson", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data", // Importante definir o tipo de conteúdo como multipart/form-data
        },
      });
      setLessonSended(true);
      console.log("Aula criada com sucesso:", response.data);
    } catch (e) {
      console.error("Erro ao criar a aula:", e);
      setError("Erro ao criar a aula: " + e);
    } finally {
      setIsLoading(false);
    }
  };

  const [file, setFile] = React.useState(null);
  console.log(file);

  // Tratar o envio do formulário
  const handleInputChange = (e: any) => {
    const { name, value, files, type } = e.target;

    if (type === "file" && files) {
      // Se o campo for um arquivo, armazene o arquivo selecionado
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).files?.[0] || null, // Use apenas o primeiro arquivo se houver vários
      });

      // Exiba o nome do arquivo selecionado
      if (files.length > 0) {
        console.log(files[0].name);
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

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

  const handleRemoveFile = () => {
    setFile(null); // Remove o arquivo selecionado
  };

  return (
    <section
      className={`${windowWidth > 880 ? "w-[900px]" : "w-full"} relative mt-2`}
    >
      {lessonSended && (
        <article className="fixed flex flex-col items-start justify-center px-10 py-10 gap-5 bg-white border border-gray-300 shadow-md rounded-lg z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <h3 className="text-xl font-extrabold">Aula criada com sucesso!</h3>
          <p className="text-sm text-gray-500">
            Retorne para a página inicial clicando no botão abaixo:
          </p>
          <Button onClick={() => router.push("/")} className="self-end">
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
            Criar Aula
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
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 font-normal border rounded-lg focus:outline-none focus:ring focus:border-blue-100"
            />
          </label>
          {/* Descricão */}
          <label htmlFor="description" className="mb-4">
            <span className="font-bold block text-lg">Descricão da aula</span>
            <TextEditorTiptap
              content={richText}
              onChange={(newDescription: string) => {
                setRichText(newDescription);
                setFormData({ ...formData, description: newDescription });
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
                value={formData.moduleId}
                onChange={(e) => {
                  setFormData({ ...formData, moduleId: e.target.value });
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
                value={formData.videoUrl}
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
                value={formData.minutes}
                onChange={handleInputChange}
                className="w-full px-3 py-2 font-normal border rounded-lg focus:outline-none focus:ring focus:border-blue-100"
              />
            </label>
          </div>
          {/* Extras - Enviar arquivos extras (pdf)*/}
          <label htmlFor="file" className="mb-4">
            <span className="font-bold block text-lg">Anexar PDF</span>
            <input
              type="file"
              id="file"
              name="file"
              onChange={handleInputChange}
              accept="application/pdf"
              className="w-full px-3 py-2 font-normal border rounded-lg focus:outline-none focus:ring focus:border-blue-100"
            />
            {formData.file && (
              <div className="mt-3">
                <span className="text-sm font-medium">{formData.file.name}</span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, file: null })}
                  className="ml-2 text-red-600 hover:text-red-800 text-sm"
                >
                  Remover
                </button>
              </div>
            )}
          </label>
          {/* Botão de enviar */}
          {formData.title.length === 0 ||
          formData.description.length === 0 ||
          formData.moduleId.length === 0 ||
          formData.videoUrl.length === 0 ||
          formData.minutes === 0 ? (
            <p className="flex items-center justify-center w-full py-3 mt-4 bg-gray-500 text-white font-bold rounded-lg focus:outline-none focus:ring focus:border-blue-300">
              Preencha todos os campos corretamente
            </p>
          ) : (
            <button
              type="submit"
              className="w-full py-3 mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            >
              Criar Aula
            </button>
          )}
        </form>
      </article>
    </section>
  );
}
