import {
  Dimensions,
  StyleSheet,
  View,
  Pressable,
  Image,
  StatusBar,
  Alert,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import SplashScreen from 'react-native-splash-screen'
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  AnimatedRegion,
  MarkerAnimated,
} from 'react-native-maps';
import {Actionsheet, useDisclose, Text} from 'native-base';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import {useSelector, useDispatch} from 'react-redux';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import BookLater from '../../components/BookLater/BookLater';
import {
  AppStackNavigationParamsList,
  DrawerParamsList,
} from '../../Navigations/types';
import {
  btnColor,
  imageUrl,
  primaryColor,
  secondaryColor,
  tokenKey,
  userKey,
} from '../../helpers/constants';
import {AppDispatch, RootState} from '../../store';
import {
  setToken,
  setUser,
  setUserCurrentLocation,
} from '../../store/actions/users';
import {
  setAmountPerKm,
  setDeliveryMode,
  setPackageTypes,
  setPaymentMethods,
  setTransportModes,
} from '../../store/actions/delivery';
import {IUserData, DeliveryMode} from '../../types/types';
import DeliveryDataService from '../../services/DeliveryDataService';
import {getDataFromStore, getTokenFromStorage} from '../../helpers/storage';
import {background} from 'native-base/lib/typescript/theme/styled-system';

const actionViewHeight = Dimensions.get('window').height / 2.7;

type HomeScreenProps = StackNavigationProp<
  AppStackNavigationParamsList,
  'HomeDrawer'
>;

interface UserLocation {
  latitude: number;
  longitude: number;
}

