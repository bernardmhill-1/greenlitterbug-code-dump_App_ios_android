import React from 'react';
import { Platform, Dimensions } from 'react-native';
import {
  createStackNavigator,
  createBottomTabNavigator,
  createDrawerNavigator,
} from 'react-navigation';

import { TabBarIcon, MaterialCommunityIcon,ImageIcon } from '../components/TabBarIcon';
import Home from '../screens/Main/home/home';
import Scan from '../screens/Main/scan/qrCodescan';
import BarCodeScan from '../screens/Main/scan/barCodeScan';
import ProductUpload from '../screens/Main/scan/productUpload'
import Rewards from '../screens/Main/rewards';
import Footprint from '../screens/Main/footprint/footprint';
import DrawerScreen from '../screens/drawer';
import EditProfile from '../screens/Main/editProfile/editProfile';
import ChangePassword from '../screens/Main/editProfile/changePassword';
import Contact from '../screens/Main/home/contact';
import MyOrder from '../screens/Main/shop/myOrder'
import ProductListing from '../screens/Main/shop/shop';
import ProductDetails from '../screens/Main/shop/productDetails';
import myCartList from '../screens/Main/shop/myCartList';
import CheckOutStep1 from '../screens/Main/shop/checkOutStep1';
import CheckOutStep2 from '../screens/Main/shop/checkOutStep2';
import OrderConfirmation from '../screens/Main/shop/orderConfirmation';
import VendresListing from '../screens/Main/home/vendresListing';
import VendorsDetails from '../screens/Main/home/vendorDetails'
import CausesList from '../screens/Main/home/causesList';
import CausesDetails from '../screens/Main/home/causesDetails';



const Devicewidth = Dimensions.get('window').width;

const HomeStack = createStackNavigator(
  {
    Home,
    Contact,
    VendresListing,
    ProductDetails,
    VendorsDetails,
    CausesList,
    CausesDetails,
    EditProfile,
    ChangePassword,
    MyOrder,
    ProductListing,
    myCartList,
    CheckOutStep1,
    CheckOutStep2,
    OrderConfirmation
  },
  {
    headerLayoutPreset: 'center',
  }
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-home${focused ? '' : ''}` : 'md-home'}
    />
  ),
  tabBarOptions: {
    activeTintColor: '#ffffff',
    inactiveTintColor: '#6e7d91',
    labelStyle: {
      fontSize: 11,
      fontFamily: 'WS-Medium',
    },
    style: {
      backgroundColor: '#1d2b3a',
      height: Devicewidth < '360' ? 50 : 60,
    },
    tabStyle: {
      paddingVertical: 3,
    },
  },
};

const ScanStack = createStackNavigator(
  {
    Scan,
    BarCodeScan,
    ProductUpload,
    myCartList,
    CheckOutStep1,
    CheckOutStep2,
    OrderConfirmation
   
  },
  {
    headerLayoutPreset: 'center',
  }
);

ScanStack.navigationOptions = {
  tabBarLabel: 'Scan',
  tabBarIcon: ({ focused }) => <MaterialCommunityIcon focused={focused} name="qrcode-scan" />,
  tabBarOptions: {
    activeTintColor: '#ffffff',
    inactiveTintColor: '#6e7d91',
    labelStyle: {
      fontSize: 11,
      fontFamily: 'WS-Medium',
    },
    style: {
      backgroundColor: '#1d2b3a',
      height: Devicewidth < '360' ? 50 : 60,
    },
    tabStyle: {
      paddingVertical: 3,
    },
  },
};

const ShopStack = createStackNavigator(
  {
    ProductListing,
    MyOrder,
    ProductDetails,
    myCartList,
    CheckOutStep1,
    CheckOutStep2,
    OrderConfirmation,
  },
  {
    headerLayoutPreset: 'center',
  }
);

ShopStack.navigationOptions = {
  tabBarLabel: 'Shop',
  tabBarIcon: ({ focused }) => (
    <ImageIcon focused={focused} image= {require('../assets/img/tab/tab_baricon/shop.png')} height={22} />
  ),
  tabBarOptions: {
    activeTintColor: '#ffffff',
    inactiveTintColor: '#6e7d91',
    labelStyle: {
      fontSize: 11,
      fontFamily: 'WS-Medium',
    },
    style: {
      backgroundColor: '#1d2b3a',
      height: Devicewidth < '360' ? 50 : 60,
    },
    tabStyle: {
      paddingVertical: 3,
    },
  },
};

const RewardsStack = createStackNavigator(
  {
    Rewards,
    myCartList,
    CheckOutStep1,
    CheckOutStep2,
    OrderConfirmation
  },
  {
    headerLayoutPreset: 'center',
  }
);

RewardsStack.navigationOptions = {
  tabBarLabel: 'Rewards',
  tabBarIcon: ({ focused }) => (
    <ImageIcon focused={focused} image= {require('../assets/img/tab/tab_baricon/rewards.png')} height={31}/>
  ),

  tabBarOptions: {
    activeTintColor: '#ffffff',
    inactiveTintColor: '#6e7d91',
    indicatorStyle: { backgroundColor: 'transparent' },
    labelStyle: {
      fontSize: 11,
      fontFamily: 'WS-Medium',
    },
    style: {
      backgroundColor: '#1d2b3a',
      height: Devicewidth < '360' ? 50 : 60,
    },

    tabStyle: {
      paddingVertical: 3,
    },
  },
};

const FootStack = createStackNavigator(
  {
    Footprint,
    myCartList,
    CheckOutStep1,
    CheckOutStep2,
    OrderConfirmation
  },
  {
    headerLayoutPreset: 'center',
  }
);

FootStack.navigationOptions = {
  tabBarLabel: 'Footprint',
  tabBarIcon: ({ focused }) => (
    <ImageIcon focused={focused} image= {require('../assets/img/tab/tab_baricon/footprint.png')} height={35}/>
  ),
  tabBarOptions: {
    activeTintColor: '#ffffff',
    inactiveTintColor: '#6e7d91',
    labelStyle: {
      fontSize: 11,
      fontFamily: 'WS-Medium',
    },
    style: {
      backgroundColor: '#1d2b3a',
      height: Devicewidth < '360' ? 50 : 60,
    },
    tabStyle: {
      paddingVertical: 3,
    },
  },
};

const ProfileStack = createStackNavigator(
  {
    EditProfile,
    ChangePassword,
  },
  {
    headerLayoutPreset: 'center',
  }
);

const TabNavigator = createBottomTabNavigator({
  HomeStack,
  ScanStack,
  ShopStack,
  RewardsStack,
  FootStack,
});

export default createDrawerNavigator(
  {
    Home: {
      screen: TabNavigator,
    },
    ProfileStack,
    Contact,
  },
  {
    initialRouteName: 'Home',
    contentComponent: DrawerScreen,
    drawerWidth: Devicewidth - Devicewidth / 4,
  }
);
