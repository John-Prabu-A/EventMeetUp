import { Alert } from "react-native";
import { supabase } from "./supabase";

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
        Alert.alert('Error fetching embedding: ' + (error as Error).message);
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