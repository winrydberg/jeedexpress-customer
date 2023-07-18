import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {useSelector, useDispatch} from 'react-redux';
import {VStack, Divider, Box, Heading, Input, Icon, Button} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

import {AppDispatch, RootState} from '../../store';
import {AppStackNavigationParamsList} from '../../Navigations/types';
import {setUserCurrentLocation} from '../../store/actions/users';
import {primaryColor} from '../../helpers/constants';
import {
  setDropOffLocation,
  setPickUpLocation,
  updateDropOffLat,
  updateDropOffLng,
  updateDropOffLocName,
} from '../../store/actions/delivery';
import GoogleLocation from '../../models/GoogleLocation/GoogleLocation';

const {height, width} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 8; //Very high zoom level
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

interface Location {
  longitude: number;
  latitude: number;
}

type LocationScreenProp = StackNavigationProp<
  AppStackNavigationParamsList,
  'SelectLocation'
>;
type SelectLocationScreenRouteProp = RouteProp<
  AppStackNavigationParamsList,
  'SelectLocation'
>;

const SelectLocationScreen = () => {
  const navigation = useNavigation<LocationScreenProp>();
  const route = useRoute<SelectLocationScreenRouteProp>();
  const location = useSelector(
    (state: RootState) => state.user.current_location,
  );
  const dispatch: AppDispatch = useDispatch();
  const [selectedLocation, setSelectedLocation] = useState<any>();
  const [locLoading, setLocationLocading] = useState<boolean>(false);
  const [locatonDetails, setLocationDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  let mapviewRef = useRef<any>(null);
  let markerRef = useRef<any>(null);

  useEffect(() => {
    // setTimeout(() => {
    //   if (location == null) {
    //     Geolocation.getCurrentPosition(
    //       info => {
    //         console.log(info);
    //         // Alert.alert('Error', JSON.stringify(info.coords.latitude));
    //         dispatch(
    //           setUserCurrentLocation({
    //             latitude: info.coords.latitude,
    //             longitude: info.coords.longitude,
    //           }),
    //         );
    //       },
    //       error => Alert.alert('Error', JSON.stringify(error)),
    //       {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    //     );
    //   }
    // }, 1000);
  }, [locatonDetails]);

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
    // if (markerRef && markerRef.current) {
    //   markerRef.current.showCallout();
    // }
  };

  const sendLocationToReduxStore = () => {
    if (route.params.location == 'pickup') {
      setLoading(true);
      if (selectedLocation) {
        dispatch(
          setPickUpLocation(
            new GoogleLocation(
              selectedLocation?.description,
              selectedLocation?.matched_substrings,
              selectedLocation?.place_id,
              selectedLocation?.reference,
              selectedLocation?.term != null ? selectedLocation.term : [],
              selectedLocation?.types != null ? selectedLocation.types : [],
              locatonDetails,
            ),
          ),
        );
      }
      setLoading(false);
    } else if (route.params.location == 'dropoff') {
      setLoading(true);
      let gglocation = new GoogleLocation(
        selectedLocation?.description,
        selectedLocation?.matched_substrings,
        selectedLocation?.place_id,
        selectedLocation?.reference,
        selectedLocation?.term != null ? selectedLocation.term : [],
        selectedLocation?.types != null ? selectedLocation.types : [],
        locatonDetails,
      );

      if (selectedLocation) {
        dispatch(
          updateDropOffLocName({
            index: route.params.index,
            loc_name: selectedLocation.description,
          }),
        );
        dispatch(
          updateDropOffLat({
            index: route.params.index,
            lat: gglocation.details?.geometry?.location.lat,
          }),
        );
        dispatch(
          updateDropOffLng({
            index: route.params.index,
            lng: gglocation.details?.geometry?.location.lng,
          }),
        );
      }
      setLoading(false);
    }

    navigation.goBack();
  };

  /**
   * RENDEER SELETRED LOCATION
   */
  const renderSelectedLocation = () => {
    if (locLoading) {
      return (
        <View style={styles.selectedLocation}>
          <View>
            <ActivityIndicator size={'small'} color={primaryColor} />
          </View>
        </View>
      );
    } else {
      if (selectedLocation != null) {
        return (
          <View style={styles.selectedLocation}>
            <View>
              <View>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#1c1c1c',
                  }}>
                  {selectedLocation.description}
                </Text>
              </View>
              <View style={{marginTop: 15}}>
                <Button
                  onPress={() => sendLocationToReduxStore()}
                  size={'sm'}
                  borderRadius="full"
                  colorScheme="success"
                  leftIcon={<Ionicons name="location" color="#FFF" />}>
                  Choose here
                </Button>
              </View>
            </View>
          </View>
        );
      } else {
        return <View>{/* <Text>No Location Lelected</Text> */}</View>;
      }
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        ref={mapviewRef}
        region={{
          latitude: location != null ? location.latitude : 0.0,
          longitude: location != null ? location.longitude : 0.0,
          latitudeDelta: 0.055,
          longitudeDelta: 0.0521,
        }}>
        <Marker
          ref={markerRef}
          key={1}
          coordinate={{
            latitude:
              locatonDetails != null
                ? locatonDetails.geometry.location.lat
                : 0.0,
            longitude:
              locatonDetails != null
                ? locatonDetails.geometry.location.lng
                : 0.0,
          }}
          title={'Location'}
          description={
            route.params.location == 'pickup'
              ? 'Item Pick Up Point'
              : 'Item Drop Off Point'
          }
        />
      </MapView>

      <View style={styles.searchInputContainer}>
        <Pressable
          style={styles.backBtn}
          onPress={() => {
            sendLocationToReduxStore();
          }}>
          <Ionicons name="arrow-back" size={20} />
        </Pressable>

        <View style={{flex: 1}}>
          <GooglePlacesAutocomplete
            fetchDetails={true}
            placeholder="Search Location"
            onPress={(data, details = null) => {
              setSelectedLocation(data);
              setLocationDetails(details);
              animateToCoordinate(
                details != null ? details?.geometry.location.lat : 0.0,
                details != null ? details?.geometry.location.lng : 0.0,
              );

              if (markerRef && markerRef.current) {
                markerRef.current.redraw();
                markerRef.current.showCallout();
              }
            }}
            styles={{
              textInput: {
                height: 38,
                fontSize: 16,
                borderRadius: 100,
              },
              textInputContainer: {
                elevation: 10,
                borderRadius: 100,
                shadowColor: '#000',
                shadowRadius: 10,
              },
            }}
            query={{
              key: 'AIzaSyCoFi1zMlP4hcDj8-j5bOGtfFYWz98JqVk',
              language: 'en',
              components: 'country:gh',
            }}
          />
        </View>

        {/* <VStack space={5} alignSelf="center" style={{flex: 1}}>
          <Input
            placeholder="Search Location"
            variant="rounded"
            width="100%"
            py="1"
            px="2"
            autoFocus={true}
            backgroundColor={'#FFF'}
            InputLeftElement={
              <Icon
                ml="2"
                size="4"
                color="gray.400"
                as={<Ionicons name="ios-search" />}
              />
            }
          />
        </VStack> */}
      </View>

      {renderSelectedLocation()}
    </View>
  );
};

export default SelectLocationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get('window').height,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  searchInputContainer: {
    position: 'absolute',
    top: 20,
    padding: 15,
    // margin: 15,
    // flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  backBtn: {
    marginRight: 10,
    backgroundColor: '#FFF',
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    elevation: 10,
  },
  selectedLocation: {
    backgroundColor: '#FFF',
    height: 150,
    width: Dimensions.get('window').width - 50,
    position: 'absolute',
    bottom: 25,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    elevation: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
});
