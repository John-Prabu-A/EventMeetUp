import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Button, Pressable, TextInput, View, Text } from 'react-native';

import Avatar from '~/components/Avatar';
import { useAuth } from '~/contexts/AuthProvider';
import { supabase } from '~/utils/supabase';

// Define the type for the profile updates
type ProfileUpdates = {
  username: string;
  website: string;
  avatar_url: string;
  full_name: string;
};

// Define the type for the session user
type User = {
  id: string;
  email: string;
};

// Define the type for the session
type Session = {
  user: User;
};

export default function Profile() {
  const [loading, setLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string>('');
  const [website, setWebsite] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  const { session } = useAuth() as { session: Session | null };

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const { data, error, status } = await supabase
        .from('profiles')
        .select('username, website, avatar_url, full_name')
        .eq('id', session.user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username || '');
        setWebsite(data.website || '');
        setAvatarUrl(data.avatar_url || '');
        setFullName(data.full_name || '');
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(updates: ProfileUpdates) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const { error } = await supabase.from('profiles').upsert({
        id: session.user.id,
        ...updates,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 gap-3 bg-white p-5">
      <Stack.Screen options={{ title: 'Profile' }} />

      <View className="items-center">
        <Avatar
          size={200}
          url={avatarUrl}
          onUpload={(url: string) => {
            setAvatarUrl(url);
            updateProfile({ username, website, avatar_url: url, full_name: fullName });
          }}
        />
      </View>

      <TextInput
        editable={false}
        value={session?.user.email}
        placeholder="email"
        autoCapitalize="none"
        className="rounded-md border border-gray-200 p-3 text-gray-600"
      />

      <TextInput
        onChangeText={(text) => setFullName(text)}
        value={fullName}
        placeholder="full name"
        autoCapitalize="none"
        className="rounded-md border border-gray-200 p-3"
      />

      <TextInput
        onChangeText={(text) => setUsername(text)}
        value={username}
        placeholder="username"
        autoCapitalize="none"
        className="rounded-md border border-gray-200 p-3"
      />

      <TextInput
        onChangeText={(text) => setWebsite(text)}
        value={website}
        placeholder="website"
        autoCapitalize="none"
        className="rounded-md border border-gray-200 p-3"
      />

      <Pressable
        onPress={() =>
          updateProfile({ username, website, avatar_url: avatarUrl, full_name: fullName })
        }
        disabled={loading}
        className="items-center rounded-md border-2 border-red-500 p-3 px-8">
        <Text className="text-lg font-bold text-red-500">Save</Text>
      </Pressable>

      <Button title="Sign out" onPress={() => supabase.auth.signOut()} />
    </View>
  );
}
