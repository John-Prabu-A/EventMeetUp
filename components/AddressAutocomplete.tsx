import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import { View, TextInput, Text, Pressable, useColorScheme, ActivityIndicator } from 'react-native';

import { Feature } from '~/types/db';
import { getSuggestions, retrieveDetails } from '~/utils/AddressAutocomplete';

type AddressAutocompleteProps = {
  onSelected: (details: any) => void;
};

export default function AddressAutocomplete({ onSelected }: AddressAutocompleteProps) {
  const [input, setInput] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();

  const search = async () => {
    if (input.trim()) {
      setLoading(true);
      const data = await getSuggestions(input);
      setSuggestions(data.features);
      setLoading(false);
    }
  };

  const onSuggestionClick = async (suggestion: Feature) => {
    setInput(suggestion.properties.formatted);
    setSuggestions([]);

    const [longitude, latitude] = suggestion.geometry.coordinates;
    const details = await retrieveDetails(longitude, latitude);
    onSelected(details);
  };

  return (
    <View>
      <View className="flex flex-row items-center gap-3">
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Location"
          placeholderTextColor={
            colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'
          }
          cursorColor="#f59e0b"
          className={`flex-1 rounded-md border p-3 focus:border-amber-500 ${colorScheme === 'dark' ? 'border-gray-700 bg-[#1f1f1f] text-white' : 'border-gray-200'}`}
        />
        <FontAwesome
          onPress={search}
          name="search"
          size={24}
          color={colorScheme === 'dark' ? '#b45309' : '#d97706'}
        />
      </View>
      {loading && (
        <View
          className={`rounded-md mt-2 border p-3 ${colorScheme === 'dark' ? 'bg-[#111]' : 'bg-[#eee]'} border-amber-500`}>
          <ActivityIndicator className="text-lg font-semibold text-amber-500"/>
        </View>
      )}

      <View className="mt-2 gap-2">
        {suggestions.map((item, index) => (
          <Pressable
            onPress={() => onSuggestionClick(item)}
            key={index}
            className={`rounded-md border p-3 ${colorScheme === 'dark' ? 'bg-[#3e3535]' : 'bg-[#fffbeb55]'} border-amber-500`}>
            <Text className="text-lg font-semibold dark:text-gray-300">
              {item.properties.address_line1}
            </Text>
            <Text className="text-sm text-amber-500">{item.properties.address_line2}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
