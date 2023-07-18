// import {IUserData, Location} from '../../types/types';
// import {SET_TOKEN, SET_USER, SET_USR_LOCATION} from '../types';

import GoogleLocation from '../../models/GoogleLocation/GoogleLocation';
import {DeliveryMode, IPackageTypes, PaymentMethod} from '../../types/types';
import {
  ADD_NEW_DROPOFF,
  REMOVE_DROPOFF_ITEM,
  SET_AMOUNT_PER_KM,
  SET_DELIVERY_DISTANCE,
  SET_DELIVERY_EST_TIME,
  SET_DELIVERY_FARE,
  SET_DELIVERY_MODE,
  SET_DELIVERY_NOTE,
  SET_DROPOFF_LAT,
  SET_DROPOFF_LNG,
  SET_DROPOFF_LOCATION,
  SET_DROPOFF_LOC_NAME,
  SET_DROPOFF_MSISDN,
  SET_MOMO_ACCOUNT_NO,
  SET_PACKAGE_TYPES,
  SET_PAYMENT_METHODS,
  SET_PICKUP_LOCATION,
  SET_PICKUP_MSISDN,
  SET_SELECTED_PACKAGE_TYPE,
  SET_SELECTED_PAYMENT_MODE,
  SET_TRANSPORT_MODES,
} from '../types';

export function setPickUpLocation(location: GoogleLocation) {
  return {
    type: SET_PICKUP_LOCATION,
    payload: location,
  };
}

export function setDropOffLocation(location: GoogleLocation) {
  return {
    type: SET_DROPOFF_LOCATION,
    payload: location,
  };
}

export function setDeliveryMode(mode: any) {
  return {
    type: SET_DELIVERY_MODE,
    payload: mode,
  };
}

export function setTransportModes(modes: DeliveryMode[] | []) {
  return {
    type: SET_TRANSPORT_MODES,
    payload: modes,
  };
}

export function setAmountPerKm(amount: number) {
  return {
    type: SET_AMOUNT_PER_KM,
    payload: amount,
  };
}

export function setPackageTypes(types: IPackageTypes[]) {
  return {
    type: SET_PACKAGE_TYPES,
    payload: types,
  };
}

export function setSelectedPackageType(type: string) {
  return {
    type: SET_SELECTED_PACKAGE_TYPE,
    payload: type,
  };
}

export function setPaymentMethods(methods: PaymentMethod[]) {
  return {
    type: SET_PAYMENT_METHODS,
    payload: methods,
  };
}

export function setSelectedPaymentMode(method: PaymentMethod | null) {
  return {
    type: SET_SELECTED_PAYMENT_MODE,
    payload: method,
  };
}

export function setDeliveryDistance(distance: number) {
  return {
    type: SET_DELIVERY_DISTANCE,
    payload: distance,
  };
}

export function setDeliveryFare(fare: number) {
  return {
    type: SET_DELIVERY_FARE,
    payload: fare,
  };
}

export function setDeliveryNote(note: string) {
  return {
    type: SET_DELIVERY_NOTE,
    payload: note,
  };
}

export function setDeliveryEstTime(time: string | number) {
  return {
    type: SET_DELIVERY_EST_TIME,
    payload: time,
  };
}

export function updateDropOffLocName(data: {index: number; loc_name: string}) {
  return {
    type: SET_DROPOFF_LOC_NAME,
    payload: data,
  };
}

export function updateDropOffLat(data: {index: number; lat: number}) {
  return {
    type: SET_DROPOFF_LAT,
    payload: data,
  };
}

export function updateDropOffLng(data: {index: number; lng: number}) {
  return {
    type: SET_DROPOFF_LNG,
    payload: data,
  };
}

export function updateDropOffMsisdn(data: {index: number; msisdn: string}) {
  return {
    type: SET_DROPOFF_MSISDN,
    payload: data,
  };
}

export function addNewDropOff(qty: 1) {
  return {
    type: ADD_NEW_DROPOFF,
    payload: qty,
  };
}

export function removeDropOffItem(index: number) {
  return {
    type: REMOVE_DROPOFF_ITEM,
    payload: index,
  };
}

export function setPickupMsisdn(msisdn: string) {
  return {
    type: SET_PICKUP_MSISDN,
    payload: msisdn,
  };
}

export function setMomoPaymentAccount(msisdn: string) {
  return {
    type: SET_MOMO_ACCOUNT_NO,
    payload: msisdn,
  };
}
