"use client";

import React from "react";

// Next
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

// Services
import { getPostsById } from "@/services/get-post-byid";
import { putPost } from "@/services/put-post";
import { postImage } from "@/services/post-image";

// Lucide Icons
import { Upload, ArrowLeft } from "lucide-react";

// Components

// Data
import { categories } from "@/data/data";
import { Button } from "@/components/ui/button";
import TextEditorTiptap from "@/components/TextEditorTiptap";

type Post = {
  _id: string;
  title: string;
  content: string;
  tags: string;
  category: string;
  url: string;
  urlPost: string;
  file: File | null;
};

export default function Page({
  _id,
  title,
  content,
  tags,
  category,
  url,
  urlPost,
  file,
}: Post) {
  const params = useParams<{ _id: string }>();

  const router = useRouter();

  // Enviando publicação
  const [isLoading, setIsLoading] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);

  // Erro no envio da publicação
  const [error, setError] = React.useState("");

  // Referencia da imagem
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [newImageUrl, setNewImageUrl] = React.useState(""); // Adicione um estado para a nova URL da imagem
  const [selectedNewFile, setSelectedNewFile] = React.useState<File | null>(
    null
  );
  const [newImagemUploaded, setNewImageUploaded] = React.useState(false);

  // Editar publicação
  const [richText, setRichText] = React.useState("");
  const [editedPost, setEditedPost] = React.useState({
    title: title,
    content: content,
    category: category,
    tags: tags,
    url: url,
    urlPost: urlPost,
    file: file,
  });

  // Tratar o envio do formulário
  const handleInputChange = (e: any) => {
    const { name, value, files, type } = e.target;

    if (type === "file" && files) {
      // Se o campo for um arquivo, armazene o arquivo selecionado
      setEditedPost({
        ...editedPost,
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
      setEditedPost({
        ...editedPost,
        [name]: value,
      });
    }
  };

  // Enviar publicação
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      // Chame a função putProduct para enviar os dados atualizados à API
      const response = await putPost(
        params._id,
        editedPost.title,
        editedPost.content,
        editedPost.tags,
        editedPost.category,
        editedPost.url,
        editedPost.file,
        editedPost.urlPost
      );
      if (response) {
        console.log("Publicação atualizado com sucesso");
        //setSubmitAttempted(true);
      } else {
        console.error("Erro ao atualizar a publicação");
      }
      setRefresh(true);
    } catch (error) {
      console.error("Erro ao atualizar a publicação:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Limpar o campo de file
  const handleClearFile = () => {
    setEditedPost({
      ...editedPost,
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
      setEditedPost((prevData) => ({
        ...prevData,
        file: newFile,
      }));
    }
  };

  // Função para enviar a imagem para a API
  const handleUploadImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editedPost.file) {
      const newImageUrl = await postImage(editedPost.file);
      if (newImageUrl) {
        setNewImageUploaded(true);
        setEditedPost({
          ...editedPost,
          url: newImageUrl,
        });
      }
    }
  };

  // Buscar publicação
  React.useEffect(() => {
    try {
      const response = getPostsById(params._id).then((response) => {
        setEditedPost({
          title: response.title,
          content: response.content,
          category: response.category,
          tags: response.tags,
          url: response.url,
          urlPost: response.urlPost,
          file: response.file,
        });
      });
    } catch (erro) {
      console.log("Não foi possível buscar a publicação" + erro);
    }
  }, []);

  // Ir para o dashboard
  React.useEffect(() => {
    if (refresh) {
      router.push("/Dashboard");
    }
  }, [refresh]);

  // Limpar o state da newImageUploaded quando o componente for desmontado
  React.useEffect(() => {
    return () => {
      setNewImageUploaded(false);
    };
  }, []);

  console.log(editedPost.file);

  return (
    <section className="w-[900px] mt-2">
      <article className="relative">
        <Button
          onClick={() => router.back()}
          className="absolute top-5 left-[-70px]"
        >
          <ArrowLeft />
        </Button>
        <div className="px-5 py-3">
          <h2 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Editar Publicação
          </h2>
        </div>
        <form className="px-5 py-3 flex flex-col gap-5">
          {/*Enviar imagem de capa */}
          <label
            htmlFor="file"
            className="relative group flex w-full h-[400px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-md overflow-hidden cursor-pointer"
          >
            {editedPost.url && (
              <>
                <img
                  src={editedPost.url}
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
            {editedPost.file && (
              <>
                <img
                  src={URL.createObjectURL(editedPost.file)}
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
          {editedPost.file && newImagemUploaded === true ? (
            <p className="w-full text-center text-white font-semibold py-2 rounded bg-green-900">
              Imagem enviada!
            </p>
          ) : (
            <Button onClick={handleUploadImage}>Anexar nova imagem</Button>
          )}
          {/* Titulo */}
          <label htmlFor="title" className="mb-4">
            <span className="font-bold block text-lg">Título</span>
            <input
              type="text"
              id="title"
              name="title"
              value={editedPost.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 font-normal border rounded-lg focus:outline-none focus:ring focus:border-blue-100"
            />
          </label>
          {/* Conteúdo */}
          <label htmlFor="content" className="mb-4">
            <span className="font-bold block text-lg">Conteúdo</span>
            <TextEditorTiptap
              content={editedPost.content}
              onChange={(newContent: string) => {
                setRichText(newContent);
                setEditedPost({ ...editedPost, content: newContent });
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
                value={editedPost.tags}
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
                value={editedPost.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 font-normal border rounded-lg focus:outline-none focus:ring focus:border-blue-100"
              >
                <option>Selecione</option>
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
              Editar Publicação
            </button>
          )}
        </form>
      </article>
    </section>
  );
}
