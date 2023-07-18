import {
  StyleSheet,
  View,
  Pressable,
  Alert,
  ScrollView,
  Platform,
  PermissionsAndroid,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect, cloneElement} from 'react';
import {selectContactPhone, selectContact} from 'react-native-select-contact';
import {
  Text,
  FormControl,
  VStack,
  Input,
  Button,
  Box,
  Select,
  CheckIcon,
  TextArea,
  Actionsheet,
  useDisclose,
  Icon,
} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import firestore from '@react-native-firebase/firestore';

import {
  DropOffData,
  IDropOff,
  InputError,
  IPackageTypes,
  Location,
} from '../../types/types';
import {btnColor, primaryColor, secondaryColor} from '../../helpers/constants';
import {AppStackNavigationParamsList} from '../../Navigations/types';
import {AppDispatch, RootState} from '../../store';
import {calculateDistance} from '../../helpers/helpers';
import LoadingModal from '../../components/LoadingModal/LoadingModal';
import {
  addNewDropOff,
  removeDropOffItem,
  setDeliveryDistance,
  setDeliveryEstTime,
  setDeliveryFare,
  setDeliveryNote,
  setPackageTypes,
  setPickupMsisdn,
  setSelectedPackageType,
  updateDropOffMsisdn,
} from '../../store/actions/delivery';
import DeliveryDataService from '../../services/DeliveryDataService';

type DeliveryDetailsScreenProps = StackNavigationProp<
  AppStackNavigationParamsList,
  'DeliveryDetails'
>;

const dropoffFormat: DropOffData = {
  loc_name: 'Choose Location',
  lat: 0.0,
  lng: 0.0,
  msisdn: '',
};