const defaultLocation = {
  longitude: -0.236193,
  latitude: 5.706244,
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenProps>();
  const [deliveryType, setDeliveryType] = useState<string>('1');
  const mapviewRef = useRef<any>();
  const [loading, setLoading] = useState<boolean>(true);

  // const [location, setUserLocation] = useState<UserLocation>({
  //   latitude: 0.0,
  //   longitude: 0.0,
  // });
  const dispatch: AppDispatch = useDispatch();
  const location = useSelector(
    (state: RootState) => state.user.current_location,
  );
  const delivery_modes = useSelector(
    (state: RootState) => state.delivery.delivery_modes,
  );
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    getUserCurrentLocation();
    getDeliveryModes();
    getLoggedInUser();
    getPackageTypes();
    getPaymentMethods();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Geolocation Permission',
          message: 'Can we access your location?',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      console.log('granted', granted);
      if (granted === 'granted') {
        console.log('You can use Geolocation');
        return true;
      } else {
        Alert.alert(
          'Error',
          'This app needs to access your location to serve you better',
        );
        return false;
      }
    } catch (err) {
      return false;
    }
  };

  const getUserCurrentLocation = () => {
    const result = requestLocationPermission();
    result.then(res => {
      console.log('res is:', res);
      if (res) {
        Geolocation.getCurrentPosition(
          info => {
            animateToCoordinate(info.coords.latitude, info.coords.longitude);
            console.log(info);
            dispatch(
              setUserCurrentLocation({
                latitude: info.coords.latitude,
                longitude: info.coords.longitude,
              }),
            );
          },
          error => {
            console.log(error);
            // Alert.alert('Error', JSON.stringify(error));
          },
          {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
        );
      }
    });
    console.log(location);
  };

  /**
   *
   *GET LOGGED IN USER DATA FROM STORAGE
   */
  const getLoggedInUser = () => {
    getDataFromStore(userKey).then(response => {
      if (response.status == 'success') {
        dispatch(setUser(JSON.parse(response.data)));
      }
    });

    getTokenFromStorage(tokenKey).then(response => {
      if (response.status == 'success') {
        dispatch(setToken(response.data));
      }
    });
  };

  /**
   * GET PACKAGE TYPES INTO REDUX STORE
   */
  const getPackageTypes = () => {
    DeliveryDataService.getPackageTypes()
      .then(res => {
        if (res.data.status == 'success') {
          dispatch(setPackageTypes(res.data.types));
        } else {
          Alert.alert('Error', res.data.message);
        }
      })
      .catch(error => {
        Alert.alert('Error', error.message);
      });
  };

  /**
   * GET DELIVERY MODES
   */
  const getDeliveryModes = () => {
    DeliveryDataService.getDeliveryModes()
      .then(res => {
        setLoading(false);

        if (res.data.status == 'success') {
          
          dispatch(setTransportModes(res.data.modes));

        } else {
          Alert.alert('Error', res.data.message);
        }
      })
      .catch(error => {
        setLoading(false);
        Alert.alert('Error', error.message);
      });
  };

  /**
   *
   *
   */
  const getPaymentMethods = () => {
    DeliveryDataService.getPaymentMethods()
      .then(res => {
        if (res.data.status == 'success') {
          // console.log(res.data.paymenttypes);
          dispatch(setPaymentMethods(res.data.paymenttypes));
        } else {
          Alert.alert('Error', res.data.message);
        }
      })
      .catch(error => {
        Alert.alert('Error', error.message);
      });
  };

  /**
   *
   * @param lat
   * @param lng
   */
  const animateToCoordinate = (lat: number, lng: number) => {
    if (mapviewRef) {
      mapviewRef.current.animateCamera({
        center: {
          latitude: lat,
          longitude: lng,
        },
        duration: 500,
      });
    }
  };

  /**
   *
   *
   */
  const deliveryDetails = () => {
    if (user != null) {
      dispatch(setDeliveryMode(deliveryType));
      navigation.navigate('DeliveryDetails');
    } else {
      Alert.alert(
        'Authentication ',
        'You must be signed in to book a delivery',
        [
          {
            text: 'CANCEL',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'OK, SIGN IN / SIGN UP',
            onPress: () => {
              navigation.navigate('Auth');
            },
          },
        ],
      );
    }
  };


  const handleRef =(ref:any) => {
    var map = ref;

    if (!map) {
      return;
    }

    // eslint-disable-next-line no-undef
    requestAnimationFrame(() => {
      if (!map) {
        return;
      }

      map.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        },
        1
      );
    });
  }

  const renderCenterButton = () => {
    return (
      <Pressable
        onPress={() => {
          animateToCoordinate(location?.latitude, location?.longitude);
        }}
        style={styles.centerLocationBtn}>
        <MaterialIcons name="my-location" size={20} color={'gray'} />
      </Pressable>
    );
  };

  const renderDeliveryModes = () => {
    if (loading) {
      <View>
        <ActivityIndicator size={'large'} color={primaryColor} />
      </View>;
    } else {
      if (delivery_modes.length > 0) {
        return delivery_modes.map((mode: DeliveryMode) => {
          return (
            <Pressable
              // disabled= {mode.is_active==true ? false : true}
              key={mode.id}
              onPress={() => {
                if(mode.is_active==false){
                  Alert.alert(
                    'Unavailable ',
                    'This service is currently not available. Check again later',
                    [
                      {
                        text: 'OK',
                        onPress: () => {
                          setDeliveryType("1")
                        },
                      },
                    ],
                  );
                }else{
                  setDeliveryType(mode.id);
                  dispatch(setDeliveryMode(mode.id));
                  dispatch(setAmountPerKm(mode.amount_per_km));
                }
                
              }}
              style={[
                styles.selectIndication,
                deliveryType == mode.id
                  ? {
                      borderWidth: 4,
                      borderColor: secondaryColor,
                      padding: 10,
                      borderRadius: 10,
                    }
                  : {},
              ]}>
              <Image
                source={{uri: mode.image}}
                style={[styles.motorbike, ,]}
              />
              <Text>{mode.name}</Text>
            </Pressable>
          );
        });
      }
    }
  };

  /**
   *
   *
   */
  return (
    <>
      <View style={styles.container}>
        <View style={styles.mapView}>
          <MapView
            ref={mapviewRef}
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.map}
            initialRegion={{
              latitude:
                location != null ? location.latitude : defaultLocation.latitude,
              longitude:
                location != null
                  ? location.longitude
                  : defaultLocation.longitude,
              latitudeDelta: 0.055,
              longitudeDelta: 0.0521,
            }}>
            <Marker
              key={1}
              coordinate={{
                latitude:
                  location != null
                    ? location.latitude
                    : defaultLocation.latitude,
                longitude:
                  location != null
                    ? location.longitude
                    : defaultLocation.longitude,
              }}
              title={'User Location'}
              description={'You current location'}
            />
          </MapView>
          {renderCenterButton()}
          <View style={styles.topActionContainer}>
            <Pressable
              onPress={() => {
                navigation.dispatch(DrawerActions.openDrawer());
              }}
              style={styles.hamburger}>
              <Ionicons name="menu" size={25} color="#FFF" />
            </Pressable>

            {/* <Pressable
              style={styles.btn}
              onPress={() => {
                navigation.navigate('VehicleRegistration');
              }}>
              <Text style={styles.btnText}>Become a Rider</Text>
            </Pressable> */}
          </View>
        </View>

        <View style={styles.actionView}>
          <View style={styles.deliveryTypeDescContainer}>
            <Text style={{fontSize: 17}} fontWeight={600}>
              Select Delivery Type
            </Text>
          </View>
          <View style={styles.deliveryTypeContainer}>
            {renderDeliveryModes()}

          </View>
          <View>
            <Pressable
              android_ripple={{color: 'brown', borderless: true, radius: 10}}
              onPress={() => deliveryDetails()}
              style={styles.bookActionBtn}>
              <Text style={styles.bookActionBtnText} fontWeight={600}>
                Book
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    // ...StyleSheet.absoluteFillObject,
    // height: 400,
    // width: 400,
    // justifyContent: 'flex-end',
    // alignItems: 'center',
    flex: 1,
  },
  hamburger: {
    position: 'absolute',
    left: 10,
    top: 10,
    backgroundColor: primaryColor,
    height: 50,
    width: 50,
    borderRadius: 25,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
  },

  map: {
    ...StyleSheet.absoluteFillObject,
  },

  mapView: {
    height: Dimensions.get('window').height - actionViewHeight,
  },

  actionView: {
    height: actionViewHeight,
    width: Dimensions.get('window').width,
    backgroundColor: '#FFF',
    bottom: 0,
    elevation: 20,
  },

  topActionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 50,
  },

  btn: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: primaryColor,
    borderRadius: 100,
    position: 'absolute',
    right: 10,
    top: 10,
  },

  btnText: {
    color: '#FFF',
  },

  motorbike: {
    height: 60,
    width: 60,
  },

  deliveryTypeDescContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  deliveryTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    flex: 1,
  },
  selectIndication: {
    alignItems: 'center',
    width: Dimensions.get('window').width / 3,
  },

  bookActionBtn: {
    backgroundColor: btnColor,
    height: 50,
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookActionBtnText: {
    color: '#FFF',
  },
  centerLocationBtn: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});
