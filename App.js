import 'react-native-gesture-handler';

import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Button, Text, ScrollView } from 'react-native';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';

import authReducer from './store/reducer/auth';
import usersReducer from './store/reducer/users';
import chatReducer from './store/reducer/chat';

import LoginScreen from './screens/LoginScreen';
import MainNevigator from './nevigator/MainNevigator';

const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  chat: chatReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  return (
    <Provider store={store}>
      <MainNevigator />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});


