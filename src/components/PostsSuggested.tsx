import Link from "next/link";
import React from "react";

// Lucide Icons
import { CalendarDays } from "lucide-react";

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

type PostsSuggestedProps = {
  suggestedPosts: Post[];
};

function PostsSuggested({ suggestedPosts }: PostsSuggestedProps) {
  // resolução da tela
  const [windowWidth, setWindowWidth] = React.useState("");
  // Função para atualizar o state da largura da janela
  const updateWindowWidth = () => {
    if (window.innerWidth > 999) {
      setWindowWidth("desktop");
    } else {
      setWindowWidth("mobile");
    }
  };
  // Atualizar a largura da janela quando a janela for redimensionada
  React.useEffect(() => {
    updateWindowWidth(); // Atualize a largura da janela quando o componente for montado
    window.addEventListener("resize", updateWindowWidth); // Adicione um listener de evento de redimensionamento da janela
    return () => {
      window.removeEventListener("resize", updateWindowWidth); // Remova o listener de evento de redimensionamento da janela quando o componente for desmontado
    };
  }, []);

  // Colocar a primeira letra maiuscula
  const titleTruncatedUpper = (title: string) => {
    return title.charAt(0).toUpperCase() + title.slice(1);
  };

  // Organizar os posts, retornar um objeto com as categorias como chaves
  const postsByCategory: { [category: string]: Post[] } = {};
  suggestedPosts.forEach((post) => {
    if (!postsByCategory[post.category]) {
      postsByCategory[post.category] = [];
    }
    postsByCategory[post.category].push(post);
  });

  // Deixar a primeira letra da categoria maiuscula
  const categoryUpper = (category: string) => {
    if (category) {
      return category.charAt(0).toUpperCase() + category.slice(1);
    } else {
      // Handle the case when category is undefined or null
      console.error("Category is undefined or null");
      return null;
    }
  };

  return (
    <article className="flex flex-col mx-auto min-[1000px]:mx-0 w-full min-[1000px]:w-auto h-fit py-5 px-2 bg-gray-50 min-[1000px]:max-w-[350px]">
      {/*Retornar a categoria, para desktop */}
      {windowWidth === "desktop" ? (
        <>
          {Object.keys(postsByCategory).map((category) => (
            <h3 key={category} className="text-md uppercase text-[#70ADBF]">
              {category}
            </h3>
          ))}
          <div className="flex flex-col gap-5">
            {suggestedPosts.map((post) => (
              <Link
                href={`/${categoryUpper(post.category)}/${post.urlPost}`}
                key={post._id}
                className="flex flex-col gap-2 border-l-[5px] border-[#70ADBF] py-1 pl-1"
              >
                <h3 className="text-md font-semibold font-quickSand">
                  {titleTruncatedUpper(post.title)}
                </h3>
                <div className="flex items-center gap-1 text-[#70ADBF]">
                  <i className="">
                    <CalendarDays size={15} />
                  </i>
                  {post.updatedAt !== post.createdAt ? (
                    <p className="text-sm">{post.updatedAt}</p>
                  ) : (
                    <p className="text-sm">{post.createdAt}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            <h3 className="w-[95%] min-[666px]:w-[80%] mx-auto text-md py-5 border-b-2 font-extrabold text-4xl">
              Sugestões
            </h3>
            <div className="w-[95%] min-[666px]:w-[80%] mx-auto flex flex-wrap items-start justify-center gap-5">
              {suggestedPosts.map((post) => (
                <Link
                  href={`/${categoryUpper(post.category)}/${post.urlPost}`}
                  key={post._id}
                  className="flex flex-col gap-2 py-1"
                >
                  <picture className="min-[566px]:w-[250px] rounded-lg aspect-video overflow-hidden bg-center group">
                    <img
                      src={post.url}
                      alt=""
                      className="shadow-lg w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </picture>
                  <h3 className="min-[566px]:max-w-[250px] break-words text-md font-quickSand font-semibold line-clamp-2">
                    {titleTruncatedUpper(post.title)}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-[#70ADBF]">
                    <i>
                      <CalendarDays size={15} />
                    </i>
                    {post.updatedAt !== post.createdAt ? (
                      <p>{post.updatedAt}</p>
                    ) : (
                      <p>{post.createdAt}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </article>
  );
}

export default PostsSuggested;
