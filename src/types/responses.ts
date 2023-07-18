import {
  DeliveryMode,
  IDelivery,
  IPackageTypes,
  IUserData,
  PaymentMethod,
} from './types';

interface IResponse {
  status: string;
  message: string;
}

export interface IRegisterResponse extends IResponse {
  user?: IUserData;
  token?: string;
}

export interface ILoginResponse extends IResponse {
  user?: IUserData;
  token: string;
}

export interface IDeliveryReponse extends IResponse {
  next: number;
  delivery: IDelivery;
}

export interface IPackageReponse extends IResponse {
  types: Array<IPackageTypes>;
}

export interface IDeliveryModesReponse extends IResponse {
  modes: Array<DeliveryMode>;
}

export interface IPaymentMethodResponse extends IResponse {
  paymenttypes: Array<PaymentMethod>;
}

export interface IMyDeliveriesResponse extends IResponse {
  deliveries?: Array<IDelivery>;
}
export interface IDeliveryFareResponse extends IResponse {
  amount?: any;
  distance?: any;
}
