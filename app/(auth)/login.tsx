import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useLocalSearchParams, Redirect, useRouter, Href } from 'expo-router';
import Animated, {
  Easing,
  withTiming,
  useAnimatedStyle,
  runOnJS,
  useSharedValue,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '~/providers/AuthProvider';
import Button from '~/components/AuthButton';
import { supabase } from '~/utils/supabase';

import { useNearbyEventsWithDefaultService } from '~/hooks/useNearbyEvents';
import getEmbedding from '~/utils/generateEmbedding';

type UserData = {
  email: string;
  password: string;
  confirmPassword?: string;
};

type Event = {
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

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(!useLocalSearchParams());
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);
  const animationValue = useSharedValue(0);
  const formikRef = useRef<any>(null);
  const { updateAuth } = useAuth();
  const router = useRouter();
  const { events, loading: eventsLoading } = useNearbyEventsWithDefaultService();
  console.log('Events in Login : ', events);

  const toggleFormType = useCallback(() => {
    animationValue.value = withTiming(
      1,
      { duration: 300, easing: Easing.inOut(Easing.ease) },
      () => {
        runOnJS(setIsSignUp)(!isSignUp);
        animationValue.value = withTiming(0, { duration: 300, easing: Easing.inOut(Easing.ease) });
      }
    );
    formikRef.current?.resetForm();
  }, [isSignUp]);

  const insertProfile = async (userId: string, userEmail: string) => {
    console.log('Inside insert : ', userId, userEmail);
    const { data: userData, error } = await supabase
      .from('profiles')
      .insert({ id: userId, updated_at: new Date().toISOString(), username: userEmail })
      .select()
      .single();

    console.log('UserPofileInsertedData : ', userData);
    if (error) {
      console.error('Error creating User:', error.message);
    }
  };

  async function updateUserEmbedding(
    userId: string,
    events: Event[] = JSON.parse(`[{
  "created_at": "2024-10-02T15:44:51.788425+00:00",
  "date": "2024-10-02T15:43:43.25+00:00",
  "description": "Learn coding",
  "dist_meters": 6637125.47485328,
  "id": 7,
  "image_uri": "1727883853392.png",
  "lat": 75.417781,
  "location": "Greenland Sea",
  "long": -8.106768,
  "title": "Coding chrompet",
  "user_id": "69ed032d-aa91-4f3a-839e-f8941e2a7437"
}]`)
  ) {
    console.log('Inside Update Events : ', events);
    const text = JSON.stringify(events[0], null, 2);
    console.log('Text is ', text);
    try {
      // Check if embedding already exists in database
      const { data: embeddingData, error: embeddingError } = await supabase
        .from('profiles')
        .select('user_embedding')
        .eq('id', userId)
        .single();
      console.log('User Embedding Data : ', embeddingData);
      if (!embeddingData) return;

      if (embeddingError) Alert.alert(embeddingError as string);
      console.log('No error in user embedding retreval');
      if (embeddingData.user_embedding) return; // Embedding already exists
      console.log('NO user embedding creating...');
      const embedding = await getEmbedding(text);
      console.log('created Embedding : ', embedding);
      // Insert embedding into database
      const { data: updateData, error: insertError } = await supabase
        .from('profiles')
        .update({
          user_embedding: embedding,
          updated_at: new Date().toISOString(),
        } as any)
        .eq('id', userId);
      console.log('updated Data : ', updateData);
      if (insertError) Alert.alert(insertError.message);
    } catch (error) {
      Alert.alert('Error fetching embedding: ' + (error as Error).message);
    }
  }

  const handleSignIn = useCallback(
    async (values: UserData) => {
      setLoading(true);
      const { data: session, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      const userId = session?.user?.id as string;
      console.log('User Id : ', userId);
      await updateUserEmbedding(userId, events);
      setLoading(false);

      if (error) {
        Alert.alert('Sign In Error', error.message);
      } else {
        updateAuth();
        router.navigate('/(tabs)' as Href);
      }
    },
    [updateAuth]
  );

  const handleSignUp = useCallback(async (values: UserData) => {
    console.log('Events : ', events);

    setLoading(true);
    const { data: session, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    });
    if (error) {
      Alert.alert('Sign Up Error', error.message);
      setLoading(false);
      return;
    }

    if (!session.user) {
      Alert.alert('Sign Up Error', 'User Not Created!');
      setLoading(false);
      return;
    }
    updateAuth();
    const userId: string = session.user?.id;
    const userEmail: string = values.email;

    console.log(userId, userEmail);

    await insertProfile(userId, userEmail);
    if (events.length !== 0) await updateUserEmbedding(userId, events);
    else await updateUserEmbedding(userId);
    setLoading(false);

    toggleFormType();
  }, []);

  const handleAuth = useCallback(
    (values: UserData) => {
      isSignUp ? handleSignUp(values) : handleSignIn(values);
    },
    [isSignUp, handleSignUp, handleSignIn]
  );

  if (loading || eventsLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#f59e0b" />
      </View>
    );
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: isSignUp
      ? Yup.string()
          .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
          .required('Confirm Password is required')
      : Yup.string(),
  });

  return (
    <Formik
      innerRef={formikRef}
      initialValues={{ email: '', password: '', confirmPassword: '' }}
      onSubmit={(values, { resetForm }) => {
        handleAuth(values);
        resetForm();
      }}
      validationSchema={validationSchema}>
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View style={{ flex: 1, justifyContent: 'center', padding: 10, backgroundColor: '#fff' }}>
          <View style={[{ padding: 10 }]}>
            {/* Conditionally render the sign-in or sign-up forms */}
            <Text className="mt-4 text-lg font-semibold text-black">Email</Text>
            <TextInput
              ref={emailRef}
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              autoCapitalize="none"
              selectionColor="#f59e0b"
              style={{
                height: 40,
                padding: 10,
                borderWidth: 1,
                borderRadius: 5,
                marginTop: 10,
                borderColor: '#cccccc',
              }}
              placeholder="Email"
              placeholderTextColor="#888888"
              keyboardType="default"
            />

            {touched.email && errors.email && (
              <Text className="mt-2 text-red-500">{errors.email}</Text>
            )}

            <Text className="mt-4 text-lg font-semibold text-black">Password</Text>
            <View className="mt-2 flex flex-row items-center">
              <TextInput
                ref={passwordRef}
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                autoCapitalize="none"
                selectionColor="#f59e0b"
                style={{
                  height: 40,
                  padding: 10,
                  borderWidth: 1,
                  borderRadius: 5,
                  flex: 1,
                  borderColor: '#cccccc',
                }}
                placeholder="Password"
                placeholderTextColor="#888888"
                secureTextEntry={!passwordVisible}
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible((prev) => !prev)}
                className="top-1 ml-[-40px] p-2">
                <Ionicons
                  name={passwordVisible ? 'eye-off-outline' : 'eye'}
                  size={24}
                  color="#444"
                />
              </TouchableOpacity>
            </View>
            {touched.password && errors.password && (
              <Text className="mt-2 text-red-500">{errors.password}</Text>
            )}

            {isSignUp && (
              <>
                <Text className="mt-4 text-lg font-semibold text-black">Confirm Password</Text>
                <View className="mt-2 flex flex-row items-center">
                  <TextInput
                    value={values.confirmPassword}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    autoCapitalize="none"
                    selectionColor="#f59e0b"
                    style={{
                      height: 40,
                      padding: 10,
                      borderWidth: 1,
                      borderRadius: 5,
                      flex: 1,
                      borderColor: '#cccccc',
                    }}
                    placeholder="Confirm Password"
                    placeholderTextColor="#888888"
                    secureTextEntry={!confirmPasswordVisible}
                  />
                  <TouchableOpacity
                    onPress={() => setConfirmPasswordVisible((prev) => !prev)}
                    className="top-1 ml-[-40px] p-2">
                    <Ionicons
                      name={confirmPasswordVisible ? 'eye-off-outline' : 'eye'}
                      size={24}
                      color="#444"
                    />
                  </TouchableOpacity>
                </View>
                {touched.confirmPassword && errors.confirmPassword && (
                  <Text className="mt-2 text-red-500">{errors.confirmPassword}</Text>
                )}
              </>
            )}

            <Button
              disabled={loading}
              text={
                loading
                  ? isSignUp
                    ? 'Creating Account...'
                    : 'Logging in...'
                  : isSignUp
                    ? 'Create Account'
                    : 'Log In'
              }
              onPress={handleSubmit as () => void}
              className={
                `mt-6 rounded-md py-2 text-white ` + loading ? 'bg-amber-400' : 'bg-amber-500'
              }
            />
            <Text
              onPress={toggleFormType}
              disabled={loading}
              className="mt-4 text-center text-lg text-amber-500">
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </Text>
          </View>
        </View>
      )}
    </Formik>
  );
}
