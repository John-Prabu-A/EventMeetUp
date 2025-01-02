import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Voice from '@react-native-voice/voice';
import Tts from 'react-native-tts';

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [speechText, setSpeechText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize TTS properly with error handling
    try {
      Tts.setDefaultLanguage('en-US');
      Tts.setDefaultRate(0.5);
      Tts.speak('Hello');
    } catch (error) {
      console.error('Error initializing TTS:', error);
    }

    // Setup Voice events
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    // Speak the greeting when component mounts
    Tts.speak('How can I help you?');
  }, []);

  const onSpeechResults = (event: any) => {
    // Capture the user's spoken words
    const userInput = event.value[0];
    setSpeechText(userInput);

    // Check if the user asked for a tea party
    if (userInput.toLowerCase().includes('tea party')) {
      provideEventPlan();
    } else {
      Tts.speak("Sorry, I didn't understand that.");
    }
  };

  const onSpeechError = (error: any) => {
    console.log('Error: ', error);
    setIsListening(false);
    Tts.speak("Sorry, I couldn't hear anything. Please try again.");
  };

  const startListening = async () => {
    setIsListening(true);
    setIsLoading(true);
    try {
      await Voice.start('en-US');
    } catch (error) {
      console.error('Error starting speech recognition: ', error);
    }
  };

  const stopListening = async () => {
    setIsListening(false);
    try {
      await Voice.stop();
      setIsLoading(false);
    } catch (error) {
      console.error('Error stopping speech recognition: ', error);
    }
  };

  const provideEventPlan = () => {
    const teaPartyPlan =
      "For a tea party, I suggest starting with a warm welcome. You can have a variety of teas like Earl Grey, Chamomile, and Green Tea. Offer snacks like finger sandwiches, scones, and pastries. Decorate with soft pastel colors and floral arrangements. And don't forget to have some light background music to set the mood!";
    Tts.speak(teaPartyPlan);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice Assistant</Text>
      <Text style={styles.speechText}>You said: {speechText}</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={isListening ? stopListening : startListening}>
          <Text style={styles.buttonText}>
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  speechText: {
    fontSize: 18,
    marginTop: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default VoiceAssistant;
