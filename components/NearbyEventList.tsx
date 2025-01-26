import React from 'react';
import { FlatList, Text, View, RefreshControl } from 'react-native';

import EventListItem from '~/components/EventListItem';
import { EventExtended } from '~/types/db';

const NearbyEventList = ({
  title,
  data,
  refreshing,
  onRefresh,
}: {
  title: string;
  data: EventExtended[];
  refreshing: boolean;
  onRefresh: () => void;
}) => (
  <View style={{ flex: 1, paddingVertical: 10 }}>
    <Text style={{ fontSize: 24, fontWeight: 'bold', marginLeft: 15, marginVertical: 10 }}>
      {title}
    </Text>
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <EventListItem event={{ ...item, location_point: null, embedding: null }} />
      )}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      contentContainerStyle={{ paddingHorizontal: 15 }}
    />
  </View>
);

export default NearbyEventList;
