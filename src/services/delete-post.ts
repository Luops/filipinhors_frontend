import axios from "axios";
import api from "./api";

export async function deletePost(_id: string) {
  try {
    const response = await axios.delete(`${api.defaults.baseURL}post/${_id}`);

    if (response.status === 204) {
      // Retorne os produtos a partir da resposta da API
      console.log("Publicação excluido com sucesso");
    } else {
      // Lida com erros ou retorna um valor padrão, se você quiser
      console.error("Erro ao excluir publicação:", response.statusText);
      return null;
    }
  } catch (error) {
    // Lida com erros
    console.error("Erro ao buscar postagens:", error);
  }
}
