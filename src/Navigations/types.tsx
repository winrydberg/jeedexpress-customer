import {NavigatorScreenParams} from '@react-navigation/native';

export type AuthParamsList = {
  Account: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Terms: undefined;
  Privacy: undefined;
};

export type DrawerParamsList = {
  Home: undefined;
  Auth: AuthParamsList;
  History: undefined;
  TrackDelivery: undefined;
  Privacy: undefined;
};

export type AppStackNavigationParamsList = {
  HomeDrawer: NavigatorScreenParams<DrawerParamsList>;
  DeliveryDetails: undefined;
  Auth: AuthParamsList;
  Terms: undefined;
  SelectLocation: {
    location: string;
    index: number;
  };
  VehicleRegistration: undefined;
  PaymentMethod: undefined;
  DeliverySummary: undefined;
};
