import api from "./api";
import axios from "axios";

export async function getAllModules() {
  try {
    const response = await api.get("module");

    if (response.status === 200) {
      return response.data;
    }
  } catch (e: any) {
    console.log("Ocorreu um erro: ", e.response.data);
    return e.response.data;
  }
}

export async function getModuleById(id: string) {
  try {
    const response = await api.get(`module/${id}`);

    if (response.status === 200) {
      return response.data;
    }
  } catch (e: any) {
    console.log("Ocorreu um erro: ", e.response.data);
    return e.response.data;
  }
}

export async function putModuleById(id: string, data: any) {
  try {
    const response = await api.put(`module/edit/${id}`, data);

    if (response.status === 200) {
      console.log("Módulo editado com sucesso");
      return response.data;
    } else {
      // Lida com erros ou retorna um valor padrão, se você quiser
      console.error("Erro ao editar módulo:", response.statusText);
      return null;
    }
  } catch (e: any) {
    console.log("Ocorreu um erro: ", e.response.data);
    return e.response.data;
  }
}
