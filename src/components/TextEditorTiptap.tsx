"use client";
import React from "react";

// Tiptap
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ToolbarTiptap from "./ToolbarTiptap";
import { Heading } from "@tiptap/extension-heading";
import { Image } from "@tiptap/extension-image";
import { YoutubeOptions, Youtube } from "@tiptap/extension-youtube";
import { Link } from "@tiptap/extension-link";
import { TextAlign } from "@tiptap/extension-text-align";
import { Blockquote } from "@tiptap/extension-blockquote";
import { Text } from "@tiptap/extension-text";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import { Underline } from "@tiptap/extension-underline";

type Props = {
  content: string;
  onChange: (richText: string) => void;
};

function TextEditorTiptap({ content, onChange }: Props) {
  const [editorContent, setEditorContent] = React.useState(content);
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      Heading.configure({
        HTMLAttributes: {
          class: "text-3xl",
        },
      }),
      Image.configure({
        inline: true,
        HTMLAttributes: {
          class:
            "flex justify-center items-center mx-auto border shadow-sm w-full aspect-video",
        },
      }),
      Youtube.configure({
        inline: false,
        controls: true,
        allowFullscreen: true,
        autoplay: false,
        interfaceLanguage: "pt-BR",
        ccLanguage: "pt-BR",
        HTMLAttributes: {
          class: "mx-auto rounded-lg border shadow-sm w-full aspect-[16/9] max-[640px]:h-[250px] ",
        },
      }),
      Link.configure({
        openOnClick: true,
        protocols: ["ftp", "mailto"],
        autolink: false,
        HTMLAttributes: {
          class: "text-blue-500 underline",
        },
      }),
      TextAlign.configure({
        types: [
          "heading",
          "paragraph",
          "image",
          "youtube",
          "blockquote",
          "link",
          "list",
          "listItem",
        ],
        alignments: ["left", "right", "justify", "center"],
        defaultAlignment: "left",
      }),
      Blockquote.configure({
        HTMLAttributes: {
          class: "border-l-4 pl-4",
        },
      }),
      Color.configure({
        types: ["textStyle", "heading", "paragraph"],
      }),
      TextStyle,
      Underline.configure({
        HTMLAttributes: {
          class: "underline",
        },
      }),
    ],
    autofocus: true,
    content: content,
    editable: true,
    editorProps: {
      attributes: {
        class:
          "rounded border-l border-2 focus:outline-none focus:border-blue-100 shadow-sm min-h-[250px] text-[18px] max-w-[900px] px-2 py-4 border-input focus:border-[#0000001c] focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      const processedHtmlEditor = processHtml(editor.getHTML());
      onChange(processedHtmlEditor);
      console.log(processedHtmlEditor);
    },
  });

  // Função para processar o HTML gerado pelo Tiptap e transformar para o processamento do tailwindcss e html - Importante para o Frontend
  const processHtml = (html: any) => {
    // Substituir <ul> por <ul class="list-disc pl-5">
    html = html.replace(/<ul(?![^>]*class=")/g, '<ul class="list-disc pl-5"');
    // Substituir <li> por <li class="list-item">
    html = html.replace(/<li(?![^>]*class=")/g, '<li class="list-item"');

    // Substituir <ol> por <ol class="list-decimal pl-5">
    html = html.replace(
      /<ol(?![^>]*class=")/g,
      '<ol class="list-decimal pl-5"'
    );

    // Substituir style="text-align: left" por class="text-left"
    html = html.replace(
      /style="text-align: left"(?![^>]*class=")/g,
      'class="text-left"'
    );

    // Substituir style="text-align: center" por class="text-center"
    html = html.replace(
      /style="text-align: center"(?![^>]*class=")/g,
      'class="text-center"'
    );

    // Substituir style="text-align: justify" por class="text-justify"
    html = html.replace(
      /style="text-align: justify"(?![^>]*class=")/g,
      'class="text-justify"'
    );

    // Substituir style="text-align: right" por class="text-right"
    html = html.replace(
      /style="text-align: right"(?![^>]*class=")/g,
      'class="text-right"'
    );

    // Substituir todas as ocorrências de class por className
    html = html.replace(/style=/g, "class=");

    // Substituir todas as ocorrências de color: por text-
    html = html.replace(/color: ([^"]+)/g, "text-[$1]");

    // Jutar para uma class se houver 2 na tag
    html = html.replace(/class="([^"]+)" class="([^"]+)"/g, 'class="$1 $2"');

    return html;
  };

  // Se tiver em editar (tem conteudo) mostre-o no campo de edição
  React.useEffect(() => {
    if (editor) {
      editor.commands.setContent(content);
    }
  }, [!content, !editor]);
  

  return (
    <div className="w-full flex flex-col">
      {/* 
      <h3 className="text-2xl font-bold text-center">Text Editor - <span className="text-blue-500">Tiptap</span></h3>
     */}
      <ToolbarTiptap editor={editor} />
      <EditorContent editor={editor} className="cursor-text" />
      {/*O componente abaixo será a base para o Frontend 
      <div
        dangerouslySetInnerHTML={{ __html: content }}
        className="flex flex-col gap-2 min-[1200px]:p-[30px] leading-6 font-roboto text-[18px] break-words"
      />
      <textarea disabled value={content} />*/}
    </div>
  );
}

export default TextEditorTiptap;
