/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {type PropsWithChildren, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  StatusBar,
  Alert,
} from 'react-native';
import {enableLatestRenderer} from 'react-native-maps';
import SplashScreen from 'react-native-splash-screen'
import {Provider} from 'react-redux';
import messaging from '@react-native-firebase/messaging';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import {NativeBaseProvider, Box, extendTheme} from 'native-base';
import {NavigationContainer} from '@react-navigation/native';
import AppLoadingScreen from './src/screens/AppLoadingScreen/AppLoadingScreen';
import AppStack from './src/Navigations/Navigation';
import store from './src/store';
import {primaryColor} from './src/helpers/constants';

enableLatestRenderer();

// const Section: React.FC<
//   PropsWithChildren<{
//     title: string;
//   }>
// > = ({children, title}) => {
//   const isDarkMode = useColorScheme() === 'dark';
//   return (
//     <View style={styles.sectionContainer}>
//       <Text
//         style={[
//           styles.sectionTitle,
//           {
//             color: isDarkMode ? Colors.white : Colors.black,
//           },
//         ]}>
//         {title}
//       </Text>
//       <Text
//         style={[
//           styles.sectionDescription,
//           {
//             color: isDarkMode ? Colors.light : Colors.dark,
//           },
//         ]}>
//         {children}
//       </Text>
//     </View>
//   );
// };

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage);
      Alert.alert('New message', remoteMessage?.data?.message);
      // dispatch(addNotification(remoteMessage.notification));
      // dispatch(setNotificationUnreadCount());
    });
    SplashScreen.hide();
    return unsubscribe;
  });

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <Provider store={store}>
      <StatusBar animated={true} backgroundColor={primaryColor} />
      <NavigationContainer>
        <NativeBaseProvider>
          <AppStack />
        </NativeBaseProvider>
      </NavigationContainer>
    </Provider>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
