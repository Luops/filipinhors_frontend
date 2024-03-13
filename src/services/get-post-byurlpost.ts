import api from "./api";
import axios from "axios";

export async function getPostByUrlPost(urlPost: string) {
  try {
    const response = await axios.get(
      `${api.defaults.baseURL}post/${urlPost}`
    );

    if (response.status === 200) {
      return response.data;
      console.log(response.data);
    } else {
      console.error("Erro ao buscar a postagem: ", response.statusText);
    }
  } catch (error) {
    console.error("Erro ao buscar a postagem: ", error);
    return null;
  }
}
