import api from "./api";
import axios from "axios";

export async function postImage(file: File) {
  try {
    // Crie um objeto FormData para enviar o arquivo
    const formData = new FormData();
    formData.append("file", file);

    // Faça uma solicitação POST para a rota de upload de imagem do seu servidor
    const response = await fetch(`${api.defaults.baseURL}image`, {
      method: "POST",
      body: formData,
    });

    if (response.status === 201) {
      // A resposta deve conter a URL da nova imagem
      const data = await response.json();
      if (data.url) {
        // Certifique-se de que a URL da imagem foi retornada
        return data.url;
      } else {
        throw new Error("A resposta não contém a URL da imagem");
      }
    } else {
      // Lida com erros de upload
      throw new Error("Erro ao fazer upload da imagem");
    }
  } catch (error) {
    // Lida com erros de exceção
    throw error;
  }
}
