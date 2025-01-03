import { supabase } from '~/utils/supabase';
import { NearbyEvent } from '~/types/db';

// Define an interface to enforce the shape of the fetched data.
export interface EventService {
    fetchNearbyEvents(lat: number, long: number): Promise<NearbyEvent | null>;
}

// Define the fetch function to encapsulate Supabase interaction.
export const fetchNearbyEvents: EventService['fetchNearbyEvents'] = async (lat: number, long: number) => {
    try {
        const { data, error } = await supabase.rpc('nearby_events', { lat, long });
        if (error) {
            console.error('Error fetching events:', error);
            return null;
        }
        // console.log("Data : ", JSON.stringify(data, null, 2));
        return data;
    } catch (error) {
        console.error('Error fetching events:', error);
        return null;
    }
};
