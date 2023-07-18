import {StyleSheet, View, Image} from 'react-native';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Divider, Pressable, Text} from 'native-base';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {imageUrl, secondaryColor, textSecondary} from '../../helpers/constants';
import {PaymentMethod} from '../../types/types';
import {AppDispatch, RootState} from '../../store';
import {setSelectedPaymentMode} from '../../store/actions/delivery';
import {AppStackNavigationParamsList} from '../../Navigations/types';

type PymentMethodProps = {
  item: PaymentMethod;
};

type PaymentMethodItemScreenProps = StackNavigationProp<
  AppStackNavigationParamsList,
  'PaymentMethod'
>;

const PaymentMethodItem: React.FC<PymentMethodProps> = ({item}) => {
  const dispatch: AppDispatch = useDispatch();
  const navigation = useNavigation<PaymentMethodItemScreenProps>();
  const [selected, setSelected] = useState<boolean>(false);
  const selectedPaymentMode = useSelector(
    (state: RootState) => state.delivery.selcted_payment_mode,
  );

  const selectIndicator = () => {
    if (selectedPaymentMode != null) {
      return selectedPaymentMode.id == item.id ? secondaryColor : '#d1d1d1';
    } else {
      return '#d1d1d1';
    }
  };

  return (
    <>
      <Pressable
        onPress={() => {
          dispatch(setSelectedPaymentMode(item));
          if (item.type == 'cash') {
            navigation.navigate('DeliverySummary');
          }
        }}
        style={styles.itemContainer}>
        <View style={{flexDirection: 'row'}}>
          <View>
            <Image
              source={{uri: imageUrl + item.image}}
              style={styles.imgStyle}
            />
          </View>

          <View style={styles.descContainer}>
            <View>
              <Text style={styles.textHeader}>{item.name}</Text>
              <Text style={{color: textSecondary}}>{item.type}</Text>
            </View>
          </View>
        </View>
        <View style={{marginRight: 10}}>
          <Ionicons
            name="checkmark-circle"
            size={25}
            color={selectIndicator()}
          />
        </View>
      </Pressable>
      <Divider />
    </>
  );
};

export default PaymentMethodItem;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imgStyle: {
    height: 40,
    width: 40,
    borderRadius: 30,
  },
  textHeader: {
    fontSize: 16,
    fontWeight: '500',
  },
  descContainer: {
    marginLeft: 10,
  },
});
