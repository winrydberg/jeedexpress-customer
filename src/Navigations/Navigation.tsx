import React from 'react';
import {
  View,
  ImageBackground,
  SafeAreaView,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import AccountScreen from '../screens/AccountScreen/AccountScreen';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import {
  AppStackNavigationParamsList,
  AuthParamsList,
  DrawerParamsList,
} from './types';
import DeliveryDetailsScreen from '../screens/DeliveryDetailsScreen/DeliveryDetailsScreen';
import {primaryColor} from '../helpers/constants';
import RegisterScreen from '../screens/RegisterScreen/RegisterScreen';
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import {Pressable, useStyledSystemPropsResolver} from 'native-base';
import SelectLocationScreen from '../screens/SelectLocationScreen/SelectLocationScreen';
import TrackDeliveryScreen from '../screens/TrackDeliveryScreen/TrackDeliveryScreen';
import PrivacyScreen from '../screens/PrivacyScreen/PrivacyScreen';
import VehicleRegistration from '../screens/VehicleRegistration/VehicleRegistration';
import PaymentMethodScreen from '../screens/PaymentMethodScreen/PaymentMethodScreen';
import DeliverySummary from '../screens/DeliverySummary/DeliverySummary';
import CustomDrawer from './CustomDrawer';
import DeliveryHistory from '../screens/DeliveryHistory/DeliveryHistory';

const Drawer = createDrawerNavigator<DrawerParamsList>();
const Stack = createStackNavigator<AppStackNavigationParamsList>();
const AuthStack = createStackNavigator<AuthParamsList>();

function MyDrawer() {
  return (
    <Drawer.Navigator
      id="MainDrawer"
      initialRouteName="Home"
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: primaryColor,
        },
        headerTintColor: '#FFF',
        headerTitleStyle: {
          fontSize: 16,
          fontWeight: '400',
          fontFamily: 'Amazon',
        },
      }}>
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerLabel: 'Home',
          drawerIcon: ({focused}) => <Ionicons name="home" size={20} />,
          headerShown: false,
          headerTransparent: true,
        }}
      />

      <Drawer.Screen
        name="History"
        component={DeliveryHistory}
        options={({navigation, route}) => ({
          headerLeft: () => {
            return (
              <Pressable
                style={{marginLeft: 10}}
                onPress={() => {
                  navigation.openDrawer();
                }}>
                <Ionicons name="menu" size={25} color={'#FFF'} />
              </Pressable>
            );
          },
          headerTitle: 'Delivery History',
          drawerLabel: 'History',
          drawerIcon: ({focused}) => (
            <Ionicons name="reader-outline" size={20} />
          ),
        })}
      />

      <Drawer.Screen
        name="Auth"
        component={AuthenticationStack}
        options={{
          headerShown: false,
          headerTitle: 'Account',
          drawerLabel: 'Account',
          drawerIcon: ({focused}) => <Ionicons name="person" size={20} />,
        }}
      />

      <Drawer.Screen
        name="TrackDelivery"
        component={TrackDeliveryScreen}
        options={({navigation, route}) => ({
          headerLeft: () => {
            return (
              <Pressable
                style={{marginLeft: 10}}
                onPress={() => {
                  navigation.openDrawer();
                }}>
                <Ionicons name="menu" size={25} color={'#FFF'} />
              </Pressable>
            );
          },
          headerTitle: 'Track Delivery',
          drawerLabel: 'Track',
          drawerIcon: ({focused}) => <Ionicons name="locate-sharp" size={20} />,
        })}
      />

      <Drawer.Screen
        name="Privacy"
        component={PrivacyScreen}
        options={({navigation, route}) => ({
          // headerShown: false,
          headerTitle: 'Privacy',
          drawerLabel: 'Privacy',
          drawerIcon: ({focused}) => (
            <MaterialIcons name="privacy-tip" size={20} />
          ),
          headerLeft: () => {
            return (
              <Pressable
                style={{marginLeft: 10}}
                onPress={() => {
                  navigation.openDrawer();
                }}>
                <Ionicons name="menu" size={25} color={'#FFF'} />
              </Pressable>
            );
          },
        })}
      />
    </Drawer.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator
      initialRouteName="HomeDrawer"
      screenOptions={{
        headerStyle: {
          backgroundColor: primaryColor,
        },
        headerTintColor: '#FFF',
        headerTitleStyle: {
          fontWeight: '400',
          fontFamily: 'Amazon',
          fontSize: 16,
        },
      }}>
      <Stack.Screen
        name="HomeDrawer"
        component={MyDrawer}
        options={{
          headerMode: 'screen',
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />

      <Stack.Screen
        name="DeliveryDetails"
        component={DeliveryDetailsScreen}
        options={{
          headerTitle: 'Delivery Details',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />

      <Stack.Screen
        name="SelectLocation"
        component={SelectLocationScreen}
        options={{
          headerShown: false,
          headerTitle: 'Select Location',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />

      <Stack.Screen
        name="VehicleRegistration"
        component={VehicleRegistration}
        options={{
          headerShown: true,
          headerTitle: 'Register Vehicle',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />

      <Stack.Screen
        name="PaymentMethod"
        component={PaymentMethodScreen}
        options={{
          headerShown: true,
          headerTitle: 'Select Payment Method',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />

      <Stack.Screen
        name="DeliverySummary"
        component={DeliverySummary}
        options={{
          headerShown: true,
          headerTitle: 'Delivery Summary',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
    </Stack.Navigator>
  );
}

function AuthenticationStack() {
  return (
    <AuthStack.Navigator
      initialRouteName="Account"
      screenOptions={{
        headerStyle: {
          backgroundColor: primaryColor,
        },
        headerTintColor: '#FFF',
        headerTitleStyle: {
          fontWeight: '400',
          fontFamily: 'Amazon',
          fontSize: 16,
        },
      }}>
      <AuthStack.Screen
        name="Account"
        component={AccountScreen}
        options={({navigation, route}) => ({
          headerMode: 'screen',
          headerLeft: () => {
            return (
              <Pressable
                style={{marginLeft: 10}}
                onPress={() => {
                  navigation.openDrawer();
                }}>
                <Ionicons name="menu" size={25} color={'#FFF'} />
              </Pressable>
            );
          },
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        })}
      />
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerMode: 'screen',
          // headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <AuthStack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerTitle: 'Sign Up',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
    </AuthStack.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerImage: {
    height: 150,
  },
});

export default AppStack;
