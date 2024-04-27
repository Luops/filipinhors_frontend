import api from "./api";
import axios from "axios";

export async function getAllCourses() {
  try {
    const response = await api.get("course");

    if (response.status === 200) {
      return response.data;
    }
  } catch (e: any) {
    console.log("Ocorreu um erro: ", e.response.data);
    return e.response.data;
  }
}

export async function getCourseById(id: string) {
  try {
    const response = await api.get(`course/${id}`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (e: any) {
    console.log("Ocorreu um erro: ", e.response.data);
    return e.response.data;
  }
}

export async function putCourseById(id: string, data: any) {
  try {
    const response = await api.put(`course/edit/${id}`, data);
    if (response.status === 200) {
      console.log("Curso editado com sucesso");
      response.data;
    } else {
      console.log("Erro ao editar o curso");
    }
  } catch (e: any) {
    console.log("Ocorreu um erro: ", e.response.data);
    return e.response.data;
  }
}
