"use client";
import React from "react";

// Next
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

// API
import api from "@/services/api";
import { getAllCourses } from "@/services/course";
import { getModuleById, putModuleById } from "@/services/module";

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

type Module = {
  title: string;
  description: string;
  courseId: string;
};

interface Course {
  _id: string;
  title: string;
}

export default function Page({ title, description, courseId }: Module) {
  // Params
  const params = useParams<{ _id: string }>();

  // Enviando modulo
  const [isLoading, setIsLoading] = React.useState(false);
  const [moduleSended, setModuleSended] = React.useState(false);

  const router = useRouter();

  // Erro no envio da publicação
  const [error, setError] = React.useState("");

  // State editar modulo
  const [editedModule, setEditedModule] = React.useState({
    title: title,
    description: description,
    courseId: courseId,
  });
  const [moduleTitle, setModuleTitle] = React.useState("");

  // Tiptap
  const [richText, setRichText] = React.useState("");

  // Função de submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Impede o comportamento padrão do formulário de atualizar a página
    setIsLoading(true);
    try {
      const response = await putModuleById(params._id, editedModule);
      setModuleSended(true);
    } catch (error) {
      setError("Erro ao atualizar o curso:");
    }
    setIsLoading(false);
  };

  // Tratar o envio do formulário
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setEditedModule({
      ...editedModule,
      [name]: value,
    });
  };

  // Buscar dados do modulo a ser editado
  React.useEffect(() => {
    try {
      const response = getModuleById(params._id).then((response) => {
        setEditedModule({
          title: response.title,
          description: response.description,
          courseId: response.courseId,
        });
        setModuleTitle(response.title);
      });
    } catch (error) {
      console.log("Não foi possível buscar o modulo" + error);
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

  // Receber a lista de todas os cursos
  const [coursesArray, setCoursesArray] = React.useState<Course[]>([]);
  React.useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courses = await getAllCourses();
        setCoursesArray(courses);
      } catch (e: any) {
        console.error("Erro ao buscar os cursos:", e);
      }
    };

    fetchCourses();
  }, []); // O array vazio assegura que o useEffect só será executado uma vez, equivalente ao componentDidMount

  // Pesquisar cursos por nome para anexar o curso
  const [searchTerm, setSearchTerm] = React.useState("");
  const filteredCourses = coursesArray.filter((courses) =>
    courses.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section
      className={`${windowWidth > 880 ? "w-[900px]" : "w-full"} relative mt-2`}
    >
      {moduleSended && (
        <article className="fixed flex flex-col items-start justify-center px-10 py-10 gap-5 bg-white border border-gray-300 shadow-md rounded-lg z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <h3 className="text-xl font-extrabold">Módulo criado com sucesso!</h3>
          <p className="text-sm text-gray-500">
            Retorne para a página inicial clicando no botão abaixo:
          </p>
          <Button onClick={() => router.push("/")} className="self-end">
            Concluir
          </Button>
        </article>
      )}
      <article className={`relative ${moduleSended ? "blur" : ""}`}>
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
            Editar {moduleTitle}
          </h2>
        </div>
        <form
          onSubmit={handleSubmit}
          method="post"
          className="px-5 py-3 flex flex-col gap-5"
        >
          {/* Titulo */}
          <label htmlFor="title" className="mb-4">
            <span className="font-bold block text-lg">Título do módulo</span>
            <input
              type="text"
              id="title"
              name="title"
              value={editedModule.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 font-normal border rounded-lg focus:outline-none focus:ring focus:border-blue-100"
            />
          </label>
          {/* Descricão */}
          <label htmlFor="description" className="mb-4">
            <span className="font-bold block text-lg">Descricão do módulo</span>
            <TextEditorTiptap
              content={editedModule.description}
              onChange={(newDescription: string) => {
                setRichText(newDescription);
                setEditedModule({
                  ...editedModule,
                  description: newDescription,
                });
              }}
            />
          </label>
          {/* Lista dos cursos */}
          <label htmlFor="courseId" className="mb-4">
            <span className="font-bold block text-lg">
              Anexe o módulo a um curso
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
                id="courseId"
                name="courseId"
                value={editedModule.courseId}
                onChange={(e) => {
                  setEditedModule({
                    ...editedModule,
                    courseId: e.target.value,
                  });
                }}
                className="w-full px-3 py-2 font-normal border-none rounded-lg focus:outline-none"
              >
                <option value="" disabled>
                  Selecionar curso
                </option>
                {filteredCourses.map((course: any) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
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
              Editar Módulo
            </button>
          )}
        </form>
      </article>
    </section>
  );
}
