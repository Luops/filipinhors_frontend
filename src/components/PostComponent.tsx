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
    <section className="flex flex-col items-center w-[900px] min-[1200px]:p-[30px]">
      <h3 className="self-start text-4xl font-extrabold">{post.title}</h3>
      <div
        dangerouslySetInnerHTML={{ __html: post.content }}
        className="flex flex-col gap-2 leading-6 font-roboto text-[18px] break-words mt-10"
      />
    </section>
  );
}

export default PostComponent;
