import api from "./api";
import axios from "axios";

export async function getSuggestedPost(_id: string) {
  try {
    const response = await api.get(
      `${api.defaults.baseURL}post/category/suggested/${_id}`
    );

    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Erro ao buscar postagens:", response.statusText);
      return null;
    }
  } catch (error) {}
}
