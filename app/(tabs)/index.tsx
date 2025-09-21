import AppButton from '@/components/AppButton';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';
import {
  Platform,
  StyleSheet,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function HomeScreen() {
  const hasTriggeredOnLoad = useRef(false); // prevents multiple triggers
  const devicePushToken = useRef<string | undefined>(undefined);

  useEffect(() => {
    registerForPushNotificationsAsync();

    if (Platform.OS === 'android') {
      Notifications.getNotificationChannelsAsync();
    }
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <WebView
        source={{ uri: "https://expo.dev" }}
        style={styles.webview}
        onLoadEnd={async () => {
          if (!hasTriggeredOnLoad.current) {
            await schedulePushNotification(
              1,
              "👋 Welcome!",
              "Thanks for exploring the WebView screen. Don’t forget to check the Video Player screen!"
            );
            hasTriggeredOnLoad.current = true;
          }
        }}
      />
      <View style={styles.bottomContainer}>
        <AppButton
          title='Schedule goal notification'
          onPress={async () => {
            await schedulePushNotification(
              3,
              "🎉 Congratulations!",
              "You’ve successfully achieved your goal. Keep going 🚀"
            );
          }}
        />
      </View>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  bottomContainer: {
    padding: 12,
    backgroundColor: 'gray',
    backfaceVisibility: 'visible',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

async function schedulePushNotification(time: number, title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: { customData: 'any extra payload here' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: time
    },
  });
  // await Notifications.scheduleNotificationAsync({
  //   content: {
  //     title: "Hello 👋 Sopan, Welcome!",
  //     body: 'Thanks for exploring the WebView screen. Don’t forget to check the Video Player screen!',
  //     data: { data: 'goes here', test: { test1: 'more data' } },
  //   },
  //   trigger: {
  //     type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
  //     seconds: time,
  //   },
  // });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('myNotificationChannel', {
      name: 'A channel is needed for the permissions prompt to appear',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    // EAS projectId is used here.
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error('Project ID not found');
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(token);
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}