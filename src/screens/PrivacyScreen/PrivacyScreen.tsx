import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import { WebView } from 'react-native-webview';


const PrivacyScreen = () => {
  return (
     <WebView source={{ uri: 'https://starsxpress.com/privacy' }} style={{ flex: 1 }} />
  );
};

export default PrivacyScreen;

const styles = StyleSheet.create({});
