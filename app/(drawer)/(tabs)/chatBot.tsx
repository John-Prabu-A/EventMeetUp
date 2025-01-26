import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Pressable,
  Image,
  useColorScheme,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { fetchEventsByQuery } from '~/utils/fetchEventsByQuery';
import { useLocationContext } from '~/contexts/LocationProvider';
import { LocationContextType } from '~/types/db';
import { useNavigation, useRouter } from 'expo-router';
import { Asset } from 'expo-asset';
import { FontAwesome6 } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';

const imageSource = Asset.fromModule(require('../../../assets/bot-icon.png')).uri;

interface Message {
  text: string;
  sender: 'user' | 'bot';
  events?: EventData[];
}

type EventData = {
  id: number;
  created_at: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image_uri: string;
  user_id: string;
  lat: number;
  long: number;
  dist_meters: number;
};

const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const { location } = useLocationContext() as LocationContextType;
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation();
  const colorScheme = useColorScheme(); // Detect dark or light theme

  const responseFormats = [
    "Here's something you might like:",
    'Check out these events:',
    'I found these for you:',
    'These events might interest you:',
    'You may enjoy these:',
    'Consider these options:',
    'Here are some recommendations:',
    'These events caught my attention:',
    'Events worth exploring:',
    'Take a look at these suggestions:',
  ];

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = { text: inputMessage, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputMessage('');
    try {
      const events = await fetchEventsByQuery(inputMessage, location);
      // @ts-ignore
      const eventsToRender: EventData[] = events?.splice(0, 2);

      const botMessages: Message[] =
        eventsToRender && eventsToRender.length > 0
          ? eventsToRender.map((event) => {
              return {
                text: `${responseFormats[Math.floor(Math.random() * responseFormats.length)]}\n🎈${event.title} at ${event.location} (${((event.dist_meters || 0) / 1000).toFixed(2)} km away).`,
                sender: 'bot',
                events: [event],
              };
            })
          : [
              {
                text: "I couldn't find any events matching your query. Please try asking something else.",
                sender: 'bot',
              },
            ];

      setMessages((prevMessages) => [...prevMessages, ...botMessages]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        text: 'Something went wrong. Please try again.',
        sender: 'bot',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const renderMessage = ({ item }: { item: Message }) => (
    <View>
      <Pressable
        className={`my-2 max-w-[75%] rounded-xl border-2 px-4 py-3 shadow-md ${
          item.sender === 'user'
            ? 'self-end border-gray-300 bg-amber-500 text-white'
            : colorScheme === 'dark'
              ? 'self-start border-gray-700 bg-gray-800 text-white'
              : 'self-start border-gray-200 bg-gray-100 text-gray-800'
        }`}>
        <Text
          className={`text-base ${
            item.sender === 'user'
              ? 'text-white'
              : colorScheme === 'dark'
                ? 'text-white'
                : 'text-gray-800'
          }`}>
          {item.text}
        </Text>
        {item.events &&
          item.events.map((event) => (
            <Pressable key={event.id} onPress={() => router.push(`/events/event/${event.id}`)}>
              <Text
                className={`mt-2 text-sm ${
                  colorScheme === 'dark' ? 'text-amber-300' : 'text-amber-600'
                } underline`}>
                {event.title} ({(event.dist_meters / 1000).toFixed(2)} km away)
              </Text>
              <Text
                className={`text-xs ${colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {event.description}
              </Text>
            </Pressable>
          ))}
      </Pressable>
    </View>
  );

  return (
    <View className={`flex-1 ${colorScheme === 'dark' ? 'bg-[#111]' : 'bg-[#eee]'}`}>
      {/* Top Bar */}
      <View
        className={`shadow-opacity-10 shadow-offset-y-4 p-4r flex-row items-center border-b-[1px] ${
          colorScheme === 'dark' ? 'border-[#777] bg-[#111]' : 'border-[#ccc] bg-[#eee]'
        } py-2 shadow-md`}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          className=" pr-[20px]">
          <FontAwesome6
            name="bars-staggered"
            size={24}
            className="py-3 pl-3"
            color={colorScheme === 'dark' ? 'white' : 'black'}
          />
        </TouchableOpacity>
        {/* Bot Image and Name */}
        <View className="flex flex-row items-center justify-center gap-2 ">
          <Image
            source={{ uri: imageSource }}
            className="aspect-square w-14 rounded-full bg-gray-100"
          />
          <Text
            className={`mt-2 text-lg font-medium ${colorScheme === 'dark' ? 'text-white' : 'text-[#111]'}`}>
            Meetup Bot
          </Text>
        </View>
      </View>

      {messages.length === 0 ? (
        <View className="flex-1 items-center justify-center p-4">
          <Text
            className={`mb-2 text-lg font-medium ${colorScheme === 'dark' ? 'text-white' : 'text-[#111]'}`}>
            Hi! How can I help you today?
          </Text>
          <Text className={`text-sm ${colorScheme === 'dark' ? 'text-[#aaa]' : 'text-[#888]'}`}>
            Try asking something like "Best place to Learn painting" or "Events near me."
          </Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 5 }}
        />
      )}

      <View
        className={`flex-row items-center border-t border-gray-300 ${
          colorScheme === 'dark' ? 'bg-[#111]' : 'bg-[#eee]'
        } p-3`}>
        <TextInput
          className={`flex-1 rounded-full border focus:border-amber-500 border-[#666] ${
            colorScheme === 'dark' ? 'bg-[#222] text-white' : 'bg-gray-50 text-gray-700'
          } px-4 py-2 text-base`}
          placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Type your message..."
          cursorColor={'#f59e0b'}
        />
        <TouchableOpacity
          className="ml-3 items-center justify-center rounded-full bg-amber-500 p-3"
          onPress={sendMessage}>
          <Feather name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatbotPage;
