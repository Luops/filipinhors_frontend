"use client";
import React from "react";

// Next
import { useRouter } from "next/navigation";

// API
import api from "@/services/api";

// React Hook Form
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Lucide Icons
import { Upload, ArrowLeft } from "lucide-react";

// Components
import TextEditorTiptap from "@/components/TextEditorTiptap";

// Data
import { categories } from "@/data/data";
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

type Post = {
  title: string;
  content: string;
  tags: string;
  category: string;
  file: File | null;
};

export default function PostCreationForm() {
  // Enviando publicação
  const [isLoading, setIsLoading] = React.useState(false);
  const [postSended, setPostSended] = React.useState(false);

  const router = useRouter();

  // Erro no envio da publicação
  const [error, setError] = React.useState("");

  //useState da publicação
  const [formData, setFormData] = React.useState<Post>({
    title: "",
    content: "",
    category: "",
    tags: "",
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
      formDataToSend.append("content", formData.content);
      formDataToSend.append("tags", formData.tags);
      formDataToSend.append("category", formData.category);
      if (formData.file instanceof File) {
        formDataToSend.append("file", formData.file);
      }

      // Faça uma chamada para a API do backend com os dados do formulário
      const response = await api.post("post", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data", // Importante definir o tipo de conteúdo como multipart/form-data
        },
      });
      setPostSended(true);
      console.log("Publicação criada com sucesso:", response.data);
    } catch (e) {
      console.error("Erro ao criar produto:", e);
      setError("Erro ao criar produto: " + e);
    } finally {
      setIsLoading(false);
    }
  };

  // Tratar o envio do formulário
  const handleInputChange = (e: any) => {
    const { name, value, files, type } = e.target;

    if (type === "file" && files) {
      // Se o campo for um arquivo, armazene o arquivo selecionado
      setFormData({
        ...formData,
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
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  React.useEffect(() => {
    window.scrollTo(0, 0); // Isso irá rolar a página para o topo após o carregamento
  }, []);

  return (
    <section className="w-[900px] relative mt-2">
      {postSended && (
        <article className="fixed flex flex-col items-start justify-center px-10 py-10 gap-5 bg-white border border-gray-300 shadow-md rounded-lg z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <h3 className="text-xl font-extrabold">
            Publicação criada com sucesso!
          </h3>
          <p className="text-sm text-gray-500">
            Retorne para a página inicial clicando no botão abaixo:
          </p>
          <Button
            onClick={() => router.push("/Dashboard")}
            className="self-end"
          >
            Concluir
          </Button>
        </article>
      )}
      <article className={`relative ${postSended ? "blur" : ""}`}>
        <Button
          onClick={() => router.back()}
          className="absolute top-5 left-[-70px]"
        >
          <ArrowLeft />
        </Button>
        <div className="px-5 py-3">
          <h2 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Criar Publicação
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
            className="relative group flex w-full h-[400px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-md overflow-hidden cursor-pointer"
          >
            {formData.file ? (
              <>
                <img
                  src={URL.createObjectURL(formData.file)}
                  alt="Imagem selecionada"
                  className={`absolute inset-0 z-10 object-cover w-full h-full border-dashed border-2 group-hover:opacity-50 transition-all ease-in-out duration-300`}
                />
                <Button
                  onClick={() => setFormData({ ...formData, file: null })}
                  className="z-10 -mt-5 absolute top-1/2 right-1/2 translate-x-1/2 translate-y-1/2 shadow-md hidden group-hover:block transition-all ease-in-out duration-300"
                >
                  Remover imagem
                </Button>
              </>
            ) : (
              <span className="absolute w-full flex self-center justify-center items-center gap-3 scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl text-white">
                <i>
                  <Upload size={30} />
                </i>
                {formData.file ? "Imagem selecionada" : "Selecionar imagem"}
              </span>
            )}
            {!formData.file && (
              <input
                type="file"
                id="file"
                name="file"
                onChange={handleInputChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            )}
          </label>
          {/* Titulo */}
          <label htmlFor="title" className="mb-4">
            <span className="font-bold block text-lg">Título</span>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 font-normal border rounded-lg focus:outline-none focus:ring focus:border-blue-100"
            />
          </label>
          {/* Conteúdo */}
          <label htmlFor="content" className="mb-4">
            <span className="font-bold block text-lg">Conteúdo</span>
            <TextEditorTiptap
              content={richText}
              onChange={(newContent: string) => {
                setRichText(newContent);
                setFormData({ ...formData, content: newContent });
              }}
            />
          </label>
          <div className="w-full flex gap-3 mb-4">
            {/*Tags */}
            <label htmlFor="tags" className="w-full">
              <span className="font-bold block text-lg">Tags</span>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-3 py-2 font-normal border rounded-lg focus:outline-none focus:ring focus:border-blue-100"
              />
            </label>
            {/*Category */}
            <label htmlFor="category" className="w-full">
              <span className="font-bold block text-lg">Categoria</span>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={(e) => {
                  handleInputChange(e); // Chamando a função handleInputChange para atualizar o estado do formulário
                  setFormData({ ...formData, category: e.target.value }); // Atualizando explicitamente o estado de category
                }}
                className="w-full px-3 py-2.5 font-normal border rounded-lg focus:outline-none focus:ring focus:border-blue-100"
              >
                <option value="">Selecione</option>
                {categories.map((categories) => (
                  <option
                    key={categories.id}
                    value={categories.value}
                    className=""
                  >
                    {categories.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {/* Botão de enviar */}
          {formData.title.length === 0 ||
          formData.content.length === 0 ||
          formData.category.length === 0 ||
          formData.file === null ||
          formData.content.length === 0 ? (
            <p className="flex items-center justify-center w-full py-3 mt-4 bg-gray-500 text-white font-bold rounded-lg focus:outline-none focus:ring focus:border-blue-300">
              Preencha todos os campos corretamente
            </p>
          ) : (
            <button
              type="submit"
              className="w-full py-3 mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            >
              Criar Publicação
            </button>
          )}
        </form>
      </article>
    </section>
  );
}
