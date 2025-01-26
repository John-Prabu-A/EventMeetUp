import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View, useColorScheme } from 'react-native';

import { supabase } from '~/utils/supabase';
import { Attendance, Profile } from '~/types/db';

export default function EventAttendance() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme(); // Get the current theme (light or dark)

  const [attendees, setAttendees] = useState<(Attendance & { profiles: Profile | null })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAttendees();
  }, [id]);

  const fetchAttendees = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*, profiles(*)')
        .eq('event_id', Number(id));

      if (error) throw error;
      setAttendees(data || []);
    } catch (err) {
      setError('Failed to load attendees. Please try again later.');
      console.error('Error fetching attendees:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View
        className={`flex-1 items-center justify-center px-4 ${colorScheme === 'dark' ? 'bg-[#111]' : 'bg-[#eee]'}`}>
        <ActivityIndicator size="large" color="rgb(180, 83, 9)" />
        <Text
          className={`mt-4 text-lg ${colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Loading attendees...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        className={`flex-1 items-center justify-center px-4 ${colorScheme === 'dark' ? 'bg-[#111]' : 'bg-[#eee]'}`}>
        <Text
          className={`text-center text-lg ${colorScheme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
          {error}
        </Text>
      </View>
    );
  }

  if (attendees.length === 0) {
    return (
      <View
        className={`flex-1 items-center justify-center px-4 ${colorScheme === 'dark' ? 'bg-[#111]' : 'bg-[#eee]'}`}>
        <Text
          className={`text-center text-lg ${colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          No attendees found for this event.
        </Text>
      </View>
    );
  }

  return (
    <View className={`flex-1 ${colorScheme === 'dark' ? 'bg-[#111]' : 'bg-[#eee]'} px-4 pt-4`}>
      <FlatList
        data={attendees}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            className={`mb-3 rounded-lg border border-[rgb(180,83,9)]
            ${colorScheme === 'dark' ? 'bg-[rgba(180,83,9,0.25)]' : 'bg-[rgba(180,83,9,0.1)]'} p-4`}>
            <Text
              className={`text-lg font-bold ${colorScheme === 'dark' ? 'text-[rgb(255,170,105)]' : 'text-[rgb(180,83,9)]'}`}>
              {item.profiles?.full_name || 'Anonymous User'}
            </Text>
            {item.profiles?.username && (
              <Text
                className={`mt-2 text-sm ${colorScheme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                {item.profiles.username}
              </Text>
            )}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
