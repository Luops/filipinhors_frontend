"use client";

import React from "react";

// Next
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

// Services
import { getPostByUrlPost } from "@/services/get-post-byurlpost";

// Components
import PostComponent from "@/components/PostComponent";

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

function Page({
  _id,
  title,
  content,
  tags,
  category,
  url,
  urlPost,
  file,
}: Post) {
  const [post, setPost] = React.useState({
    title: title,
    content: content,
    category: category,
    tags: tags,
    url: url,
    urlPost: urlPost,
    file: file,
  });

  const params = useParams<{ urlPost: string }>();
  const router = useRouter();

  // Buscar os dados da publicação
  React.useEffect(() => {
    const response = getPostByUrlPost(params.urlPost).then((response) => {
      if (response) {
        setPost(response);
      }
    });
  }, []);

  console.log(post);

  return <section>
    {post && <PostComponent post={post} />}
  </section>;
}

export default Page;
