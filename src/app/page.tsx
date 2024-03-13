"use client";
import React from "react";

// Components
import TextEditorTiptap from "@/components/TextEditorTiptap";

export default function Home() {
  const [richText, setRichText] = React.useState("");

  const handleRichTextChange = (novoRichText: any) => {
    setRichText(novoRichText);
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-start mx-auto">
      <h1>Home</h1>
      {/* 
      <TextEditorTiptap
        description={richText}
        onChange={handleRichTextChange}
      />*/}
    </div>
  );
}
