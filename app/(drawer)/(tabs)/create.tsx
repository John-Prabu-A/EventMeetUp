import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View, TextInput, Pressable, ScrollView, useColorScheme } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Toast from 'react-native-toast-message';

import AddressAutocomplete from '~/components/AddressAutocomplete';
import Avatar from '~/components/Avatar';
import { useAuth } from '~/contexts/AuthProvider';
import { LocationData } from '~/types/db';
import getEmbedding from '~/utils/generateEmbedding';
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
  const colorScheme = useColorScheme();

  const validateForm = (): boolean => {
    const showToast = (message: string) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: message,
        visibilityTime: 2000,
        autoHide: true,
      });
    };

    if (!title.trim()) {
      showToast('Title cannot be empty.');
      return false;
    }
    if (title.length > 100) {
      showToast('Title cannot exceed 100 characters.');
      return false;
    }
    if (!description.trim()) {
      showToast('Description cannot be empty.');
      return false;
    }
    if (description.length > 500) {
      showToast('Description cannot exceed 500 characters.');
      return false;
    }
    if (!date) {
      showToast('Please select a date.');
      return false;
    }
    if (!location) {
      showToast('Please select a location.');
      return false;
    }
    if (!imageUrl) {
      showToast('Please upload an image.');
      return false;
    }
    return true;
  };

  const resetForm = (): void => {
    setTitle('');
    setDescription('');
    setDate(new Date());
    setImageUrl('');
    setLocation(null);
  };

  const createEvent = async (): Promise<void> => {
    if (!validateForm()) return;
    if (!user || !user.id) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'User not authenticated',
        visibilityTime: 2000,
        autoHide: true,
      });
      return;
    }
    setLoading(true);

    try {
      const long = location!.features[0].geometry.coordinates[0];
      const lat = location!.features[0].geometry.coordinates[1];

      const eventData = {
        title,
        description,
        date: date!.toISOString(),
        user_id: user.id,
        image_uri: imageUrl,
        location: location!.features[0].properties.name,
        location_point: `POINT(${long} ${lat})`,
      };

      const embeddingArray = await getEmbedding(JSON.stringify(eventData, null, 2));
      const embedding = JSON.stringify(embeddingArray);

      if (!embedding) {
        throw new Error('Failed to generate embedding for the event.');
      }

      const { data, error } = await supabase
        .from('events')
        .insert([{ ...eventData, embedding }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (data && data.id) {
        resetForm();
        router.push(`/events/event/${data.id}`);
      } else {
        throw new Error('Failed to create event.');
      }
    } catch (error: any) {
      // console.error('Error creating event:', error);
      {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.message || 'Something went wrong while creating the event.',
          visibilityTime: 2000,
          autoHide: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirm = (selectedDate: Date) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  return (
    <ScrollView
      className={`flex-1 ${colorScheme === 'dark' ? 'bg-[#121212]' : 'bg-white'} p-3`}
      contentContainerClassName="gap-3">
      <View className="mb-5 items-center">
        <Avatar
          size={150}
          url={imageUrl}
          type="event"
          onUpload={(url: string) => setImageUrl(url)}
        />
        {imageUrl === '' && (
          <Text
            className={`mt-2 text-sm ${colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Please upload an event image.
          </Text>
        )}
      </View>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
        placeholderTextColor={colorScheme === 'dark' ? '#B0B0B0' : '#6B6B6B'}
        cursorColor="#f59e0b"
        className={`rounded-md border ${colorScheme === 'dark' ? 'border-gray-700 bg-[#1f1f1f] text-white' : ' border-gray-200'} p-3`}
      />

      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Description"
        placeholderTextColor={colorScheme === 'dark' ? '#B0B0B0' : '#6B6B6B'}
        cursorColor="#f59e0b"
        multiline
        numberOfLines={3}
        className={`min-h-32 rounded-md border ${colorScheme === 'dark' ? 'border-gray-700 bg-[#1f1f1f] text-white' : 'border-gray-200'} p-3`}
      />

      <Pressable
        onPress={showDatePicker}
        className={`rounded-md border ${colorScheme === 'dark' ? 'border-gray-700 bg-[#1f1f1f]' : 'border-gray-200'} p-3`}>
        <Text className={`text-sm ${colorScheme === 'dark' ? 'text-gray-300' : 'text-black'}`}>
          {date.toLocaleString()}
        </Text>
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
        className={`mb-8 mt-8 items-center rounded-md p-3 px-8 ${loading ? 'bg-gray-600' : 'bg-amber-500'}`}>
        <Text className="text-lg font-bold text-white">Create event</Text>
      </Pressable>
    </ScrollView>
  );
}
