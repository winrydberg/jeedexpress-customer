import {IDelivery, IUserData, Location} from '../../types/types';
import {
  SET_MY_DELIVERIES,
  SET_SELECTED_PACKAGE_TYPE,
  SET_SELECTED_PAYMENT_MODE,
  SET_TOKEN,
  SET_USER,
  SET_USR_LOCATION,
} from '../types';

type Action = {
  type: string;
  payload: any;
};

type State = {
  user: IUserData | undefined | null;
  token: string | undefined | null;
  current_location: Location | null;
  my_deliveries: IDelivery[];
};

const initialState: State = {
  user: null,
  token: null,
  current_location: {longitude: -0.236193, latitude: 5.706244 },
  my_deliveries: [],
};
const userReducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload,
      };

    case SET_TOKEN:
      return {
        ...state,
        token: action.payload,
      };
    case SET_USR_LOCATION:
      return {
        ...state,
        current_location: action.payload,
      };

    case SET_MY_DELIVERIES:
      return {
        ...state,
        my_deliveries: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
