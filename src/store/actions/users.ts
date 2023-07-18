import {IDelivery, IUserData, Location} from '../../types/types';
import {
  SET_MY_DELIVERIES,
  SET_TOKEN,
  SET_USER,
  SET_USR_LOCATION,
} from '../types';

export function setUser(user: IUserData | null | undefined) {
  return {
    type: SET_USER,
    payload: user,
  };
}

export function setToken(token: string | null | undefined) {
  return {
    type: SET_TOKEN,
    payload: token,
  };
}

export function setUserCurrentLocation(location: Location) {
  return {
    type: SET_USR_LOCATION,
    payload: location,
  };
}

export function setMyDeliveries(deliveries: IDelivery[]) {
  return {
    type: SET_MY_DELIVERIES,
    payload: deliveries,
  };
}