const DeliveryDetailsScreen = () => {
  const dispatch: AppDispatch = useDispatch();
  const {isOpen, onOpen, onClose} = useDisclose();

  const [error, setError] = useState<InputError>({code: '', message: ''});
  const navigation = useNavigation<DeliveryDetailsScreenProps>();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string>('');
  const [message, setDeliveryMessage] = useState<string>('');
  const [fare, setFare] = useState<number>(0.0);
  const [est_distance, setEstDistance] = useState<number>(0.0);
  const [est_time, setEstTime] = useState<string>('');

  const package_type = useSelector(
    (state: RootState) => state.delivery.package_type,
  );
  const package_types = useSelector(
    (state: RootState) => state.delivery.package_types,
  );

  const pickuplocation = useSelector(
    (state: RootState) => state.delivery.pickup_location,
  );
  const pickup_msisdn = useSelector(
    (state: RootState) => state.delivery.pickup_msisdn,
  );
  const amount_per_km = useSelector(
    (state: RootState) => state.delivery.amount_per_km,
  );
  const dropoffs = useSelector((state: RootState) => state.delivery.dropoffs);

  useEffect(() => {
    getPackageTypes();
  }, []);

  async function getPhoneNumber(notype: number, index: number) {
    // on android we need to explicitly request for contacts permission and make sure it's granted
    // before calling API methods
    if (Platform.OS === 'android') {
      const request = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      );

      // denied permission
      if (request === PermissionsAndroid.RESULTS.DENIED)
        throw Error('Permission Denied');
      // user chose 'deny, don't ask again'
      else if (request === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN)
        throw Error('Permission Denied');
    }

    // Here we are sure permission is granted for android or that platform is not android
    selectContact().then(data => {
      console.log(data?.phones);
      if (data != null) {
        if (notype == 1) {
          // setPickUpNo(
          //   data?.phones[0] != undefined ? data?.phones[0].number : '',
          // );
          dispatch(
            updateDropOffMsisdn({
              index: 1,
              msisdn: data.phones[0] != undefined ? data.phones[0].number : '',
            }),
          );
        } else if ((notype = 2)) {
          // setDropOffNo(
          //   data.phones[0] != undefined ? data.phones[0].number : '',
          // );
          dispatch(
            updateDropOffMsisdn({
              index: 1,
              msisdn: data.phones[0] != undefined ? data.phones[0].number : '',
            }),
          );
        } else {
          Alert.alert('Error', 'Unable to get contacts');
        }
      } else {
        Alert.alert('Error', 'Unable to get contacts');
      }
    });

    // if (!selection) {
    //   return null;
    // }

    // // let contact = selection;

    // console.log(selection);
    // console.log(
    //   `Selected ${selectedPhone.type} phone number ${selectedPhone.number} from ${contact.name}`,
    // );
    return null; //selectedPhone.number;
  }

  /**
   *
   * @returns
   */
  const getPackageTypes = async () => {
    if (package_types == null || package_types.length <= 0) {
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
    }
  };

  /**
   *
   * @returns
   */
  const renderPickUpLocationData = () => {
    if (pickuplocation != null) {
      return <Text>{pickuplocation.description}</Text>;
    } else {
      return <Text>Choose pick up location</Text>;
    }
  };

  /**
   *
   * @returns
   *
   */
  const renderDropOffLocationData = (loc_name: string) => {
    if (loc_name != '' || loc_name != '') {
      return <Text>{loc_name}</Text>;
    } else {
      return <Text>Choose drop off location</Text>;
    }
  };

  /**
   *
   * @returns
   */
  const calculateFare = () => {
    if (pickuplocation == null) {
      Alert.alert('Error', 'Please select a pick up location');
      return;
    } else if (
      dropoffs[0].loc_name == null ||
      dropoffs[0].loc_name.length <= 0
    ) {
      Alert.alert('Error', 'Please select a drop off location');
      return;
    } else if (pickup_msisdn == null || pickup_msisdn =="") {
      Alert.alert('Error', 'Please enter a pick up phone no.');
      return;
    } else if (package_type == null || package_type == '') {
      Alert.alert('Error', 'Please select package type');
      return;
    } 
    
    else {
      if(dropoffs[0] != null ){
        if(dropoffs[0].msisdn == null || dropoffs[0].msisdn==""){
            Alert.alert('Error', 'Please enter dropoff phone no');
            return;
        }
      }
      setLoadingText('Calculating fare...');
      setLoading(true);
      // let totalEstDistance: number = 0.0;
      // let totalEstFare: number = 0.0;

      // let pickupLat = pickuplocation.details.geometry.location.lat;
      // let pickupLng = pickuplocation.details.geometry.location.lng;

      // for (var i = 0; i < dropoffs.length; i++) {
      //   let distance = calculateDistance(
      //     pickupLat,
      //     pickupLng,
      //     dropoffs[i].lat,
      //     dropoffs[i].lng,
      //   );

      //   totalEstDistance += distance;
      //   totalEstFare += amount_per_km * distance;

      //   pickupLat = dropoffs[i].lat;
      //   pickupLng = dropoffs[i].lng;
      // }

      // console.log(pickuplocation.description);
      // console.log(dropoffs);

      var thedropoffs : any = [];

      for(var i=0; i<dropoffs.length; i++){
          var tempDropoff = {
            name: dropoffs[i].loc_name,
            lat: dropoffs[i].lat,
            lng: dropoffs[i].lng,
          }
          thedropoffs.push(tempDropoff);
      }

      DeliveryDataService.calculateFare(pickuplocation.description, thedropoffs)
      .then(res => {
        if (res.data.status == 'success') {
          console.log(res.data);
          setEstDistance(res.data.distance);

          dispatch(setDeliveryFare(res.data.amount));

          dispatch(setDeliveryDistance(res.data.distance));

          setFare(parseFloat(res.data.amount.toFixed(2)));

          setLoading(false);

          setLoadingText('');

          onOpen();
        } else {
          setLoading(false);

          setLoadingText('');
          Alert.alert('Error', res.data.message);

        }
      })
      .catch(error => {
        Alert.alert('Error', error.message);
        setLoading(false);

        setLoadingText('');
      });

      


      
    }
  };

  /***
   *
   *
   */
  const renderPackageTypes = () => {
    return package_types.map((ptype: IPackageTypes) => {
      return (
        <Select.Item key={ptype.id} label={ptype.name} value={ptype.name} />
      );
    });
  };

  const orderActionSheet = () => {
    return (
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Actionsheet.Item>
            <Text style={{fontWeight:'bold'}}>Delivery Charge :-     GHC {fare}</Text>
          </Actionsheet.Item>
          <Actionsheet.Item>
            <Text style={{fontWeight:'bold'}}>Est. Distance :- {est_distance} KM</Text>
          </Actionsheet.Item>
          {/* <Actionsheet.Item>
            <Text>Est. Arrival Time(min): {est_time}</Text>
          </Actionsheet.Item> */}

          <View style={{marginBottom: 30, marginTop: 30}}>
            <Button
              leftIcon={
                <Ionicons name="ios-paper-plane" color="#FFF" size={16} />
              }
              // colorScheme={'primary'}
              backgroundColor={btnColor}
              borderRadius="full"
              // variant="rounded"
              // width={'80%'}
              style={{paddingLeft: 60, paddingRight: 60}}
              _text={{color: 'white', fontWeight: 600, textAlign: 'center'}}
              onPress={() => {
                //redux things
                dispatch(setDeliveryFare(fare));
                dispatch(setDeliveryDistance(est_distance));
                dispatch(setDeliveryEstTime(est_time));
                dispatch(setDeliveryNote(message));
                onClose();
                navigation.navigate('DeliverySummary');
              }}>
              Continue
            </Button>
          </View>
        </Actionsheet.Content>
      </Actionsheet>
    );
  };

  /**
   * RENDER DROPOFF DETAILS
   */

  const renderDropOffLocation = () => {
    return dropoffs.map((element, index) => {
      return (
        <View style={styles.cloneElement} key={index}>
          <View style={{flex: 1}}>
            <FormControl
              isRequired
              isInvalid={error.code === 'ERR_DROPOFF_PHONE'}
              style={{marginTop: 15}}>
              <FormControl.Label
                _text={{
                  color: 'muted.700',
                  fontSize: 'sm',
                  fontWeight: 600,
                }}>
                To
              </FormControl.Label>

              <View style={styles.chooseLocationContainer}>
                <Pressable
                  style={styles.chooseLocation}
                  onPress={() => {
                    navigation.navigate('SelectLocation', {
                      location: 'dropoff',
                      index: index,
                    });
                  }}>
                  <Ionicons name="location" size={20} color={secondaryColor} />
                  {renderDropOffLocationData(element.loc_name)}
                </Pressable>
              </View>

              <Input
                p={2}
                _focus={{borderColor: secondaryColor, backgroundColor: 'white'}}
                keyboardType="phone-pad"
                value={element.msisdn}
                onChangeText={value => {
                  dispatch(updateDropOffMsisdn({index: index, msisdn: value}));
                }}
                InputRightElement={
                  <Pressable
                    onPress={() => {
                      getPhoneNumber(2, index);
                    }}>
                    <Icon
                      as={<Ionicons name={'person'} />}
                      size={5}
                      mr="2"
                      color="muted.400"
                    />
                  </Pressable>
                }
                placeholder="Enter drop off phoneno"
              />

              <FormControl.ErrorMessage>
                {error.message}
              </FormControl.ErrorMessage>
            </FormControl>
          </View>
          {index != 0 ? (
            <View>
              <Pressable
                onPress={() => {
                  dispatch(removeDropOffItem(index));
                }}
                style={styles.trashIcon}>
                <Ionicons name="trash" size={20} color="#FFF" />
              </Pressable>
            </View>
          ) : (
            <View></View>
          )}
        </View>
      );
    });
  };

  /***
   *
   *
   */
  return (
    <>
      <LoadingModal text={loadingText} visible={loading} />
      <ScrollView style={styles.container}>
        {/* <View> */}
        <VStack space={2} mt={2}>
          <FormControl isRequired isInvalid={error.code === 'ERR_PICKUP_PHONE'}>
            <FormControl.Label
              _text={{
                color: 'muted.700',
                fontSize: 'sm',
                fontWeight: 600,
              }}>
              From
            </FormControl.Label>

            <View style={styles.chooseLocationContainer}>
              <Pressable
                style={styles.chooseLocation}
                onPress={() => {
                  navigation.navigate('SelectLocation', {
                    location: 'pickup',
                    index: 0,
                  });
                }}>
                <Ionicons name="location" size={20} color={secondaryColor} />
                {renderPickUpLocationData()}
              </Pressable>
            </View>

            <Input
              p={2}
              _focus={{borderColor: secondaryColor, backgroundColor: 'white'}}
              keyboardType="phone-pad"
              value={pickup_msisdn}
              onChangeText={value => {
                dispatch(setPickupMsisdn(value));
              }}
              InputRightElement={
                <Pressable
                  onPress={() => {
                    getPhoneNumber(1, 0);
                  }}>
                  <Icon
                    as={<Ionicons name={'person'} />}
                    size={5}
                    mr="2"
                    color="muted.400"
                  />
                </Pressable>
              }
              placeholder="Enter pickup number"
            />

            <FormControl.ErrorMessage>{error.message}</FormControl.ErrorMessage>
          </FormControl>

          <View>
            {renderDropOffLocation()}
            <View>
              <Pressable
                onPress={() => {
                  dispatch(addNewDropOff(1));
                }}
                style={{
                  padding: 5,
                  backgroundColor: secondaryColor,
                  flexDirection: 'row',
                  width: Dimensions.get('window').width / 2,
                  borderRadius: 100,
                  alignSelf: 'flex-end',
                  marginTop: 15,
                  alignItems:'center',
                  justifyContent:'center'
                }}>
                <Ionicons name="add" size={20} color="#FFF" />
                <Text style={{color: '#FFF'}}>Add New DropOff</Text>
              </Pressable>
            </View>
          </View>

          <FormControl
            isRequired
            isInvalid={error.code === 'ERR_PACKAGE_TYPE'}
            style={{marginTop: 30}}>
            <FormControl.Label
              _text={{
                color: 'muted.700',
                fontSize: 'sm',
                fontWeight: 600,
              }}>
              Package Type
            </FormControl.Label>

            <Box>
              <Select
                selectedValue={package_type}
                minWidth="200"
                accessibilityLabel="Choose Package Type"
                placeholder="Choose Package Type"
                _selectedItem={{
                  bg: 'teal.600',
                  endIcon: <CheckIcon size="5" />,
                }}
                mt={1}
                onValueChange={itemValue => {
                  dispatch(setSelectedPackageType(itemValue.toString()));
                }}>
                {renderPackageTypes()}
              </Select>
            </Box>

            <FormControl.ErrorMessage>{error.message}</FormControl.ErrorMessage>
          </FormControl>

          <FormControl style={{marginTop: 30}}>
            <FormControl.Label
              _text={{
                color: 'muted.700',
                fontSize: 'sm',
                fontWeight: 600,
              }}>
              Leave a Note
            </FormControl.Label>
            <TextArea
              type="text"
              autoCompleteType={false}
              h={32}
              p={2}
              _focus={{
                borderColor: secondaryColor,
                backgroundColor: 'white',
              }}
              onChangeText={value => setDeliveryMessage(value)}
              placeholder="Leave a message"
              w="100%"
            />
            <FormControl.ErrorMessage>{error.message}</FormControl.ErrorMessage>
          </FormControl>
        </VStack>
        {/* </View> */}
        <View style={{height: 200}}></View>
      </ScrollView>
      <View style={styles.btnfareContainer}>
        <Button
          onPress={() => calculateFare()}
          leftIcon={<Ionicons name="ios-color-wand" color="#FFF" size={16} />}
          // colorScheme={'success'}
          backgroundColor={btnColor}
          fontWeight={600}
          borderRadius="full"
          // variant="rounded"
          width={'80%'}
          _text={{color: 'white', fontWeight: 600}}
          // onPress={() => loginUser()}
        >
          Calculate Fare
        </Button>
      </View>

      {orderActionSheet()}
    </>
  );
};

export default DeliveryDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 10,
  },
  chooseLocationContainer: {
    marginTop: 10,
    marginBottom: 10,
  },

  chooseLocation: {
    height: 50,
    borderWidth: 1,
    borderColor: '#b8b8b8',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
  },
  btnfareContainer: {
    bottom: 0,
    height: 80,
    backgroundColor: '#FFF',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
  },
  cloneElement: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trashIcon: {
    backgroundColor: 'brown',
    padding: 5,
    borderRadius: 2,
    margin: 10,
  },
});
