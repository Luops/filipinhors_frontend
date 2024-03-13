import api from "./api";
import axios from "axios";

export async function getPostsSearch(search: string) {
  try {
    const response = await api.get(
      `${api.defaults.baseURL}post/search?q=${search}`
    );

    if (response.status === 200) {
      // Retorne os produtos a partir da resposta da API
      return response.data;
    } else {
      // Lida com erros ou retorna um valor padrão, se você quiser
      console.error("Erro ao buscar postagens:", response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Erro ao buscar postagens:", error);
    return null;
  }
}
