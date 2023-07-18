import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const BookLater = () => {
  return (
    <View style={styles.btn}>
      <Text>Book For Later</Text>
    </View>
  );
};

export default BookLater;

const styles = StyleSheet.create({
  btn: {
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 100,
  },
});
