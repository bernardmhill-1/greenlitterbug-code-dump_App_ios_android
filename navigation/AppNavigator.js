import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import AuthNavigator from "./AuthNavigator";
import AuthLoadingScreen from "./AuthLoadingScreen";


export default createAppContainer(createSwitchNavigator({
  AuthLoading: AuthLoadingScreen,
  Main: MainTabNavigator,
  Auth: AuthNavigator,
},{
  initialRouteName: 'AuthLoading'
}));