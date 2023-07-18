import {StyleSheet, Text, View, Alert} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  VStack,
  FormControl,
  Button,
  Input,
  Select,
  Box,
  CheckIcon,
} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {secondaryColor} from '../../helpers/constants';

interface Error {
  code: string;
  message: string;
}

const VehicleRegistration = () => {
  const [error, setError] = useState<Error>({code: '', message: ''});
  const [regNo, setRegNo] = useState<string>('');
  const [vehicletype, setVehicleType] = useState<string>('');
  return (
    <View style={{margin: 10}}>
      <VStack space={2} mt={5}>
        <FormControl isRequired isInvalid={error.code === 'ERR_VEHICLE_TYPE'}>
          <FormControl.Label
            _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
            Vehicle Type
          </FormControl.Label>
          <Box>
            <Select
              selectedValue={vehicletype}
              accessibilityLabel="Choose Vehicle Type"
              placeholder="Choose Vehicle Type"
              //   fontSize={smFontSize}
              _selectedItem={{
                bg: 'teal.500',
                color: 'white',
                endIcon: <CheckIcon size="5" />,
              }}
              mt={1}
              onValueChange={itemValue => setVehicleType(itemValue)}>
              <Select.Item label="Motorcycle" value="0" />
              <Select.Item label="Car" value="1" />
            </Select>
          </Box>
          <FormControl.ErrorMessage>{error.message}</FormControl.ErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={error.code === 'ERR_USERNAME'}>
          <FormControl.Label
            _text={{color: 'muted.700', fontSize: 'sm', fontWeight: 600}}>
            Registration No.
          </FormControl.Label>
          <Input
            p={2}
            // variant="rounded"
            onChangeText={value => setRegNo(value)}
            placeholder="Registration No"
            keyboardType="phone-pad"
            _focus={{
              borderColor: secondaryColor,
              backgroundColor: 'white',
            }}
          />
          <FormControl.ErrorMessage>{error.message}</FormControl.ErrorMessage>
        </FormControl>

        <View style={{marginTop: 20}}>
          <Button
            leftIcon={<Ionicons name="ios-send" color="#FFF" size={16} />}
            colorScheme={'success'}
            fontWeight={600}
            _text={{color: 'white', fontWeight: 600}}
            onPress={() => {
              Alert.alert('Vehicle Registration', 'To be completed');
            }}>
            REGISTER VEHICLE
          </Button>
        </View>
      </VStack>
    </View>
  );
};

export default VehicleRegistration;

const styles = StyleSheet.create({});
