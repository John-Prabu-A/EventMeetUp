import { supabase } from "./supabase";
import Toast from "react-native-toast-message";

export default async function getEmbedding(text: string): Promise<number[]> {
    // Get embedding from embeddings server
    const embeddingUrl = `${process.env.EXPO_PUBLIC_EMBEDDINGS_SERVER_URL}/embed`;
    // console.log("Embedding URL : ", embeddingUrl);

    try {
        const fetchedData = await fetch(embeddingUrl, {
            method: 'POST',
            body: JSON.stringify({ text }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const { embeddings } = await fetchedData.json();
        return embeddings;
    } catch (error) {
        Toast.show({
            type: 'error',
            text1: 'Error',
            text2: (error as Error).message,
            visibilityTime: 2000,
            autoHide: true,
        });
    }
    return [];
}


export const updateEventEmbeddingsInDB = async () => {
    const { data, error } = await supabase.from("events").select("*");
    // console.log("Data : ", data);

    if (!data) return;

    for (const event of data) {
        const embedding = await getEmbedding(JSON.stringify(event));
        await supabase.from("events").update({
            embedding: JSON.stringify(embedding)
        }).eq("id", event.id);
    };
}