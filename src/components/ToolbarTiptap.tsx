"use client";
import React, { useRef } from "react";

import "tailwindcss/tailwind.css";

// Components

// Tiptap
import { type Editor } from "@tiptap/react";
import TextStyle from "@tiptap/extension-text-style";

// Lucide Icons
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Image,
  Youtube,
  Link,
  AlignLeft,
  AlignJustify,
  AlignRight,
  AlignCenter,
  TextQuote,
  Baseline,
  Underline
} from "lucide-react";

// Shadcn UI
import { Toggle } from "./ui/toggle";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";
import Blockquote from "@tiptap/extension-blockquote";

type Props = {
  editor: Editor | null;
};

function ToolbarTiptap({ editor }: Props) {
  const { toast } = useToast();

  /*Formatação da data de adição de imagem, video ou link*/
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  /******************************/

  /*Input de imagem por URL*/
  const [imageUrl, setImageUrl] = React.useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleInsertImageByUrl = () => {
    if (imageUrl && editor) {
      editor
        .chain()
        .focus()
        .insertContent({
          type: "image",
          attrs: {
            src: imageUrl,
            alt: "Alt Text", // Você pode personalizar o texto alternativo
          },
        })
        .run();
      toast({
        title: "Imagem adicionada com sucesso!",
        description: formattedDate,
      });
      setIsDialogOpen(false);
      setImageUrl("");
    }
  };

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  /***************************************/

  /*Input de video por URL*/
  const [videoUrl, setVideoUrl] = React.useState<string>("");

  const handleInsertVideoByUrl = () => {
    if (videoUrl) {
      editor?.commands.setYoutubeVideo({
        src: videoUrl,
      });
      toast({
        title: "Video adicionado com sucesso!",
        description: formattedDate,
      });
    }
  };

  const toggleVideoDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };
  /***********************************/

  /*Opção do Link*/
  const [linkUrl, setLinkUrl] = React.useState("");
  const [isLinkDialogOpen, setIsLinkDialogOpen] = React.useState(false);

  const handleInsertLink = () => {
    if (linkUrl && editor) {
      const { from, to } = editor.state.selection;
      if (from !== to) {
        // Verifica se há texto selecionado
        editor.chain().focus().setLink({ href: linkUrl }).run(); // Aplica o link apenas ao texto selecionado

        toast({
          title: "Link adicionado com sucesso!",
          description: formattedDate,
        });
        setIsLinkDialogOpen(false);
        setLinkUrl("");
      } else {
        // Informa ao usuário para selecionar o texto antes de adicionar o link
        toast({
          title: "Precisa de texto selecionado!",
          description: "Friday, February 10, 2023 at 5:57 PM",
        });
      }
    }
  };

  const toggleLinkDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };
  /***********************************/

  /*Opção de cor*/
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    if (editor) {
      editor.chain().focus().setColor(newColor).run()
    }
  };

  /****************************/

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full flex flex-wrap items-center justify-start px-2 py-1 mb-1 border border-input bg-transparent rounded gap-2">
      {/* Bold */}
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <p className="text-2xl">B</p>
      </Toggle>

      {/* Italic */}
      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-5 w-5" />
      </Toggle>

      {/* Tachado */}
      <Toggle
        size="sm"
        pressed={editor.isActive("strike")}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-5 w-5" />
      </Toggle>

      {/* Heading 2 */}
      <Toggle
        size="sm"
        pressed={editor.isActive("heading")}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
      >
        <Heading2 className="h-5 w-5" />
      </Toggle>

      {/*Underline*/}
      <Toggle
        size="sm"
        pressed={editor.isActive("underline")}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Underline className="h-5 w-5" />
      </Toggle>

      {/*Text color*/}
      <div>
        <input
          type="color"
          value={editor.getAttributes("textStyle").color}
          onInput={
            handleColorChange
          }
          data-testid="setColor"
        />
      </div>

      {/* Blockquote */}
      <Toggle
        size="sm"
        pressed={editor.isActive("blockquote")}
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <TextQuote className="h-5 w-5" />
      </Toggle>

      {/* Lista não ordenada */}
      <Toggle
        size="sm"
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-5 w-5" />
      </Toggle>

      {/* Lista ordenada */}
      <Toggle
        size="sm"
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-5 w-5" />
      </Toggle>

      {/* Align left*/}
      <Toggle
        size="sm"
        pressed={editor.isActive("left")}
        onPressedChange={() =>
          editor.chain().focus().setTextAlign("left").run()
        }
        className={editor.isActive({ textAlign: "left" }) ? "is-active" : ""}
      >
        <AlignLeft className="h-5 w-5" />
      </Toggle>

      {/* Align justify*/}
      <Toggle
        size="sm"
        pressed={editor.isActive("justify")}
        onPressedChange={() =>
          editor.chain().focus().setTextAlign("justify").run()
        }
        className={editor.isActive({ textAlign: "justify" }) ? "is-active" : ""}
      >
        <AlignJustify className="h-5 w-5" />
      </Toggle>

      {/* Align center*/}
      <Toggle
        size="sm"
        pressed={editor.isActive("center")}
        onPressedChange={() =>
          editor.chain().focus().setTextAlign("center").run()
        }
        className={editor.isActive({ textAlign: "center" }) ? "is-active" : ""}
      >
        <AlignCenter className="h-5 w-5" />
      </Toggle>

      {/* Align right*/}
      <Toggle
        size="sm"
        pressed={editor.isActive("right")}
        onPressedChange={() =>
          editor.chain().focus().setTextAlign("right").run()
        }
        className={editor.isActive({ textAlign: "right" }) ? "is-active" : ""}
      >
        <AlignRight className="h-5 w-5" />
      </Toggle>

      {/* Image upload button */}
      <Dialog>
        <DialogTrigger asChild onClick={toggleDialog}>
          <Toggle type="button" onClick={handleInsertImageByUrl}>
            <Image className="h-5 w-5" />
          </Toggle>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Insira a URL da imagem</DialogTitle>
            <DialogDescription>
              Copie a URL da imagem que deseja e insira no campo abaixo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right">
                URL
              </Label>
              <Input
                id="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleInsertImageByUrl}>Salvar URL</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Video upload button */}
      <Dialog>
        <DialogTrigger asChild onClick={toggleVideoDialog}>
          <Toggle type="button" onClick={handleInsertVideoByUrl}>
            <Youtube className="h-5 w-5" />
          </Toggle>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Insira a URL do vídeo</DialogTitle>
            <DialogDescription>
              Copie a URL do vídeo que deseja e insira no campo abaixo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="videoUrl" className="text-right">
                URL
              </Label>
              <Input
                id="videoUrl"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleInsertVideoByUrl}>Salvar URL</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Link */}
      <Dialog>
        <DialogTrigger asChild onClick={toggleLinkDialog}>
          <Toggle
            size="sm"
            onPressedChange={() => setIsLinkDialogOpen(true)}
            pressed={editor.isActive("link")}
          >
            <Link className="h-5 w-5" />
          </Toggle>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insira o link</DialogTitle>
            <DialogDescription>
              Copie o link que deseja que o usuário seja redirecionado e insira
              no campo abaixo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="link" className="text-right">
                URL
              </Label>
              <Input
                id="link"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleInsertLink}>Inserir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ToolbarTiptap;
