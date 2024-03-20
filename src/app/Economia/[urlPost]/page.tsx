"use client";

import React, { useLayoutEffect } from "react";

// Next
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

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
  createdAt: string;
};

type PageProps = {
  post: Post;
};

interface CustomRouterInstance extends AppRouterInstance {
  isFallback?: boolean;
}

function Page({
  _id,
  title,
  content,
  tags,
  category,
  url,
  urlPost,
  file,
  createdAt,
}: Post) {
  const [post, setPost] = React.useState({
    _id: _id,
    title: title,
    content: content,
    category: category,
    tags: tags,
    url: url,
    urlPost: urlPost,
    file: file,
    createdAt: createdAt,
  });

  const params = useParams<{ urlPost: string }>();
  const router = useRouter() as CustomRouterInstance;

  // Buscar os dados da publicação usando useLayoutEffect
  useLayoutEffect(() => {
    getPostData();
  }, []);

  const getPostData = async () => {
    const response = await getPostByUrlPost(params.urlPost);
    if (response) {
      setPost(response);
    }
  };

  console.log(post);

  return (
    <section className="flex flex-col items-center">
      {post && <PostComponent post={post} />}
    </section>
  );
}

export default Page;
