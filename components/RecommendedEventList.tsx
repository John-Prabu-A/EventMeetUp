import React from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import EventListItem from '~/components/EventListItem';
import { EventExtended } from '~/types/db';

const RecommendedEventList = ({ title, data, refreshing, onRefresh }: { title: string, data: EventExtended[], refreshing: boolean, onRefresh: () => void }) => (
  <View style={{ paddingVertical: 10 }}>
    <Text style={{ fontSize: 24, fontWeight: 'bold', marginLeft: 15, marginVertical: 10 }}>{title}</Text>
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <EventListItem event={{ ...item, location_point: null, embedding: null }} />
      )}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      showsHorizontalScrollIndicator={true}
      contentContainerStyle={{ paddingHorizontal: 15, gap: 10 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    />
  </View>
);

export default RecommendedEventList;
