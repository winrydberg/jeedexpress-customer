import {StyleSheet, View, Dimensions, ScrollView, Alert} from 'react-native';
import React, {useState} from 'react';
import {Text, Button} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import {RootState} from '../../store';
import {Divider} from 'native-base';

import {btnColor, secondaryColor} from '../../helpers/constants';
import DeliveryDataService from '../../services/DeliveryDataService';
import {IDeliveryData} from '../../types/types';
import LoadingModal from '../../components/LoadingModal/LoadingModal';
import SuccessComponent from '../../components/SuccessComponent/SuccessComponent';
import ErrorComponent from '../../components/ErrorComponent/ErrorComponent';
import {
  AppStackNavigationParamsList,
  DrawerParamsList,
} from '../../Navigations/types';
import {StackNavigationProp} from '@react-navigation/stack';

type DeliverySummaryScreenProps = StackNavigationProp<
  AppStackNavigationParamsList,
  'DeliverySummary'
>;

const DeliverySummary = () => {
  const navigation = useNavigation<DeliverySummaryScreenProps>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isError, setIsErrorState] = useState<boolean>(false);
  const [isSuccess, setIsSuccessState] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
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

  const proceedToPay = () => {
    navigation.navigate('PaymentMethod');
  };

  const renderPickUp = () => {
    return (
      <View style={styles.pickUpItemContainer}>
        <View style={[styles.locIcon, {backgroundColor: 'green'}]}>
          <Ionicons name="location" size={30} color="#FFF" />
        </View>

        <View style={styles.locDescription}>
          <Text style={styles.locText}>{pickup_location?.description}</Text>
          <Text style={styles.loccatonDescText}>Pickup Location</Text>
        </View>
      </View>
    );
  };

  const renderDropoff = () => {
    return dropoff_locations.map((loc, index) => {
      return (
        <View style={[styles.pickUpItemContainer, {marginTop: 30}]} key={index}>
          <View style={[styles.locIcon, {backgroundColor: secondaryColor}]}>
            <Ionicons name="location" size={30} color="#FFF" />
          </View>

          <View style={styles.locDescription}>
            <Text style={styles.locText}>{loc.loc_name}</Text>
            <Text style={styles.loccatonDescText}>Drop Off Location</Text>
          </View>
        </View>
      );
    });
  };
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
      <ScrollView style={styles.container}>
        <View
          // contentContainerStyle={{
          //   height: Dimensions.get('window').height / 2,
          // }}
          style={{}}>
          <View style={{height: 30}}></View>
          <View>{renderPickUp()}</View>
          <View style={styles.dottedLink}></View>
          <ScrollView>{renderDropoff()}</ScrollView>
        </View>
        <View style={styles.delveryDetails}>
          <Divider />

          <View>
            <View style={styles.delItemStyle}>
              <Text style={styles.detailLabel}>Est. Delivery Fare(GHC):</Text>
              <Text>{delivery_fare}</Text>
            </View>

            <View style={styles.delItemStyle}>
              <Text style={styles.detailLabel}>
                Est. Delivery Distance(KM):
              </Text>
              <Text>{delivery_distance}</Text>
            </View>

            {/* <View style={styles.delItemStyle}>
              <Text style={styles.detailLabel}>Est. Delivery Time(MIN):</Text>
              <Text>{delivery_est_time}</Text>
            </View> */}

            <View style={styles.delItemStyle}>
              <Text style={styles.detailLabel}>Note:</Text>
              <Text>{delivery_note}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={{backgroundColor: '#FFF'}}>
        <View style={{marginTop: 20, margin: 10}}>
          <Button
            leftIcon={
              <Ionicons name="ios-paper-plane" color="#FFF" size={16} />
            }
            backgroundColor={btnColor}
            borderRadius="full"
            size={'md'}
            style={{paddingLeft: 100, paddingRight: 100}}
            _text={{
              color: 'white',
              fontWeight: 600,
              textAlign: 'center',
            }}
            onPress={() => {
              proceedToPay();
            }}>
            PROCEED TO PAY
          </Button>
        </View>
      </View>
    </>
  );
};

export default DeliverySummary;

const styles = StyleSheet.create({
  pickUpItemContainer: {
    alignItems: 'center',
    height: 100,
    justifyContent: 'center',
    // borderColor: 'gray',
    // borderWidth: 0.5,
    backgroundColor: '#FFF',
    elevation: 2,
    // width: Dimensions.get('window').width,
    margin: 10,
    borderRadius: 5,
  },

  locIcon: {
    height: 50,
    width: 50,
    borderRadius: 100,
    borderColor: '#FFF',
    borderWidth: 0.5,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -25,
  },

  locDescription: {
    marginTop: 10,
    padding: 10,
  },
  locText: {
    textAlign: 'center',
    fontSize: 16,
  },
  dottedLink: {
    height: Dimensions.get('window').width / 10,
    alignSelf: 'center',
    borderColor: 'blue',
    borderWidth: 0.5,
    borderStyle: 'dotted',
  },
  container: {
    backgroundColor: '#FFF',
    flex: 1,
  },
  loccatonDescText: {
    fontSize: 10,
    textAlign: 'center',
  },
  delveryDetails: {
    height: Dimensions.get('window').height / 2,
    marginTop: 15,
    paddingLeft: 10,
  },
  delItemStyle: {
    paddingTop: 15,
    paddingBottom: 15,
    flexDirection: 'row',
  },
  detailLabel: {
    fontSize: 16,
    marginRight: 10,
    fontWeight: 'bold',
  },
});
