import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';

import { supabase } from '~/utils/supabase';
import { Attendance, Profile } from '~/types/db';

export default function EventAttendance() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [attendees, setAttendees] = useState<(Attendance & { profiles: Profile | null })[]>([]);

  useEffect(() => {
    fetchAttendees();
  }, [id]);

  const fetchAttendees = async () => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*, profiles(*)')
        .eq('event_id', id);

      if (error) throw error;
      setAttendees(data);
    } catch (error) {
      console.log('Error fetching attendees:', error);
    }
  };

  return (
    <View className="flex-1">
      <FlatList
        data={attendees}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="p-3">
            <Text className="font-bold">{item.profiles?.full_name || 'User'}</Text>
          </View>
        )}
      />
    </View>
  );
}
