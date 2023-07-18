import GoogleLocation from '../../models/GoogleLocation/GoogleLocation';
import {
  DeliveryMode,
  DropOffData,
  IDropOff,
  IPackageTypes,
  IUserData,
  Location,
  PaymentMethod,
} from '../../types/types';
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

const dropoffFormat: DropOffData = {
  loc_name: '',
  lat: 0.0,
  lng: 0.0,
  msisdn: '',
};

type Action = {
  type: string;
  payload: any;
};

type State = {
  pickup_location: GoogleLocation | null;
  pickup_msisdn: string | null;
  // dropoff_location: GoogleLocation | null;
  deliverymode: any;
  amount_per_km: number;
  package_types: IPackageTypes[];
  package_type: any;
  payment_methods: PaymentMethod[];
  selcted_payment_mode: PaymentMethod | null;
  delivery_distance: number;
  delivery_fare: number;
  delivery_note: string;
  delivery_est_time: number | string;
  dropoffs: DropOffData[];
  momo_account_no: string;
  delivery_modes: DeliveryMode[];
};

const initialState: State = {
  pickup_location: null,
  pickup_msisdn: null,
  // dropoff_location: null,
  deliverymode: '1',
  amount_per_km: 5,
  package_types: [],
  package_type: null,
  payment_methods: [],
  selcted_payment_mode: null,
  delivery_distance: 0.0,
  delivery_fare: 0.0,
  delivery_note: '',
  delivery_est_time: '',
  dropoffs: [dropoffFormat],
  momo_account_no: '',
  delivery_modes: [],

};
const deliveryReducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case SET_PICKUP_LOCATION:
      return {
        ...state,
        pickup_location: action.payload,
      };
    case SET_PICKUP_MSISDN:
      return {
        ...state,
        pickup_msisdn: action.payload,
      };

    // case SET_DROPOFF_LOCATION:
    //   return {
    //     ...state,
    //     dropoff_location: action.payload,
    //   };
    case SET_TRANSPORT_MODES:
      return {
        ...state,
        delivery_modes: action.payload,
      };

    case SET_DELIVERY_MODE:
      return {
        ...state,
        deliverymode: action.payload,
      };

    case SET_AMOUNT_PER_KM:
      return {
        ...state,
        amount_per_km: action.payload,
      };

    case SET_PACKAGE_TYPES:
      return {
        ...state,
        package_types: action.payload,
      };

    case SET_SELECTED_PACKAGE_TYPE:
      return {
        ...state,
        package_type: action.payload,
      };
    case SET_PAYMENT_METHODS:
      return {
        ...state,
        payment_methods: action.payload,
      };

    case SET_SELECTED_PAYMENT_MODE:
      return {
        ...state,
        selcted_payment_mode: action.payload,
      };
    case SET_DELIVERY_DISTANCE:
      return {
        ...state,
        delivery_distance: action.payload,
      };
    case SET_DELIVERY_FARE:
      return {
        ...state,
        delivery_fare: action.payload,
      };
    case SET_DELIVERY_NOTE:
      return {
        ...state,
        delivery_note: action.payload,
      };
    case SET_DELIVERY_EST_TIME:
      return {
        ...state,
        delivery_est_time: action.payload,
      };
    case SET_DELIVERY_EST_TIME:
      return {
        ...state,
        delivery_est_time: action.payload,
      };
    case ADD_NEW_DROPOFF:
      return {
        ...state,
        dropoffs: [...state.dropoffs, dropoffFormat],
      };

    case REMOVE_DROPOFF_ITEM:
      return {
        ...state,
        dropoffs: state.dropoffs.filter((_, i) => i != action.payload),
      };
    case SET_DROPOFF_LOC_NAME:
      return {
        ...state,
        dropoffs: state.dropoffs.map((item, index) => {
          if (index === action.payload.index) {
            return {...item, loc_name: action.payload.loc_name};
          }
          return item;
        }),
      };
    case SET_DROPOFF_LAT:
      return {
        ...state,
        dropoffs: state.dropoffs.map((item, index) => {
          if (index === action.payload.index) {
            return {...item, lat: action.payload.lat};
          }
          return item;
        }),
      };

    case SET_DROPOFF_LNG:
      return {
        ...state,
        dropoffs: state.dropoffs.map((item, index) => {
          if (index === action.payload.index) {
            return {...item, lng: action.payload.lng};
          }
          return item;
        }),
      };
    case SET_DROPOFF_MSISDN:
      return {
        ...state,
        dropoffs: state.dropoffs.map((item, index) => {
          if (index === action.payload.index) {
            return {...item, msisdn: action.payload.msisdn};
          }
          return item;
        }),
      };
    case SET_MOMO_ACCOUNT_NO:
      return {
        ...state,
        momo_account_no: action.payload,
      };
    
    default:
      return state;
  }
};

export default deliveryReducer;
