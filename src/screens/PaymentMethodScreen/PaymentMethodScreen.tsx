import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
} from 'react-native';
import {FormControl, Input, Button, Box, ScrollView} from 'native-base';
import React, {useState, useEffect, useRef} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import  { Paystack , paystackProps}  from 'react-native-paystack-webview';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AppStackNavigationParamsList} from '../../Navigations/types';
import {AppDispatch, RootState} from '../../store';
import {IDeliveryData, PaymentMethod} from '../../types/types';
import PaymentMethodItem from '../../components/PaymentMethodItem/PaymentMethodItem';
import {
  imageUrl,
  inputFontSize,
  primaryColor,
  secondaryColor,
} from '../../helpers/constants';
import DeliveryDataService from '../../services/DeliveryDataService';
import {
  setMomoPaymentAccount,
  setPaymentMethods,
  setSelectedPaymentMode,
} from '../../store/actions/delivery';
import ErrorComponent from '../../components/ErrorComponent/ErrorComponent';
import SuccessComponent from '../../components/SuccessComponent/SuccessComponent';
import LoadingModal from '../../components/LoadingModal/LoadingModal';

type PaymentMethodScreenProps = StackNavigationProp<
  AppStackNavigationParamsList,
  'PaymentMethod'
>;

interface Error {
  code: string;
  message: string;
}
const PaymentMethodScreen = () => {
  const navigation = useNavigation<PaymentMethodScreenProps>();
  const payment_methods = useSelector(
    (state: RootState) => state.delivery.payment_methods,
  );

  const selectedPaymentMode = useSelector(
    (state: RootState) => state.delivery.selcted_payment_mode,
  );
  const momo_payment_account = useSelector(
    (state: RootState) => state.delivery.momo_account_no,
  );
  const user = useSelector((state: RootState) => state.user.user);


  const pickup_location = useSelector(
    (state: RootState) => state.delivery.pickup_location,
  );
  const dropoff_locations = useSelector(
    (state: RootState) => state.delivery.dropoffs,
  );
  const delivery_distance = useSelector(
    (state: RootState) => state.delivery.delivery_distance,
  );
  const delivery_est_time = useSelector(
    (state: RootState) => state.delivery.delivery_est_time,
  );
  const delivery_fare = useSelector(
    (state: RootState) => state.delivery.delivery_fare,
  );
  const delivery_note = useSelector(
    (state: RootState) => state.delivery.delivery_note,
  );
  const pickup_msisdn = useSelector(
    (state: RootState) => state.delivery.pickup_msisdn,
  );
  const package_type = useSelector(
    (state: RootState) => state.delivery.package_type,
  );
  const payment_method = useSelector(
    (state: RootState) => state.delivery.selcted_payment_mode,
  );
  const momo_account_no = useSelector(
    (state: RootState) => state.delivery.momo_account_no,
  );
  const deliverymode = useSelector(
    (state: RootState) => state.delivery.deliverymode,
  );
  const token = useSelector((state: RootState) => state.user.token);



  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>({code: '', message: ''});
  const [momo_no, setMomoNo] = useState<string>('');
  const [isError, setIsErrorState] = useState<boolean>(false);
  const [isSuccess, setIsSuccessState] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [payingvia, setPayingVia] = useState<'cash'|'paystack'>('cash');

  const paystackWebViewRef = useRef<paystackProps.PayStackRef>(); 




  useEffect(() => {
    setMomoNo(user ? user.phoneno : '');
    // if (payment_methods.length > 0) {
    //   setLoading(false);
    // } else {
      // getPaymentMethods();
    // }
  }, []);

  /**
   *
   *
   */
  // const getPaymentMethods = () => {
  //   DeliveryDataService.getPaymentMethods()
  //     .then(res => {
  //       if (res.data.status == 'success') {
  //         console.log(res.data.paymenttypes);
  //         dispatch(setPaymentMethods(res.data.paymenttypes));
  //         setLoading(false);
  //       } else {
  //         Alert.alert('Error', res.data.message);
  //         setLoading(false);
  //       }
  //     })
  //     .catch(error => {
  //       setLoading(false);
  //       Alert.alert('Error', error.message);
  //     });
  // };


  const submitDeliveryRequest = (paymentinfo:any) => {
    setLoading(true);
    let data: IDeliveryData = {
      pickup_lat: pickup_location.details.geometry.location.lat,
      pickup_lng: pickup_location.details.geometry.location.lng,
      dropoffs: dropoff_locations,
      pickup_loc_name: pickup_location.description,
      pickup_msisdn: pickup_msisdn,
      package_type_id: package_type,
      payment_type_id: '1',
      
      delivery_mode_id: deliverymode,
      momo_accno: momo_account_no,
      paymentinfo: paymentinfo,
      payingvia: payingvia
    };

    DeliveryDataService.requestDelivery(data, token)
      .then(res => {
        setLoading(false);
        if (res.data.status == 'success') {
          setIsErrorState(false);
          setIsSuccessState(true);
          setMessage(res.data.message);
          //   Alert.alert('Success', res.data.message);
        } else {
          console.log(res.data.message);
          setIsErrorState(true);
          setIsSuccessState(false);
          setMessage(res.data.message);
          //   Alert.alert('Error', res.data.message);
        }
      })
      .catch(error => {
        setLoading(false);
        setIsErrorState(true);
        setIsSuccessState(false);
        setMessage(error.message);
        // Alert.alert('Error HTTP', error.message);
      });
  };


  const renderItem = ({item}: {item: PaymentMethod}) => {
    return (
      <View>
        <PaymentMethodItem item={item} />
      </View>
    );
  };

  // const renderChangeButton = () => {
  //   if (selectedPaymentMode != null && selectedPaymentMode.type != 'cash') {
  //     return (
  //       <Button
  //         onPress={() => {
  //           dispatch(setSelectedPaymentMode(null));
  //         }}
  //         leftIcon={<Ionicons name="ios-card" color="#FFF" size={16} />}
  //         borderRadius="full"
  //         size={'sm'}
  //         style={{position: 'absolute', right: 10, top: 10}}>
  //         Change Payment Method
  //       </Button>
  //     );
  //   }
  // };

  // const renderPaymentAccountInput = () => {
  //   if (selectedPaymentMode != null) {
  //     if (selectedPaymentMode.type == 'momo') {
  //       return (
  //         <View style={styles.momoNoCon}>
  //           <View>
  //             <Image
  //               style={styles.selectedPaymentImage}
  //               source={{uri: selectedPaymentMode.image}}
  //             />
  //           </View>
  //           <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 30}}>
  //             Enter Payment Account Details
  //           </Text>
  //           <FormControl isRequired isInvalid={error.code === 'ERR_MOMO_NO'}>
  //             <FormControl.Label
  //               _text={{
  //                 color: 'muted.700',
  //                 fontSize: 'sm',
  //                 fontWeight: 600,
  //               }}>
  //               Phone No.
  //             </FormControl.Label>
  //             <Input
  //               p={2}
  //               // variant="rounded"
  //               value={momo_no == '' ? user.phoneno : momo_no}
  //               fontSize={inputFontSize}
  //               onChangeText={value => {
  //                 setMomoNo(value);
  //               }}
  //               placeholder="Enter Phone No"
  //               keyboardType="phone-pad"
  //               _focus={{
  //                 borderColor: secondaryColor,
  //                 backgroundColor: 'white',
  //               }}
  //             />
  //             <FormControl.ErrorMessage>
  //               {error.message}
  //             </FormControl.ErrorMessage>
  //           </FormControl>

  //           <View style={{marginTop: 20}}>
  //             <Button
  //               leftIcon={
  //                 <Ionicons name="ios-paper-plane" color="#FFF" size={16} />
  //               }
  //               colorScheme={'success'}
  //               borderRadius="full"
  //               // variant="rounded"
  //               // width={'80%'}
  //               style={{paddingLeft: 100, paddingRight: 100}}
  //               _text={{
  //                 color: 'white',
  //                 fontWeight: 600,
  //                 textAlign: 'center',
  //               }}
  //               onPress={() => {
  //                 if (momo_no == null || momo_no == '') {
  //                   setError({
  //                     code: 'ERR_MOMO_NO',
  //                     message: 'Please enter a momo no to pay with.',
  //                   });
  //                   return;
  //                 } else {
  //                   setError({
  //                     code: '',
  //                     message: '',
  //                   });
  //                   dispatch(setMomoPaymentAccount(momo_no));
  //                   navigation.navigate('DeliverySummary');
  //                 }
  //               }}>
  //               Next
  //             </Button>
  //           </View>
  //         </View>
  //       );
  //     } else {
  //       return (
  //         <SafeAreaView>
  //           <FlatList
  //             data={payment_methods}
  //             renderItem={renderItem}
  //             keyExtractor={item => item.id}
  //           />
  //         </SafeAreaView>
  //       );
  //     }
  //   }
  // };

  /**
   *
   * @returns
   */
  // const renderPaymentMethods = () => {
  //   if (loading) {
  //     return (
  //       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
  //         <ActivityIndicator size={'large'} color={primaryColor} />
  //         <Text>Loading... Please wait</Text>
  //       </View>
  //     );
  //   } else {
  //     if (payment_methods.length > 0) {
  //       return (
  //         <View style={{flex: 1}}>
  //           {renderChangeButton()}
  //           {selectedPaymentMode == null ? (
  //             <SafeAreaView>
  //               <FlatList
  //                 data={payment_methods}
  //                 renderItem={renderItem}
  //                 keyExtractor={item => item.id}
  //               />
  //             </SafeAreaView>
  //           ) : (
  //             renderPaymentAccountInput()
  //           )}
  //         </View>
  //       );
  //     } else {
  //       return (
  //         <View>
  //           <Text>No Data To Show</Text>
  //         </View>
  //       );
  //     }
  //   }
  // };


  const renderPaymentMethodNew = () => {
    return (
      <View   style={{  alignItems:'center', justifyContent:'center', marginTop: 10}}>
          <Button
                leftIcon={
                  <Ionicons name="ios-paper-plane" color="#FFF" size={16} />
                }
                colorScheme={'success'}
                borderRadius="full"
                // variant="rounded"
                width={'100%'}
                style={{paddingLeft: 20, paddingRight: 20}}
                _text={{
                  color: 'white',
                  fontWeight: 600,
                  textAlign: 'center',
                }}
                  onPress={()=> {
                    setPayingVia('paystack');
                    try{
                      paystackWebViewRef?.current?.startTransaction()
                    }catch(error:any){

                      console.log(error);
                    }
                    
                  }}
                  >
                Pay Online
          </Button>

          <Button
                leftIcon={
                  <Ionicons name="ios-paper-plane" color="#FFF" size={16} />
                }
                colorScheme={'info'}
                borderRadius="full"
                width={'70%'}
                style={{paddingLeft: 10, paddingRight: 10, marginTop: 30,}}
                _text={{
                  color: 'white',
                  fontWeight: 600,
                  textAlign: 'center',
                }}
                onPress={() => {
                  setPayingVia('cash');
                  submitDeliveryRequest(null);
                }}>
                Pay On Delivery
          </Button>
      </View>
    ) 
  }

  return (
    <>
    <LoadingModal visible={loading} text={'Request delivery service...'} />
      <SuccessComponent
        visible={isSuccess}
        message={message}
        closeModal={() => {
          setIsSuccessState(false);
          navigation.popToTop();
        }}
      />
      <ErrorComponent
        visible={isError}
        message={message}
        closeModal={() => {
          setIsErrorState(false);
        }}
      />

      <Paystack
        paystackKey="pk_live_d008b375b89e4616223bf004908a8efbb823e312"
        billingEmail={user.email}
        currency='GHS'
        amount={delivery_fare}
        channels={['mobile_money', 'card']}
        onCancel={(e) => {
          // handle response here
          Alert.alert('Payment Cancelled','You have cancelled online payment. You can still pay on delivery')
        }}
        onSuccess={(res) => {
          console.log(res);
          submitDeliveryRequest(res.data);
          // handle response here
        }}
        ref={paystackWebViewRef}
      />


      <View style={styles.container}>
        <View style={{justifyContent:'center', alignItems:'center', marginTop: 10, marginBottom: 10}}>
          <Text style={{fontWeight:'bold'}}>Delivery Fare</Text>
          <Text style={{fontWeight:'bold', fontSize: 25, color:'black'}}>GHC {delivery_fare}</Text>
        </View>
        <View>
        {renderPaymentMethodNew()}
        </View>
      </View>
  </>
  );
};

export default PaymentMethodScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: '#FFF',
  },
  momoNoCon: {
    // height: Dimensions.get('window').height / 3,
    backgroundColor: '#FFF',
    // elevation: 2,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  selectedPaymentImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
});
