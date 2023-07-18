import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import {Divider, FormControl, Input, Button} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  inputFontSize,
  primaryColor,
  secondaryColor,
} from '../../helpers/constants';
import {IDelivery} from '../../types/types';

interface Error {
  code: string;
  message: string;
}
const inpHeight = Dimensions.get('window').height / 4;
const TrackDeliveryScreen = () => {
  const [trackcode, setTrackCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [delivery, setDelivery] = useState<IDelivery | null>(null);
  const [error, setError] = useState<Error>({code: '', message: ''});

  const inputTrackCode = () => {
    return (
      <View>
        <FormControl isRequired isInvalid={error.code === 'ERR_EMAIL'}>
          <FormControl.Label
            _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
            Track Code
          </FormControl.Label>
          <Input
            p={2}
            fontSize={inputFontSize}
            onChangeText={value => setTrackCode(value)}
            placeholder="Enter Tracker Code"
            keyboardType="number-pad"
            _focus={{
              borderColor: secondaryColor,
              backgroundColor: 'white',
            }}
          />
          <FormControl.ErrorMessage>{error.message}</FormControl.ErrorMessage>
        </FormControl>

        <View style={{marginTop: 20, marginBottom: 20}}>
          <Button
            leftIcon={
              <Ionicons name="ios-lock-closed-sharp" color="#FFF" size={16} />
            }
            colorScheme={'success'}
            fontWeight={600}
            _text={{color: 'white', fontWeight: 600}}
            onPress={() => {}}>
            Track Delivery
          </Button>
        </View>
      </View>
    );
  };

  const renderDeliveryDetails = () => {
    if (loading) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size={'large'} color={primaryColor} />
          <Text>Loading...</Text>
        </View>
      );
    } else {
      if (delivery != null) {
        return (
          <View>
            <Text>Delivery Details</Text>
            
          </View>
        );
      } else {
        return (
          <View style={{margin: 10}}>
            <Text style={{alignSelf: 'center'}}>
              Enter delivery track code to search
            </Text>
          </View>
        );
      }
    }
  };

  return (
    <View>
      <View style={styles.inputContainer}>{inputTrackCode()}</View>

      <Divider />
      <View style={styles.deliveryContainer}>{renderDeliveryDetails()}</View>
    </View>
  );
};

export default TrackDeliveryScreen;

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  inputContainer: {
    height: inpHeight,
    margin: 10,
  },
  deliveryContainer: {
    height: Dimensions.get('window').height - inpHeight,
    margin: 10,
  },
});
