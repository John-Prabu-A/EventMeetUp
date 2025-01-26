import Feather from '@expo/vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import { Href, Link } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Share,
  useColorScheme,
  Linking,
} from 'react-native';

import SupaImage from './SupaImage';
import { EventExtended } from '~/types/db';
import { supabase } from '~/utils/supabase';
import { FontAwesome } from '@expo/vector-icons';

export default function EventListItem({
  event,
  inBookmarks,
}: {
  event: EventExtended;
  inBookmarks?: boolean;
}) {
  const [numberOfAttendees, setNumberOfAttendees] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const colorScheme = useColorScheme(); // Get the current theme (light or dark)

  useEffect(() => {
    checkBookmark();
  }, [event.id]);

  useEffect(() => {
    fetchNumberOfAttendees();
  }, [event.id]);

  const fetchNumberOfAttendees = async () => {
    const { count } = await supabase
      .from('attendance')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', event.id);

    setNumberOfAttendees(count || 0);
  };

  const shareEvent = async () => {
    if (!event) return;

    // Format the event date and time
    const startDate = dayjs(event.date).format('YYYYMMDDTHHmmssZ');
    const endDate = dayjs(event.date).add(1, 'hour').format('YYYYMMDDTHHmmssZ');

    // Generate Google Calendar link dynamically
    const calendarLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.title
    )}&dates=${startDate}/${endDate}&details=${encodeURIComponent(
      event.description || 'Join us for this event!'
    )}&location=${encodeURIComponent(event.location || '')}&sf=true&output=xml`;

    // Prepare the message for sharing
    const shareOptions = {
      title: 'Check out this event!',
      message: `🎉 ${event.title}\n📅 ${dayjs(event.date).format('ddd, D MMM h:mm A')}\n📍 ${event.location}\nAdd to Calendar: ${calendarLink}`,
    };

    try {
      await Share.share(shareOptions);
    } catch (error) {
      console.error('Error sharing event:', error);
    }
  };

  const checkBookmark = async () => {
    const savedEvents = JSON.parse((await AsyncStorage.getItem('bookmarkedEvents')) ?? '[]') || [];
    setIsBookmarked(savedEvents.some((savedEvent: { id: number }) => savedEvent.id === event.id));
  };

  const toggleBookmark = async () => {
    setIsBookmarked(!isBookmarked);
    const savedEvents = JSON.parse((await AsyncStorage.getItem('bookmarkedEvents')) ?? '[]') || [];
    let updatedEvents;

    if (isBookmarked) {
      updatedEvents = savedEvents.filter(
        (savedEvent: { id: number }) => savedEvent.id !== event.id
      );
    } else {
      updatedEvents = [...savedEvents, event];
    }

    await AsyncStorage.setItem('bookmarkedEvents', JSON.stringify(updatedEvents));
    checkBookmark();
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#eee] dark:bg-[#111]">
        <ActivityIndicator size="large" color={colorScheme === 'dark' ? 'white' : '#f59e0b'} />
      </View>
    );
  }

  if (!event) {
    return (
      <View className="flex-1 items-center justify-center bg-[#eee] dark:bg-[#111]">
        <Text className="text-gray-500">Event not found</Text>
      </View>
    );
  }

  return (
    <Link href={`/events/event/${event.id}`} asChild>
      <Pressable
        className={`m-1.5 rounded-lg border-2 p-4 shadow-md ${colorScheme === 'dark' ? 'border-[rgba(100,100,100,0.5)] bg-[#000000]' : 'border-gray-200 bg-white'}`}
        style={{ maxWidth: 400, height: 150, minWidth: 350 }}>
        <View className="flex-row">
          <View className="flex-1 gap-2">
            <Text
              className={`text-lg font-semibold uppercase ${colorScheme === 'dark' ? 'text-amber-500' : 'text-amber-800'}`}>
              {dayjs(event.date).format('ddd, D MMM')} · {dayjs(event.date).format('h:mm A')}
            </Text>
            <Text
              className={`text-xl font-bold ${colorScheme === 'dark' ? 'text-white' : 'text-gray-900'}`}
              numberOfLines={2}>
              {event.title}
            </Text>

            <Text
              className={`${colorScheme === 'dark' ? 'text-[#ffc18b]' : 'text-gray-600'}`}
              numberOfLines={1}>
              {event.location}
            </Text>
          </View>

          {/* Event image */}
          {event.image_uri && (
            <SupaImage path={event.image_uri} className="aspect-video w-40 rounded-xl" />
          )}
        </View>

        {/* Footer */}
        <View className="mt-auto flex-row items-center gap-3">
          <Text className={`mr-auto ${colorScheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            {numberOfAttendees} going · {Math.round(event.dist_meters / 1000)} km from you
          </Text>
          <Feather
            name="share"
            size={20}
            color={colorScheme === 'dark' ? '#00ff00' : 'green'}
            onPress={shareEvent}
            className="mx-2 p-2"
          />
          {!inBookmarks && (
            <FontAwesome
              name={isBookmarked ? 'bookmark' : 'bookmark-o'}
              size={20}
              color={isBookmarked ? 'rgb(180 83 9)' : 'grey'}
              onPress={toggleBookmark}
              className="pl-2"
            />
          )}
        </View>
      </Pressable>
    </Link>
  );
}
