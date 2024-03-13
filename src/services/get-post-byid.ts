import api from "./api";
import axios from "axios";

export async function getPostsById(_id: string) {
    try {
        const response = await api.get(`${api.defaults.baseURL}post/id/${_id}`);
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
    }
    
}