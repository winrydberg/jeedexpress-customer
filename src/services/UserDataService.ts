import {CancelToken} from 'axios';
import http from '../helpers/axios';
import {
  ILoginResponse,
  IMyDeliveriesResponse,
  IRegisterResponse,
} from '../types/responses';
import {ILoginData, IRegisterData, IUserData} from '../types/types';

class UserDataService {
  registerUser(data: IRegisterData) {
    return http.post<IRegisterResponse>('/register', {
      email: data.email,
      firstname: data.firstname,
      lastname: data.lastname,
      password: data.password,
      phoneno: data.phoneno,
      registrationtoken: data.firebasetoken,
    });
  }

  loginUser(data: ILoginData) {
    return http.post<ILoginResponse>('/login', {
      email: data.email,
      password: data.password,
    });
  }

  getMyDeliveries(token: string) {
    return http.get<IMyDeliveriesResponse>('/my-deliveries', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // updateProfilePhoto(token: string, data: string) {
  //   return http.post<ProfileUpdateResponse>(
  //     '/update-photo',
  //     {
  //       photo: data,
  //     },
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     },
  //   );
  // }
}

export default new UserDataService();
