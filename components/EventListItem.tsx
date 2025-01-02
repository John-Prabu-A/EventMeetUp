import Feather from '@expo/vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, Share } from 'react-native';

import SupaImage from './SupaImage';

import { EventExtended, NearbyEvent, RecommendedEvent } from '~/types/db';
import { supabase } from '~/utils/supabase';

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

    const shareOptions = {
      title: 'Check out this event!',
      message: `🎉 ${event.title}\n📅 ${dayjs(event.date).format('ddd, D MMM h:mm A')}\n📍 ${
        event.location
      }\n\nJoin me here: https://example.com/event/${event.id}`, // Replace with your app's event link
    };

    try {
      await Share.share(shareOptions);
    } catch (error) {
      console.error('Error sharing event:', error);
    }
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!event) {
    return <Text>Event not found</Text>;
  }

  const checkBookmark = async () => {
    const savedEvents = JSON.parse((await AsyncStorage.getItem('bookmarkedEvents')) ?? '[]') || [];
    setIsBookmarked(savedEvents.some((savedEvent: { id: number }) => savedEvent.id === event.id));
    console.log(savedEvents);
  };

  const toggleBookmark = async () => {
    setIsBookmarked(!isBookmarked);
    const savedEvents = JSON.parse((await AsyncStorage.getItem('bookmarkedEvents')) ?? '[]') || [];
    let updatedEvents;

    if (isBookmarked) {
      // Remove from bookmarks
      updatedEvents = savedEvents.filter(
        (savedEvent: { id: number }) => savedEvent.id !== event.id
      );
      console.log('ue: ', updatedEvents);
    } else {
      // Add to bookmarks
      updatedEvents = [...savedEvents, event];
    }

    // Save the updated list to AsyncStorage
    await AsyncStorage.setItem('bookmarkedEvents', JSON.stringify(updatedEvents));
    checkBookmark();
  };

  return (
    <Link href={`/event/${event.id}`} asChild>
      <Pressable
        className="rounded-lg border-2 border-gray-200 bg-white p-3 shadow-md"
        style={{ maxWidth: 400, height: 150, minWidth: 320 }}>
        <View className="flex-row">
          <View className="flex-1 gap-2">
            <Text className="text-lg font-semibold uppercase text-amber-800">
              {dayjs(event.date).format('ddd, D MMM')} · {dayjs(event.date).format('h:mm A')}
            </Text>
            <Text className="text-xl font-bold" numberOfLines={2}>
              {event.title}
            </Text>

            {/* Ensure the location is wrapped in a Text component */}
            <Text className="text-gray-700" numberOfLines={1}>
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
          <Text className="mr-auto text-gray-700">
            {numberOfAttendees} going · {Math.round(event.dist_meters / 1000)} km from you
          </Text>
          <Feather name="share" size={20} color="green" onPress={shareEvent} />
          {!inBookmarks && (
            <Feather
              name="bookmark"
              size={20}
              color={isBookmarked ? 'blue' : 'gray'}
              onPress={toggleBookmark}
            />
          )}
        </View>
      </Pressable>
    </Link>
  );
}
