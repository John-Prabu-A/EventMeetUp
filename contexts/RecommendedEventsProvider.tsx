import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from '~/contexts/AuthProvider';
import { useLocationContext } from '~/contexts/LocationProvider';
import { LocationContextType, RecommendedEvent } from '~/types/db';
import { supabase } from '~/utils/supabase';

interface RecommendedEventsContextType {
  recommendedEvents: RecommendedEvent;
  loading: boolean;
  error: string | null;
  fetchRecommendedEvents: () => Promise<void>;
}

const RecommendedEventsContext = createContext<RecommendedEventsContextType | undefined>(undefined);

export const RecommendedEventsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [recommendedEvents, setRecommendedEvents] = useState<RecommendedEvent>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { location } = useLocationContext() as LocationContextType;
  const { user } = useAuth();

  const fetchRecommendedEvents = useCallback(async () => {
    if (!location || !user) return;
    if (recommendedEvents.length !== 0) return;
    setLoading(true);
    setError(null);

    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, embedding');
    // console.log(JSON.stringify(events, null, 2));
    if (eventsError) setError(eventsError.message);

    // console.log("user id : ", user.id);

    const { data: embeddingData, error: userEmbeddingError } = await supabase
      .from('profiles')
      .select('user_embedding')
      .eq('id', user.id)
      .single();
    // console.log(embeddingData?.user_embedding);
    if (userEmbeddingError) setError(userEmbeddingError.message);

    if (!embeddingData) return;
    // console.log("User Embedding : " ,embeddingData.user_embedding);
    const body = {
      userEmbedding: embeddingData.user_embedding,
      events: events,
    };
    // console.log(body);

    const response = await fetch(`${process.env.EXPO_PUBLIC_EMBEDDINGS_SERVER_URL}/similarity`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const eventIds = await response.json();

    // console.log(eventIds);

    const { data, error } = await supabase.rpc('get_ordered_data', {
      ids: eventIds,
      long: location.coords.longitude || 76.267303,
      lat: location.coords.latitude || 10.762622,
      limit_count: 5,
    });

    // const { data, error } = await supabase.rpc('recommended_events', {
    //     user_id: user.id,
    //     lat: location.coords.latitude || 10.762622,
    //     long: location.coords.longitude || 76.267303,
    //     limit_count: 5
    // });

    if (error) {
      // console.error('Error fetching recommended events:', error);
      setError(error.message);
    } else {
      setRecommendedEvents(data);
    }
    setLoading(false);
  }, [location, user]);

  useEffect(() => {
    if (user) fetchRecommendedEvents();
  }, [location, fetchRecommendedEvents]);

  return (
    <RecommendedEventsContext.Provider
      value={{ recommendedEvents, loading, error, fetchRecommendedEvents }}>
      {children}
    </RecommendedEventsContext.Provider>
  );
};

export const useRecommendedEvents = () => {
  const context = useContext(RecommendedEventsContext);
  if (context === undefined) {
    throw new Error('useRecommendedEvents must be used within a RecommendedEventsProvider');
  }
  return context;
};
