import React from "react";

type Post = {
  _id: string;
  title: string;
  content: string;
  tags: string;
  category: string;
  url: string;
  urlPost: string;
  file: File | null;
  post: Array<any>;
};

function PostComponent({ post }: any) {
  return (
    <section className="w-screen flex flex-col items-center min-[1200px]:w-[900px] min-[1200px]:p-[30px] mt-[-30px]">
      <picture className="w-full overflow-hidden h-[400px] bg-auto bg-no-repeat bg-center">
        <img src={post.url} alt="" className="w-full h-full object-cover" />
      </picture>
      <h3 className="w-full self-start max-[1200px]:px-5 text-4xl font-extrabold mt-4 break-words max-[1200px]:text-justify">{post.title}</h3>
      <div
        dangerouslySetInnerHTML={{ __html: post.content }}
        className="flex flex-col max-[1200px]:px-5 gap-2 leading-6 font-roboto text-[18px] break-words mt-10"
      />
    </section>
  );
}

export default PostComponent;
