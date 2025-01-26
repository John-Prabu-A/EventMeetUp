import { useEffect } from 'react';
import { View, Animated, useColorScheme } from 'react-native';

const EventListItemLoading = () => {
  const opacity = new Animated.Value(0);
  const colorScheme = useColorScheme(); // Get the current theme (light or dark)

  // Fade-in effect
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <View
      className={`m-1.5 rounded-lg border-2 p-4 shadow-md ${colorScheme === 'dark' ? 'border-gray-700 bg-[#151515]' : 'border-gray-200 bg-white'}`}
      style={{ maxWidth: 400, height: 150, minWidth: 350 }}>
      <View className="flex-row">
        <View className="flex-1 gap-2">
          {/* Date and Time Placeholder */}
          <Animated.View
            className={`h-5 w-1/2 rounded-md ${
              colorScheme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
            }`}
            style={{ opacity }}
          />

          {/* Title Placeholder */}
          <Animated.View
            className={`h-6 w-4/5 rounded-md ${
              colorScheme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
            }`}
            style={{ opacity }}
          />

          {/* Location Placeholder */}
          <Animated.View
            className={`h-5 w-3/5 rounded-md ${
              colorScheme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
            }`}
            style={{ opacity }}
          />
        </View>

        {/* Image Placeholder */}
        <Animated.View
          className={`aspect-video w-40 rounded-xl ${
            colorScheme === 'dark' ? 'bg-gray-700' : 'bg-gray-400'
          }`}
          style={{ opacity }}
        />
      </View>

      {/* Footer Placeholders */}
      <View className="mt-auto flex-row items-center gap-3">
        {/* Attendees and Distance */}
        <Animated.View
          className={`h-4 w-3/5 rounded-md ${
            colorScheme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
          }`}
          style={{ opacity }}
        />
        {/* Share Icon Placeholder */}
        <Animated.View
          className={`h-5 w-5 rounded-full ${
            colorScheme === 'dark' ? 'bg-gray-700' : 'bg-gray-400'
          }`}
          style={{ opacity }}
        />
        {/* Bookmark Icon Placeholder */}
        <Animated.View
          className={`h-5 w-5 rounded-full ${
            colorScheme === 'dark' ? 'bg-gray-700' : 'bg-gray-400'
          }`}
          style={{ opacity }}
        />
      </View>
    </View>
  );
};

export default EventListItemLoading;
