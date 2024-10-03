import { FontAwesome } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { View, TextInput, FlatList, Text, Pressable } from 'react-native';

import { useAuth } from '~/contexts/AuthProvider';
import { Feature } from '~/types/db';
import { getSuggestions, retrieveDetails } from '~/utils/AddressAutocomplete';

type AddressAutocompleteProps = {
  onSelected: (details: any) => void;
};

export default function AddressAutocomplete({ onSelected }: AddressAutocompleteProps) {
  const [input, setInput] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Feature[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Feature | undefined>(undefined);

  const { session } = useAuth();

  const search = async () => {
    const data = await getSuggestions(input);
    setSuggestions(data.features);
  };

  const onSuggestionClick = async (suggestion: Feature) => {
    setSelectedLocation(suggestion);
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
          className="flex-1 rounded-md border border-gray-200 p-3"
        />
        <FontAwesome onPress={search} name="search" size={24} color="black" />
      </View>

      <View className="gap-2">
        {suggestions.map((item, index) => (
          <Pressable
            onPress={() => onSuggestionClick(item)}
            key={index}
            className="rounded border border-gray-300 p-2">
            <Text className="font-bold">{item.properties.address_line1}</Text>
            <Text>{item.properties.address_line2}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
