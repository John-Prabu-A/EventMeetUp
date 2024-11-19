import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View, TextInput, Button, Pressable, Alert, ScrollView } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import AddressAutocomplete from '~/components/AddressAutocomplete';
import Avatar from '~/components/Avatar';
import { useAuth } from '~/contexts/AuthProvider';
import { LocationData } from '~/types/db';
import { supabase } from '~/utils/supabase';

export default function CreateEvent() {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());
  const [imageUrl, setImageUrl] = useState<string>('');
  const [location, setLocation] = useState<LocationData | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const { user } = useAuth();

  // Function to validate UUID format
  function validateUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  const resetForm = (): void => {
    setTitle('');
    setDescription('');
    setDate(new Date());
    setImageUrl('');
    setLocation(null);
  };

  const createEvent = async (): Promise<void> => {
    if (!user || !user.id) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }

    if (!location) {
      Alert.alert('Error', 'Please select a location.');
      return;
    }

    if (!validateUUID(user.id)) {
      Alert.alert('Error', 'Invalid user ID.');
      return;
    }

    setLoading(true);

    try {
      const long = location.features[0].geometry.coordinates[0];
      const lat = location.features[0].geometry.coordinates[1];

      const { data, error } = await supabase
        .from('events')
        .insert([
          {
            title,
            description,
            date: date.toISOString(),
            user_id: user.id,
            image_uri: imageUrl,
            location: location.features[0].properties.name,
            location_point: `POINT(${long} ${lat})`,
          },
        ])
        .select()
        .single();

      if (error) {
        Alert.alert('Failed to create the event', error.message);
      } else {
        resetForm();
        setLoading(false);
        router.replace(`/event/${data.id}`);
      }
    } catch (error) {
      console.error('Error creating event:', error);
      Alert.alert('Error', 'Something went wrong while creating the event.');
    } finally {
      setLoading(false);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate: Date) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  return (
    <ScrollView className="flex-1" contentContainerClassName="gap-3 bg-white p-5">
      <View className="items-center">
        <Avatar
          size={200}
          url={imageUrl}
          onUpload={(url: string) => {
            setImageUrl(url);
          }}
        />
      </View>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
        className="rounded-md border border-gray-200 p-3"
      />
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Description"
        multiline
        numberOfLines={3}
        className="min-h-32 rounded-md border border-gray-200 p-3"
      />

      <Pressable onPress={showDatePicker}>
        <Text className="rounded-md border border-gray-200 p-3">{date.toLocaleString()}</Text>
      </Pressable>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        date={date}
        minimumDate={new Date()}
        minuteInterval={15}
      />

      <AddressAutocomplete onSelected={(location: LocationData) => setLocation(location)} />

      <Pressable
        onPress={createEvent}
        disabled={loading}
        className="mt-auto items-center rounded-md bg-red-500 p-3 px-8">
        <Text className="text-lg font-bold text-white">Create event</Text>
      </Pressable>
    </ScrollView>
  );
}
