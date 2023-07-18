import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  FlatList,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Button} from 'native-base';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Divider} from 'native-base';
import DeliveryItem from '../../components/DeliveryItem/DeliveryItem';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store';
import {IDelivery} from '../../types/types';
import UserDataService from '../../services/UserDataService';
import {IMyDeliveriesResponse} from '../../types/responses';
import ErrorComponent from '../../components/ErrorComponent/ErrorComponent';
import {primaryColor} from '../../helpers/constants';
import {setMyDeliveries} from '../../store/actions/users';

const topViewHight = Dimensions.get('window').height / 4;
const DeliveryHistory = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [errorstate, setErrorState] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const deliveries = useSelector(
    (state: RootState) => state.user.my_deliveries,
  );
  const token = useSelector((state: RootState) => state.user.token);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    getMyPreviousDeliveries();
  }, []);

  const getMyPreviousDeliveries = () => {
    UserDataService.getMyDeliveries(token)
      .then(res => {
        setLoading(false)
        if (res.data.status == 'success') {
          dispatch(
            setMyDeliveries(res.data.deliveries ? res.data.deliveries : []),
          );
        } else {
        }
      })
      .catch(error => {
        Alert.alert('Error', 'Unable to get delivery history');
        setLoading(false)
      });
  };

  const renderItem = ({item}: {item: IDelivery}) => {
    return (
      <>
        <DeliveryItem item={item} />
        <Divider />
      </>
    );
  };

  const renderList = () => {
    if (loading) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size={'large'} color={primaryColor} />
          <Text>Loading...</Text>
        </View>
      );
    } else {
      if (deliveries.length > 0) {
        return (
          // <SafeAreaView style={styles.deliveryList}>
            <FlatList
              data={deliveries}
              renderItem={renderItem}
              keyExtractor={item => item.id?.toString()}
              contentContainerStyle={{
                flexGrow: 1,
                padding: 10,
                margin: 5,
              }}
            />
          //  </SafeAreaView>
        );
      }else{
        return (
          <View style={{flex:1, alignItems:'center', justifyContent:'center', marginTop: 20}}>
            <Button
              leftIcon={
                <Ionicons name="ios-search" color="#FFF" size={14} />
              }
              style={{paddingLeft: 30, paddingRight: 30}}
              size="sm"
              onPress={() => {
                setLoading(true);
                getMyPreviousDeliveries();
              }}>
              Reload History 
          </Button>
          </View>

        )
      }
    }
  };
  return (
    <View style={styles.container}>
      <ErrorComponent
        visible={errorstate}
        message={message}
        closeModal={() => {
          setErrorState(false);
        }}
      />
      <View style={styles.packageView}>
        <View style={styles.imgStyling}>
          <Image
            style={styles.packageStyle}
            source={require('../../assets/img/package.png')}
          />
        </View>
      </View>

      <View style={styles.myOrders}>
        <Text style={styles.myOrderText}>My Orders</Text>
      </View>

      {renderList()}
    </View>
  );
};

export default DeliveryHistory;

const styles = StyleSheet.create({
  packageView: {
    height: topViewHight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgStyling: {
    height: 130,
    width: 130,
    padding: 20,
    borderRadius: 100,
    backgroundColor: '#e8c48e8e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  packageStyle: {
    height: 80,
    width: 80,
  },
  deliveryList: {
    height: Dimensions.get('window').height - topViewHight,
  },
  myOrders: {
    height: 40,
    backgroundColor: '#e2791b',
    borderTopWidth: 5,
    borderTopColor: '#f4d3a1f2',
    borderBottomWidth: 5,
    borderBottomColor: '#f4d3a1f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  myOrderText: {
    color: 'white',
    fontWeight: 'bold',
  },
  container: {
    backgroundColor: 'white',
    flex: 1,

  },
});
