import api from "./api";
import axios from "axios";

export async function getAllLessons() {
  try {
    const response = await api.get("lesson");

    if (response.status === 200) {
      return response.data;
    }
  } catch (e: any) {
    console.log("Ocorreu um erro: ", e.response.data);
    return e.response.data;
  }
}

export async function getLessonById(id: string) {
  try {
    const response = await api.get(`lesson/${id}`);
    if (response.status === 200) {
      console.log("Resultado: ", response.data);
      return response.data;
    }
  } catch (e: any) {
    console.log("Ocorreu um erro: ", e.response.data);
    return e.response.data;
  }
}

export async function putLessonById(id: string, data: any) {
  try {
    const response = await api.put(`lesson/edit/${id}`, data);

    if (response.status === 200) {
      console.log("Aula editada com sucesso");
      return response.data;
    }
  } catch (e: any) {
    console.log("Ocorreu um erro: ", e.response.data);
    return e.response.data;
  }
}
