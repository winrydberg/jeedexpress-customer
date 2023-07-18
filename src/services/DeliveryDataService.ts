import {CancelToken} from 'axios';
import http from '../helpers/axios';
import {
  IDeliveryFareResponse,
  IDeliveryModesReponse,
  IDeliveryReponse,
  ILoginResponse,
  IPackageReponse,
  IPaymentMethodResponse,
  IRegisterResponse,
} from '../types/responses';
import {
  IDeliveryData,
  ILoginData,
  IPackageTypes,
  IRegisterData,
  IUserData,
} from '../types/types';

class DeliveryDataService {
  requestDelivery(data: IDeliveryData, token: string) {
    return http.post<IDeliveryReponse>(
      '/new-delivery',
      {
        pickup_loc_name: data.pickup_loc_name,
        pickup_lat: data.pickup_lat,
        pickup_lng: data.pickup_lng,
        dropoffs: data.dropoffs,
        pickup_msisdn: data.pickup_msisdn,
        package_type_id: data.package_type_id,
        payment_type_id: data.payment_type_id,
        delivery_mode_id: data.delivery_mode_id,
        paymentinfo: data.paymentinfo,
        payingvia: data.payingvia
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  getPackageTypes() {
    return http.get<IPackageReponse>('/package-types');
  }

  getPaymentMethods() {
    return http.get<IPaymentMethodResponse>('/payment-types');
  }

  getDeliveryModes() {
    return http.get<IDeliveryModesReponse>('/delivery-modes');
  }

  calculateFare(pickup_loc_name:string, dropoffs: any) {
    return http.post<IDeliveryFareResponse>('/calculate-fare',{
      pickup_name: pickup_loc_name,
      dropoffs: dropoffs
    });
  }
}

export default new DeliveryDataService();
