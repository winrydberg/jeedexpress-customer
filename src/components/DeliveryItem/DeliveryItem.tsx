import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {IDelivery} from '../../types/types';
import {ItemClick} from 'native-base/lib/typescript/components/composites/Typeahead/useTypeahead/types';

interface DeliveryItemProps {
  item: IDelivery;
}

const DeliveryItem = (props: DeliveryItemProps) => {
  const renderDropOffs = () => {
    if (props.item.dropoffs && props.item.dropoffs.length > 0) {
      return props.item.dropoffs.map(dpf => {
        return (
          <>
            <View
              key={dpf.id}
              style={{
                height: 25,
                width: 1,
                borderRadius: 1,
                borderWidth: 0.5,
                borderColor: 'red',
                borderStyle: 'dashed',
                marginLeft: 6,
                marginTop: 5,
                marginBottom: 5,
              }}></View>
            <View style={styles.dropoffLocation}>
              <Image
                style={styles.pinEnd}
                source={require('../../assets/img/pinstart.png')}
              />
              <View style={styles.locDesc}>
                <Text
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={{width: Dimensions.get('window').width / 2.5}}>
                  {dpf.dropoff_loc_name}
                </Text>
                <View style={styles.price}>
                  <Text style={{fontSize: 10}}>
                    {new Date(props.item.created_at).toDateString()}
                  </Text>
                </View>
              </View>
            </View>
          </>
        );
      });
    }
  };


  const renderDeliveryStateIcon = () => {
    if(props.item.completed ==true){
      return <MaterialCommunityIcons name="check-circle" size={30} color="green" />
    }else{
      if(props.item.is_cancelled ==true){
        return <MaterialCommunityIcons name="close-circle" size={30} color="red" />
      }else{
        return <MaterialCommunityIcons name="pause-circle" size={30} color="orange" />
      }
    }
  }


  return (
    <View style={styles.container}>
      <View style={styles.packageIcon}>
        {renderDeliveryStateIcon()}
      </View>
      <View>
        <View style={styles.pickUpLocation}>
          <Image
            style={styles.pinStart}
            source={require('../../assets/img/pinstart.png')}
          />
          {/* <View
            style={{
              height: 10,
              width: 10,
              backgroundColor: 'red',
              borderRadius: 10,
              margin: 11,
            }}></View> */}
          <View style={styles.locDesc}>
            <Text
              ellipsizeMode="tail"
              numberOfLines={1}
              style={{width: Dimensions.get('window').width / 2.2}}>
              {props.item.pickup_loc_name}
            </Text>
            <View style={styles.price}>
              <Text style={{fontWeight: 'bold', color: 'black'}}>GHC </Text>
              <Text style={{fontWeight: 'bold', color: 'black'}}>
                {props.item.delivery_fare}
              </Text>
            </View>
          </View>
        </View>
        {renderDropOffs()}
      </View>
    </View>
  );
};

export default DeliveryItem;

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('screen').width,
    flexDirection: 'row',
    // alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  packageIcon: {
    // paddingLeft: 15,
    paddingRight: 10,
    alignItems: 'center',
  },
  pickUpLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropoffLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinStart: {
    height: 20,
    width: 15,
  },
  pinEnd: {
    height: 20,
    width: 15,
  },
  locDesc: {
    width: Dimensions.get('window').width - 80,
    marginRight: 5,
    marginLeft: 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  price: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
});
