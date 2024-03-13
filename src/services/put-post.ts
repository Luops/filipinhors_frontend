import api from "./api";
import axios from "axios";

export async function putPost(
  id: string,
  title: string,
  content: string,
  tags: string,
  category: string,
  url: string,
  file: File | null,
  urlPost: string
) {
  try {
    const response = await axios.put(`${api.defaults.baseURL}post/${id}`, {
      title,
      content,
      tags,
      category,
      url,
      file,
      urlPost,
    });
    if (response.status === 200) {
      // Retorne os produtos a partir da resposta da API
      console.log("Publicação editada com sucesso");
    } else {
      // Lida com erros ou retorna um valor padrão, se você quiser
      console.error("Erro ao editar publicação:", response.statusText);
      return null;
    }
  } catch (error) {
    // Lida com erros
    console.error("Erro ao buscar postagens:", error);
  }
}
