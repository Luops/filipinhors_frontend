import api from "./api";
import axios from "axios";

export async function getAllPlaylists() {
  try {
    const response = await api.get("playlist");

    if (response.status === 200) {
      return response.data;
    }
  } catch (e: any) {
    console.log("Ocorreu um erro: ", e.response.data);
    return e.response.data;
  }
}

export async function getPlaylistById(id: string) {
  try {
    const response = await api.get(`playlist/${id}`);

    if (response.status === 200) {
      return response.data;
    }
  } catch (e: any) {
    console.log("Ocorreu um erro: ", e.response.data);
    return e.response.data;
  }
}

export async function putPlaylistById(id: string, data: any) {
  try {
    const response = await api.put(`playlist/edit/${id}`, data);

    if (response.status === 200) {
      // Retorne os produtos a partir da resposta da API
      console.log("Playlist editada com sucesso");
      return response.data;
    } else {
      // Lida com erros ou retorna um valor padrão, se você quiser
      console.error("Erro ao editar playlist:", response.statusText);
      return null;
    }
  } catch (e: any) {
    console.log("Ocorreu um erro: ", e.response.data);
    return e.response.data;
  }
}
