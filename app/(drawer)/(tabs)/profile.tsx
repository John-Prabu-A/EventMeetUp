import { router, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
  Pressable,
  useColorScheme,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Avatar from '~/components/Avatar';
import { useAuth } from '~/contexts/AuthProvider';
import { supabase } from '~/utils/supabase';
import Toast from 'react-native-toast-message';

const ProfileSchema = Yup.object().shape({
  fullName: Yup.string().required('Full Name is required'),
  username: Yup.string().required('Username is required'),
  website: Yup.string().url('Enter a valid URL').nullable(),
});

export default function Profile() {
  const [loading, setLoading] = useState<boolean>(true);
  const {
    session,
    ProfileData,
    profileUrl: avatarUrl,
    setGlobalProfileData: setProfileData,
    setGlobalProfileURL: setAvatarUrl,
  } = useAuth();

  const colorScheme = useColorScheme();

  const isDarkMode = colorScheme === 'dark';

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
        setProfileData({
          fullName: data.full_name || '',
          username: data.username || '',
          website: data.website || '',
        });
        setAvatarUrl(data.avatar_url || '');
      }
    } catch (error) {
      if (error instanceof Error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.message,
          visibilityTime: 2000,
          autoHide: true,
        });
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(values: { fullName: string; username: string; website: string }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const { error } = await supabase.from('profiles').upsert({
        id: session.user.id,
        full_name: values.fullName,
        username: values.username,
        website: values.website,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        throw error;
      }

      Toast.show({
        type: 'success',
        text1: 'Profile Updated',
        text2: 'Your profile has been updated successfully.',
        visibilityTime: 2000,
        autoHide: true,
        onShow: () => router.back(),
      });
    } catch (error) {
      if (error instanceof Error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.message,
          visibilityTime: 2000,
          autoHide: true,
        });
      }
    } finally {
      setLoading(false);
    }
  }

  const styles = {
    label: {
      color: isDarkMode ? '#eee' : '#111',
    },
    button: {
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#BB86FC' : 'rgb(180,83,9)',
      padding: 15,
      borderRadius: 8,
    },
    buttonText: {
      color: isDarkMode ? '#FFFFFF' : '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
  };

  return (
    <KeyboardAvoidingView
      className="flex flex-1 bg-white dark:bg-[#1A1A1A]"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
        keyboardShouldPersistTaps="handled">
        <Stack.Screen options={{ title: 'Profile' }} />

        <Formik
          initialValues={ProfileData}
          enableReinitialize
          validationSchema={ProfileSchema}
          onSubmit={updateProfile}>
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={{ flex: 1 }}>
              <Avatar
                size={150}
                url={avatarUrl}
                onUpload={(url: string) => {
                  setAvatarUrl(url);
                }}
                type="profile"
              />

              <Text style={[styles.label, { marginBottom: 2, fontWeight: 'bold' }]}>
                Email Address
              </Text>
              <TextInput
                editable={false}
                value={session?.user?.email}
                placeholder="Email Address"
                cursorColor={'rgb(180,83,9)'}
                className="mb-4 mt-1 h-12 rounded-md border-[1px] border-[#cccccc] bg-white p-3 opacity-80 color-black dark:border-[#444] dark:bg-[#333333] dark:color-white"
              />

              <Text style={[styles.label, { marginBottom: 2, fontWeight: 'bold' }]}>Full Name</Text>
              <TextInput
                onChangeText={handleChange('fullName')}
                onBlur={handleBlur('fullName')}
                value={values.fullName}
                placeholder="Full Name"
                cursorColor={'rgb(180,83,9)'}
                className="mb-3 mt-1 h-12 rounded-md border-[1px] border-[#cccccc] bg-white p-3 color-black dark:border-[#444] dark:bg-[#333333] dark:color-white"
              />
              {touched.fullName && errors.fullName && (
                <Text style={{ color: 'red', marginTop: 5 }}>{errors.fullName}</Text>
              )}

              <Text style={[styles.label, { marginBottom: 2, fontWeight: 'bold' }]}>Username</Text>
              <TextInput
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                value={values.username}
                placeholder="Username"
                cursorColor={'rgb(180,83,9)'}
                className="mb-3 mt-1 h-12 rounded-md border-[1px] border-[#cccccc] bg-white p-3 color-black dark:border-[#444] dark:bg-[#333333] dark:color-white"
              />
              {touched.username && errors.username && (
                <Text style={{ color: 'red', marginTop: 5 }}>{errors.username}</Text>
              )}

              <Text style={[styles.label, { marginBottom: 2, fontWeight: 'bold' }]}>
                Website URL
              </Text>
              <TextInput
                onChangeText={handleChange('website')}
                onBlur={handleBlur('website')}
                value={values.website}
                placeholder="Website URL"
                cursorColor={'rgb(180,83,9)'}
                className="mb-3 mt-1 h-12 rounded-md border-[1px] border-[#cccccc] bg-white p-3 color-black dark:border-[#444] dark:bg-[#333333] dark:color-white"
              />
              {touched.website && errors.website && (
                <Text style={{ color: 'red', marginTop: 5 }}>{errors.website}</Text>
              )}

              <View style={{ flex: 1, justifyContent: 'flex-end', marginTop: 20 }}>
                <Pressable
                  onPress={() => handleSubmit()}
                  disabled={loading}
                  className="items-center rounded-lg bg-amber-600 p-4 dark:bg-amber-700">
                  <Text className="text-xl font-bold text-white">
                    {loading ? 'Saving...' : 'Save'}
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
