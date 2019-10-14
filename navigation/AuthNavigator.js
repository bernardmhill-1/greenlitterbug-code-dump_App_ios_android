import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import Login from '../screens/Auth/login';
import Signup from '../screens/Auth/signup';
import ForgotPassword from '../screens/Auth/forgotPassword';
import SetPassword from '../screens/Auth/setPassword';

export default createStackNavigator({
  Login,
  Signup,
  ForgotPassword,
  SetPassword
})