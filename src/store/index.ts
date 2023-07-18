import {createStore, combineReducers} from 'redux';
import {configureStore} from '@reduxjs/toolkit';

import userReducer from './reducers/userReducer';
import deliveryReducer from './reducers/deliveryReducer';

const rootReducer = combineReducers({
  user: userReducer,
  delivery: deliveryReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      // immutableCheck: false,
      serializableCheck: false,
    }),
  // middleware: getDefaultMiddleware =>
  //   getDefaultMiddleware({
  //     immutableCheck: {
  //       // Ignore state paths, e.g. state for 'items':
  //       ignoredPaths: ['delivery'],
  //     },
  //     serializableCheck: {ignoredPaths: ['some.nested.path']},
  //   }),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export default store;
