import dayjs from 'dayjs';
import { useLocalSearchParams, Stack, Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View, Image, Pressable, ActivityIndicator } from 'react-native';

import SupaImage from '~/components/SupaImage';
import { useAuth } from '~/contexts/AuthProvider';
import { Attendance, Event } from '~/types/db';
import { supabase } from '~/utils/supabase';

export default function EventPage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [event, setEvent] = useState<Event | null>(null);
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { user } = useAuth();

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
      if (error) throw error;
      setEvent(data);

      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', user?.id || '')
        .eq('event_id', id)
        .single();
      if (attendanceError) throw attendanceError; // Throw error if fetching attendance fails
      setAttendance(attendanceData);
    } catch (error) {
      console.error('Error fetching event or attendance:', error);
      // Handle error appropriately (e.g., show an error message)
    } finally {
      setLoading(false);
    }
  };

  const joinEvent = async () => {
    if (!event) return; // Ensure event is available before proceeding

    try {
      const { data, error } = await supabase
        .from('attendance')
        .insert({ user_id: user?.id || '', event_id: event.id })
        .select()
        .single();
      if (error) throw error;
      setAttendance(data);
    } catch (error) {
      console.error('Error joining event:', error);
    }
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!event) {
    return <Text>Event not found</Text>;
  }

  return (
    <View className="flex-1 gap-3 bg-white p-3">
      <SupaImage path={event.image_uri || ''} className="aspect-video w-full rounded-xl" />

      <Text className="text-3xl font-bold" numberOfLines={2}>
        {event.title}
      </Text>
      <Text className="text-lg font-semibold uppercase text-amber-800">
        {dayjs(event.date).format('ddd, D MMM')} · {dayjs(event.date).format('h:mm A')}
      </Text>

      <Text className="text-lg font-bold">{event.location}</Text>

      <Text className="text-lg" numberOfLines={2}>
        {event.description}
      </Text>

      <Link href={`/event/${event.id}/attendance`} className="text-lg" numberOfLines={2}>
        View attendance
      </Link>

      {/* Footer */}
      <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-between border-t-2 border-gray-300 p-5 pb-10">
        <Text className="text-xl font-semibold">Free</Text>

        {attendance ? (
          <Text className="font-bold text-green-500">You are attending</Text>
        ) : (
          <Pressable onPress={joinEvent} className="rounded-md bg-red-500 p-5 px-8">
            <Text className="text-lg font-bold text-white">Join and RSVP</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
