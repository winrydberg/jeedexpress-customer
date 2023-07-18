import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  Share,
  Linking,
} from 'react-native';
import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Button, List, Divider} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {AppDispatch, RootState} from '../../store';
import {
  appName,
  appURL,
  secondaryColor,
  textSecondary,
} from '../../helpers/constants';
import {AuthParamsList, DrawerParamsList} from '../../Navigations/types';
import {setToken, setUser} from '../../store/actions/users';

type AccountScreenProps = StackNavigationProp<AuthParamsList, 'Account'>;

const AccountScreen = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const navigation = useNavigation<AccountScreenProps>();
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();

  // const goHomePage = (toHome: boolean) => {
  //   if (toHome) {
  //     navigation.goBack();
  //   }
  // };

  /**
   * LOGOUT USER
   */
  function logoutUser() {
    Alert.alert('CONFIRMATION', 'Are you sure you want to logout', [
      {
        text: 'CANCEL',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'YES, LOGOUT',
        onPress: async () => {
          // setLoading(true);
          try {
            await AsyncStorage.clear();
            dispatch(setUser(null));
            dispatch(setToken(null));
            // setLoading(false);
          } catch (e) {
            // clear error
            setLoading(false);
            // alert('Oops unable to logout. Please try again');
          }
        },
      },
    ]);
  }

  /**
   * INVITE FRIENDS
   */
  async function inviteFriends() {
    try {
      const result = await Share.share({
        message:
          appName +
          ` | Hi, have you heard about the JEED Express app? Delivery your goods at an affordable price. \n\n Use the attached link to download app ${appURL}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(result.activityType);
          // shared with activity type of result.activityType
        } else {
          console.log(result);
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        Alert.alert('', 'Earn credit by inviting more friends.');
      }
    } catch (error: any) {
      Alert.alert('ERROR', error.message);
    }
  }

  /**
   * OPEN OUR SOCIALS LINKS
   *
   * @param url
   */
  const openLink = async (url: string) => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Cannot Open Link ${url}`);
    }
  };

  const renderUserAccount = () => {
    if (user != null && user != undefined) {
      // Alert.alert('User', JSON.stringify(user));
      return (
        <View style={styles.profileContainer}>
          <View>
            <Image
              source={require('../../assets/img/user.png')}
              style={styles.profilePhoto}
            />
            <View style={styles.editiconView}>
              <Ionicons name="ios-pencil" size={12} color="#FFF" />
            </View>
          </View>

          <View style={styles.profileDetails}>
            <Text style={{fontSize: 18}}>
              {user.firstname + ' ' + user.lastname}
            </Text>
            <Text style={{color: textSecondary}}>{user.email}</Text>
          </View>
        </View>
      );
    } else {
      return (
        <View
          style={{
            marginTop: 50,
            marginBottom: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Ionicons name="ios-person-circle" size={100} />
          <Text style={{textAlign: 'center', color: textSecondary}}>
            You are not logged in.
          </Text>
          <Text style={{textAlign: 'center', color: textSecondary}}>
            Sign in now to enjoy full features on {appName}
          </Text>

          <View style={{width: '50%', marginTop: 20}}>
            <Button
              leftIcon={
                <Ionicons name="ios-lock-closed-sharp" color="#FFF" size={14} />
              }
              size="sm"
              onPress={() => navigation.navigate('Login')}>
              Sign In
            </Button>
          </View>
        </View>
      );
    }
  };
  return (
    <View>
      <View>{renderUserAccount()}</View>
      <View>
        <List mt={2} my={2}>
          <List.Item>
            <Text style={{fontWeight: 'bold', paddingBottom: 5}}>
              MY ACCOUNT
            </Text>
          </List.Item>
          <Divider />
          <List.Item onPress={() => {
            Alert.alert("BECOME A RIDER", "Contact JEED Express administrator on  024-331-0149 to sign up as a rider")
          }}>
            <List.Icon
              as={
                <View
                  style={{
                    padding: 5,
                    backgroundColor: secondaryColor,
                    borderRadius: 2,
                  }}>
                  <Ionicons
                    name="arrow-forward-circle-outline"
                    color="#FFF"
                    // style={{fontWeight: 'bold'}}
                    size={20}
                  />
                </View>
              }
            />
            <View style={{marginLeft: 10}}>
              <Text> Become a Rider</Text>
            </View>
          </List.Item>

          <List.Item onPress={() => navigation.navigate('History')}>
            <List.Icon
              as={
                <View
                  style={{
                    padding: 5,
                    backgroundColor: secondaryColor,
                    borderRadius: 2,
                  }}>
                  <Ionicons
                    name="arrow-forward-circle-outline"
                    color="#FFF"
                    // style={{fontWeight: 'bold'}}
                    size={20}
                  />
                </View>
              }
            />
            <View style={{marginLeft: 10}}>
              <Text> Delivery History</Text>
            </View>
          </List.Item>

          <List.Item
            onPress={() =>
              openLink(
                'https://play.google.com/store/apps/details?id=com.onlinequiz',
              )
            }>
            <List.Icon
              as={
                <View
                  style={{
                    padding: 5,
                    backgroundColor: secondaryColor,
                    borderRadius: 2,
                  }}>
                  <Ionicons
                    name="arrow-forward-circle-outline"
                    color="#FFF"
                    // style={{fontWeight: 'bold'}}
                    size={20}
                  />
                </View>
              }
            />

            <View style={{marginLeft: 10}}>
              <Text> Submit Review</Text>
            </View>
          </List.Item>

          <List.Item onPress={() => inviteFriends()}>
            <List.Icon
              as={
                <View
                  style={{
                    padding: 5,
                    backgroundColor: secondaryColor,
                    borderRadius: 2,
                  }}>
                  <Ionicons
                    name="arrow-forward-circle-outline"
                    color="#FFF"
                    // style={{fontWeight: 'bold'}}
                    size={20}
                  />
                </View>
              }
            />

            <View style={{marginLeft: 10}}>
              <Text> Invite Friends</Text>
            </View>
          </List.Item>

          <List.Item onPress={() => logoutUser()}>
            <List.Icon
              as={
                <View
                  style={{
                    padding: 5,
                    backgroundColor: secondaryColor,
                    borderRadius: 2,
                  }}>
                  <Ionicons
                    name="arrow-forward-circle-outline"
                    color="#FFF"
                    // style={{fontWeight: 'bold'}}
                    size={20}
                  />
                </View>
              }
            />

            <View style={{marginLeft: 10}}>
              <Text> Logout</Text>
            </View>
          </List.Item>
        </List>
      </View>
    </View>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  profileContainer: {
    // width: 90,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  profilePhoto: {
    height: 100,
    width: 100,
    borderRadius: 50,
    resizeMode: 'cover',
  },
  editiconView: {
    backgroundColor: secondaryColor,
    height: 30,
    width: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: -10,
    top: 50,
  },
  profileDetails: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
