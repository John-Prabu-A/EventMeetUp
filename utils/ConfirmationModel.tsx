import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';

const ConfirmationModal = ({ visible, onConfirm, onCancel, question }: any) => {
  const colorScheme = useColorScheme(); // Detect light or dark mode
  const isDarkMode = colorScheme === 'dark';

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF' }, // Dark gray for dark mode
          ]}>
          <Text
            style={[
              styles.modalText,
              { color: isDarkMode ? '#FFFFFF' : '#000000' }, // Text color based on theme
            ]}>
            {question}
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={onCancel}
              style={[
                styles.button,
                {
                  backgroundColor: isDarkMode ? '#6B7280' : '#9CA3AF', // Gray for cancel button
                },
              ]}>
              <Text style={[styles.buttonText, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              style={[
                styles.button,
                {
                  backgroundColor: '#F59E0B', // Amber theme color
                },
              ]}>
              <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Translucent background
  },
  modalContent: {
    width: 300,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 12, // Increased border radius
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ConfirmationModal;
