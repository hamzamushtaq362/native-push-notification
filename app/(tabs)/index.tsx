import React, { useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';

// Request notification permissions and set up a notification channel
const setupNotifications = async () => {
  // Request permissions
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    if (newStatus !== 'granted') {
      Alert.alert('Permission not granted', 'Notifications permission is required to show notifications.');
      return false;
    }
  }

  // Set up notification channel (required for Android)
  await Notifications.setNotificationChannelAsync('default', {
    name: 'Default',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
  });
  
  return true;
};

// Schedule notifications
const scheduleNotification = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Repeated Notification',
      body: 'This notification was sent every 5 seconds!',
      sound: 'default',
    },
    trigger: {
      seconds: 5,
      repeats: true,
    },
  });
  console.log('Notification scheduled!');
};

const App = () => {
  useEffect(() => {
    const initNotifications = async () => {
      const permissionsGranted = await setupNotifications();
      if (permissionsGranted) {
        await scheduleNotification();
      }
    };

    // Initialize notifications
    initNotifications();

    // Listener for incoming notifications
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    // Clean up listener on unmount
    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Notification Example</Text>
    </View>
  );
};

export default App;
