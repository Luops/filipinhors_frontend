"use client";
import React from "react";

// Services
import { getSuggestedPost } from "@/services/get-posts-suggested";

// Lucide Icons
import { CalendarDays } from "lucide-react";

// Components
import PostsSuggested from "./PostsSuggested";

type Post = {
  _id: string;
  title: string;
  content: string;
  tags: string;
  category: string;
  url: string;
  urlPost: string;
  file: File | null;
  createdAt: string;
  updatedAt: string;
  post: Array<any>;
};

function PostComponent({ post }: any) {
  // Sugestão de posts
  const [suggestedPosts, setSuggestedPosts] = React.useState<Post[]>([]);

  // Cor do bg da categoria
  const [categoryBgColor, setCategoryBgColor] = React.useState("");
  React.useEffect(() => {
    // Função para definir a cor com base na categoria
    const getCategoryColor = (category: string) => {
      switch (category) {
        case "economia":
          return "bg-[#00B894]";
        case "empregos":
          return "bg-blue-500";
        case "campanha":
          return "bg-red-500";
        default:
          return "bg-gray-500"; // Cor padrão para categorias não reconhecidas
      }
    };

    // Define a cor com base na categoria do post
    setCategoryBgColor(getCategoryColor(post.category));
  }, [post.category]); // Dependência do useEffect

  // Colocar a primeira letra maiuscula do titulo
  const titleTruncatedUpper = (title: string) => {
    if (title) {
      return title.charAt(0).toUpperCase() + title.slice(1);
    }
  };

  // Categoria com letra maiuscula
  const categoryUpper = (category: string) => {
    if (category) {
      return category.charAt(0).toUpperCase() + category.slice(1);
    } else {
      // Handle the case when category is undefined or null
      console.error("Category is undefined or null");
      return null;
    }
  };

  // Receber publicações sugeridas
  React.useEffect(() => {
    const response = getSuggestedPost(post._id).then((response) => {
      if (response) {
        setSuggestedPosts(response);
      }
    });
  }, [post._id]);

  return (
    <section className="w-screen flex flex-col min-[1000px]:flex-row justify-center min-[1000px]:p-[30px] mt-4 gap-5">
      {/*Conteudo*/}
      <div className="flex flex-col min-[1000px]:w-[900px] items-center">
        <p
          className={`self-start max-[1200px]:ml-5 p-[10px] text-white text-md font-semibold break-words ${categoryBgColor} px-3 py-1 drop-shadow-3xl`}
        >
          {categoryUpper(post.category)}
        </p>
        <h3 className="w-full self-start font-quickSand max-[1200px]:px-5 text-4xl font-extrabold break-words max-[520px]:text-start max-[1200px]:text-justify">
          {titleTruncatedUpper(post.title)}
        </h3>
        <div className="w-full flex items-center mt-3 gap-5 italic bg-slate-100 shadow-md py-3 px-3 min-[1200px]:px-5 text-gray-500">
          <div className="flex items-center justify-center gap-2">
            <picture className="h-[30px]">
              <img
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                alt=""
                className="h-full rounded-full"
              />
            </picture>
            <p className="">Criado por: Filipe Rios</p>
          </div>
          {post.updatedAt !== post.createdAt ? (
            <p className="flex items-center gap-2">
              <CalendarDays size={20} />
              {post.updatedAt}
            </p>
          ) : (
            <p className="flex items-center gap-2">
              <CalendarDays size={20} />
              {post.createdAt}
            </p>
          )}
        </div>
        <picture className="w-full overflow-hidden max-[520px]:h-[250px] h-[400px] bg-auto bg-no-repeat bg-center shadow-[0px_0px_10px_5px_#1b191929] mt-2">
          <img src={post.url} alt="" className="w-full h-full object-cover" />
        </picture>
        <div
          dangerouslySetInnerHTML={{
            __html: post.content,
          }}
          className="w-full flex flex-col max-[768px]:px-10 max-[1200px]:px-5 gap-2 leading-6 font-roboto text-[18px] break-words mt-10"
        />
      </div>
      {/* Sugestões de publicações */}
      <PostsSuggested suggestedPosts={suggestedPosts} />
    </section>
  );
}

export default PostComponent;
