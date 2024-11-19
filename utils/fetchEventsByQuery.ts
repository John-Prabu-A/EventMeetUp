import { supabase } from '~/utils/supabase';
import getEmbedding from './generateEmbedding';
import { LocationContextType } from '~/types/db';

export const fetchEventsByQuery = async (query: string, location: LocationContextType['location']) => {
    try {
        if(!location) return;
        // Step 1: Convert query string to an embedding
        console.log('Query:', query);
        const queryEmbedding: number[] = await getEmbedding(query);
        // console.log('Embedding response:', queryEmbedding);

        if (!queryEmbedding) {
            throw new Error('Failed to convert query to embedding');
        }
        // const queryEmbedding = await embeddingResponse as number[];
        // console.log('Query embedding:', queryEmbedding);

        // Step 2: Fetch all event embeddings from Supabase
        const { data: events, error: eventsError } = await supabase.from("events").select("id, embedding");

        if (eventsError) {
            throw new Error(eventsError.message);
        }

        // console.log('Events lenght:', events.length);
        const userEmbedding = JSON.stringify(queryEmbedding);

        // Step 3: Send user embedding and event embeddings to similarity endpoint
        const response = await fetch(`${process.env.EXPO_PUBLIC_EMBEDDINGS_SERVER_URL}/similarity`, {
            method: "POST",
            body: JSON.stringify({userEmbedding, events}),
            headers: {
                "Content-Type": "application/json"
            }
        });

        const eventIds = await response.json();
        // console.log('Event IDs:', eventIds);

        // Step 4: Fetch and order events using Supabase stored procedure
        const { data, error } = await supabase.rpc('get_ordered_data', {
            ids: eventIds,
            long: location.coords.longitude || 76.267303,
            lat: location.coords.latitude || 10.762622,
            limit_count: 10
        });

        if (error) {
            throw new Error(error.message);
        }

        return data;
    } catch (error) {
        console.error('Error fetching events by query:', error);
        throw error;
    }
};
