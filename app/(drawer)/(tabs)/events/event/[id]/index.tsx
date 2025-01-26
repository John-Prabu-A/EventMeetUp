import dayjs from 'dayjs';
import { useLocalSearchParams, Link, Href, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View, Pressable, ActivityIndicator } from 'react-native';

import SupaImage from '~/components/SupaImage';
import { useAuth } from '~/contexts/AuthProvider';
import { Attendance, Event } from '~/types/db';
import { supabase } from '~/utils/supabase';

import QRCode from 'react-native-qrcode-svg';
import { ScrollView } from 'react-native-gesture-handler';

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
      // Fetch event data, expect at most one row
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', Number(id))
        .maybeSingle();

      if (eventError) throw eventError;
      if (!eventData) {
        console.warn('No event found with the given ID');
        setEvent(null); // Handle no event case
      } else {
        setEvent(eventData);
      }

      // Fetch attendance data, expect at most one row
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', user?.id || '')
        .eq('event_id', Number(id))
        .maybeSingle(); // Use maybeSingle() instead of single()

      if (attendanceError) throw attendanceError;
      setAttendance(attendanceData || null); // Handle no attendance case
    } catch (error) {
      console.error('Error fetching event or attendance:', error);
      // Display an appropriate error message to the user
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
    return (
      <View className="flex-1 items-center justify-center bg-[#eee] dark:bg-[#111]">
        <ActivityIndicator size="large" color="#B45309" />
        <Text className="mt-2 text-lg text-gray-700 dark:text-gray-300">Loading event...</Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View className="flex-1 items-center justify-center bg-[#eee] dark:bg-[#111]">
        <Text className="text-lg text-gray-700 dark:text-gray-300">Event not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#eee] dark:bg-[#111]">
      <ScrollView className="flex-grow p-4">
        {/* Event Image */}
        <SupaImage path={event.image_uri || ''} className="aspect-video w-full rounded-xl" />

        {/* Event Title */}
        <Text className="mt-4 text-3xl font-bold text-[#111] dark:text-[#eee]" numberOfLines={2}>
          {event.title}
        </Text>

        {/* Event Date & Time */}
        <Text className="mt-2 text-lg font-semibold uppercase text-amber-800 dark:text-amber-400">
          {dayjs(event.date).format('ddd, D MMM')} · {dayjs(event.date).format('h:mm A')}
        </Text>

        {/* Event Location */}
        <Text className="mt-1 text-lg font-bold text-[#111] dark:text-[#eee]">
          {event.location}
        </Text>

        {/* Event Description */}
        <Text className="mt-1 text-lg text-gray-700 dark:text-gray-300" numberOfLines={2}>
          {event.description}
        </Text>

        {/* Link to Attendance Page */}
        <Link
          href={`/events/event/${event.id}/attendance`}
          className="mt-3 text-lg text-blue-600 dark:text-blue-400">
          View attendance
        </Link>

        {/* QR Code for Event Sharing */}
        <View className="mt-4 items-center">
          <View className="border-4 border-white">
            <QRCode value={`https://meetup.com/event/${event.id}`} size={150} />
          </View>
          <Text className="mt-2 text-lg text-gray-700 dark:text-gray-300">Scan to Share Event</Text>
        </View>
        <View className="mt-4 h-24 w-full"></View>

        {/* Footer */}
      </ScrollView>
      <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-between border-t-2 border-gray-300 bg-[#eee] p-5 dark:border-gray-700 dark:bg-[#111]">
        <Text className="text-xl font-semibold text-[#111] dark:text-[#eee]">Free</Text>

        {attendance ? (
          <Text className="font-bold text-green-500">You are attending</Text>
        ) : (
          <Pressable onPress={joinEvent} className="rounded-md bg-red-500 p-3">
            <Text className="text-lg font-bold text-[#eee]">Join and RSVP</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
