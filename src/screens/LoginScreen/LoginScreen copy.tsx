import {
  StyleSheet,
  View,
  StatusBar,
  ScrollView,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import {
  NativeBaseProvider,
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Link,
  Button,
  Icon,
  IconButton,
  HStack,
  Divider,
} from 'native-base';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {useSelector, useDispatch} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import {
  inputFontSize,
  primaryColor,
  secondaryColor,
  tokenKey,
  userKey,
  // tokenKey,
  // userKey,
} from '../../helpers/constants';
import {
  AppStackNavigationParamsList,
  AuthParamsList,
} from '../../Navigations/types';
import LoadingModal from '../../components/LoadingModal/LoadingModal';
import {Use} from 'react-native-svg';
import UserDataService from '../../services/UserDataService';
import {setToken, setUser} from '../../store/actions/users';
import {RootState, AppDispatch} from '../../store';
import {IUserData} from '../../types/types';
// import {storeData} from '../../helpers/storage';

interface Error {
  code: string;
  message: string;
}

type LoginScreenProp = StackNavigationProp<AuthParamsList, 'Account'>;

type LoginScreenRouteProp = RouteProp<AppStackNavigationParamsList, 'Auth'>;

const LoginScreen: React.FC = props => {
  const navigation = useNavigation<LoginScreenProp>();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>({code: '', message: ''});
  const userToken = useSelector((state: RootState) => state.user.token);
  const dispatch: AppDispatch = useDispatch();
  const route = useRoute<LoginScreenRouteProp>();

  /**
   * VALIDATE INPUT
   */
  function validateForm() {
    if (email == null || email == '') {
      setError({code: 'ERR_EMAIL', message: 'Email is required'});
      return false;
    } else if (password == null || password == '') {
      setError({code: 'ERR_PASSWORD', message: 'Password is required'});
      return false;
    } else {
      return true;
    }
  }

  /**
   * REQUEST TO LOGIN USER
   */
  function loginUser() {
    if (validateForm()) {
      setLoading(true);
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(response => {
          const uid = response.user.uid;
          const usersRef = firestore().collection('users');
          usersRef
            .doc(uid)
            .get()
            .then(firestoreDocument => {
              if (!firestoreDocument.exists) {
                setLoading(false);
                Alert.alert('Error', 'User does not exist anymore.');
                return;
              }
              const user = firestoreDocument.data();
              if (user != undefined) {
                // const data: IUserData = {
                //   firstname: user.firstname,
                //   lastname: user.lastname,
                //   email: user.email,
                //   phoneno: user.phoneno,
                //   password: user.password,
                //   profile_photo: user.profile_photo,
                //   // account_type: user.account_type,
                //   created_at: user.created_at,
                //   updated_at: user.updated_at,
                // };
                // dispatch(setUser(data));
                setLoading(false);
                // navigation.popToTop();
                // route.params.Login.returnData(true);
                navigation.pop();
                navigation.getParent()?.goBack();
              }

              // navigation.navigate('Home', {user});
            })
            .catch(error => {
              setLoading(false);
              Alert.alert('Error', error.message);
            });
        })
        .catch(error => {
          setLoading(false);
          if (error.code === 'auth/user-not-found') {
            Alert.alert(
              'Error',
              'User with email ' +
                email +
                ' not found. Please sign up to enjoy amazing features',
            );
          } else {
            Alert.alert('Error', error.message);
          }
        });
    } else {
      return;
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#FFF',
      }}>
      <StatusBar backgroundColor={primaryColor} />

      <LoadingModal visible={loading} text="Signing In..." />

      <ScrollView
        keyboardShouldPersistTaps={'always'}
        contentContainerStyle={{}}>
        <View
          style={{
            marginLeft: 10,
            marginRight: 10,
            flex: 1,
          }}>
          <View>
            <Image
              source={require('../../assets/img/Login-bro.png')}
              style={{
                height: Dimensions.get('screen').height / 3.5,
                width: Dimensions.get('window').width,
                resizeMode: 'contain',
              }}
            />
          </View>

          <View style={styles.loginBox}>
            <Text
              colorScheme="defaultColor"
              // fontWeight="500"
              style={{
                fontSize: 20,
              }}>
              Login
            </Text>
            <Text color="muted.400">Sign in to continue!</Text>

            <VStack space={2} mt={5}>
              <FormControl isRequired isInvalid={error.code === 'ERR_EMAIL'}>
                <FormControl.Label
                  _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                  Email Address.
                </FormControl.Label>
                <Input
                  p={2}
                  // variant="rounded"
                  fontSize={inputFontSize}
                  onChangeText={value => setEmail(value)}
                  placeholder="Email Address"
                  keyboardType="email-address"
                  _focus={{
                    borderColor: secondaryColor,
                    backgroundColor: 'white',
                  }}
                />
                <FormControl.ErrorMessage>
                  {error.message}
                </FormControl.ErrorMessage>
              </FormControl>
              <FormControl
                mb={5}
                isRequired
                isInvalid={error.code === 'ERR_PASSWORD'}>
                <FormControl.Label
                  _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
                  Password
                </FormControl.Label>
                <Input
                  p={2}
                  // variant="rounded"
                  placeholder="******"
                  fontSize={inputFontSize}
                  _focus={{
                    borderColor: secondaryColor,
                    backgroundColor: 'white',
                  }}
                  onChangeText={value => setPassword(value)}
                  type="password"
                />
                <FormControl.ErrorMessage>
                  {error.message}
                </FormControl.ErrorMessage>
                <Link
                  _text={{
                    fontSize: 'sm',
                    fontWeight: '500',
                    color: primaryColor,
                  }}
                  onPress={() => navigation.navigate('ForgotPassword')}
                  alignSelf="flex-end"
                  style={{padding: 10}}
                  mt={1}>
                  Forgot Password?
                </Link>
              </FormControl>
              <View>
                <Button
                  leftIcon={
                    <Ionicons
                      name="ios-lock-closed-sharp"
                      color="#FFF"
                      size={16}
                    />
                  }
                  colorScheme={'success'}
                  fontWeight={600}
                  _text={{color: 'white', fontWeight: 600}}
                  onPress={() => loginUser()}>
                  LOGIN
                </Button>
              </View>
              <HStack
                style={{
                  marginTop: 5,
                  padding: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text fontSize="sm" color="muted.700">
                  I'm a new user.
                </Text>
                <Link
                  _text={{color: 'success.500'}}
                  style={{padding: 10}}
                  onPress={() => navigation.navigate('Register')}>
                  Sign Up
                </Link>
              </HStack>
            </VStack>
          </View>

          <View
            style={{
              width: '90%',
              marginTop: 10,
              padding: 10,
              marginBottom: 20,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            <Text fontSize="sm" fontWeight={400} style={{color: 'gray'}}>
              By continuing you agree to{' '}
            </Text>
            <Link
              _text={{color: 'success.500'}}
              onPress={() => navigation.navigate('Terms')}>
              Terms of Service
            </Link>
            <Text fontSize="sm" fontWeight={400} style={{color: 'gray'}}>
              {' '}
              and{' '}
            </Text>
            <Link
              _text={{color: 'success.500'}}
              onPress={() => navigation.navigate('Privacy')}>
              Privacy Policy
            </Link>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  loginBox: {
    borderRadius: 10,
    shadowColor: primaryColor,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.35,
    shadowRadius: 3.5,
  },
});
