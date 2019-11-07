import React from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Platform,
  AsyncStorage,
  Alert,
  AlertIOS
} from "react-native"
import CustomButton from '../../components/Button'
import { MaterialCommunityIcons, EvilIcons } from '@expo/vector-icons';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { CheckBox } from 'react-native-elements'

import Loader from '../../navigation/AuthLoadingScreen'

const api = require('../../api/index');

export default class Login extends React.Component {

  static navigationOptions = {
    header: null
  };

  state = {
    email: '',
    password: '',
    token: '121212121212',
    pushtoken: '',
    hidePassword: true,
    emailError: '',
    passError: '',
    bothError: '',
    isDirty: false,
    loading: false,


  };


  componentDidMount = async () => {
    await this.registerForPushNotificationsAsync();

  }

  registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        // alert('Failed to get push token for push notification!');
        this.setState({ passError: 'Something went wrong !' })
        return;
      }
      let pushtoken = await Notifications.getExpoPushTokenAsync();
      this.setState({ pushtoken: pushtoken })
      console.log(pushtoken, "this is push tocken");
    } else {
      this.setState({ pushtoken: '1234' })
      // alert('Must use physical device for Push Notifications');
    }
  };


  managePasswordVisibility = () => {
    this.setState({ hidePassword: !this.state.hidePassword });
  }


  onChange = (name, value) => {

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (this.state.email == '' || this.state.password == '') {
      this.setState({ bothError: 'All fields are Requried' })
    } else {
      this.setState({ bothError: '' })
    }
    if (name == 'email' && (!reg.test(value) || value == '')) {
      this.setState({ emailError: 'Please enter a valid email' })
    } else if (name == 'email' && (!reg.test(value) || value !== '')) {
      this.setState({ emailError: '' })
    } if (name === 'password' && (value.length < 7 || value === '')) {
      this.setState({ passError: 'Password must be at least 7 character long' })
    } else if (name === 'password' && (value.length < 7 || value !== '')) {
      this.setState({ passError: '' })
    }
    this.setState({ [name]: value, isDirty: true, passError: '' })

  }



  fetchAPI = async () => {
    this.setState({ loading: true })
    await api.login({
      email: this.state.email,
      password: this.state.password,
      devicetoken: this.state.token,
      pushtoken: this.state.pushtoken,
      apptype: Platform.OS === 'android' ? 'ANDROID' : 'IOS'
    },
      (e, r) => {
        if (e) {
          this.setState({ loading: false });
          // alert('Error: ' + e);
        } else {
          console.log("LOGIN", r);
          if (r.response_code == 2000) {
       
            this.setData(r);
            this.props.navigation.navigate('Home');
            this.setState({ loading: false })
            // Alert.alert('Success', r.response_message);
          } else {
            this.setState({ loading: false, passError: 'Wrong credentials please try again !' })
            // (Platform.OS === 'android' ? Alert : AlertIOS).alert(
            //   'Failed', r.response_message,
            //   [
            //     {
            //       text: 'OK', onPress: () => this.setState({ loading: false })
            //     }
            //   ]
            // );
          }
        }
      })
  }

  setData = async (r) => {
    try {
      await AsyncStorage.multiSet([
        ['userToken', JSON.stringify(r.response_data.authtoken)],
        ['userEmail', JSON.stringify(r.response_data.email)],
        ['userId', JSON.stringify(r.response_data._id)],
        ['userCartCount', JSON.stringify(r.response_data.cartItem)],
        ['remainReward', JSON.stringify(r.response_data.remainReward)],
        ['firstName', JSON.stringify(r.response_data.first_name)],
        ['lastName', JSON.stringify(r.response_data.last_name)],
      ], (err, res) => {
        if (err) {
          //return alert('Error' + err);

        } else {
          return;
        }
      })
    } catch (e) {
      (Platform.OS === 'android' ? Alert : AlertIOS).alert(
        'Error', e,
        [
          {
            text: 'OK', onPress: () => this.setState({ loading: false })
          }
        ]
      );
    }
  }

  render() {
    const { emailError, passError, isDirty, bothError } = this.state
    return (
      <View style={{ flex: 1 }}>
        {this.state.loading && <Loader show={this.state.loading} navigation={this.props.navigation} />}
        <ScrollView
          alwaysBounceVertical={true}
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 15 }}
        >
          <View style={{ alignItems: "center", marginBottom: 20, marginTop: 80 }}>
            <Image
              style={{ width: 100, height: 101 }}
              source={require("../../assets/img/login/logo.png")}
            />
            <Text style={{ fontFamily: "WS-Medium", textAlign: "center", letterSpacing: 3, color: "#334159", fontSize: 20, marginTop: 15 }}>LOGIN</Text>
          </View>

          <View style={{ marginHorizontal: '10%', marginBottom: 40 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderColor: '#d6d6d6', borderWidth: 1, borderRadius: 30, marginBottom: 10 }}>
              <View style={{ flex: 0.15, alignItems: 'flex-end' }}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={25}
                  color="#d6d6d6"
                />
              </View>
              <View style={{ flex: 0.85 }}>
                <TextInput
                  style={{ paddingVertical: 10, paddingHorizontal: 20, fontSize: 14, fontFamily: 'WS-Light' }}
                  value={this.state.email}
                  onChangeText={(email) => this.onChange('email', email)}
                  placeholder="Email Address"
                  autoCapitalize='none'
                  autoCorrect={false}
                  textContentType='emailAddress'
                  selectTextOnFocus={true}
                  spellCheck={false}
                  keyboardType={'email-address'}
                />
              </View>
            </View>

            <Text style={{ textAlign: 'center', color: 'red', fontFamily: 'WS-Regular', fontSize: 14, marginBottom: 8 }}>{this.state.emailError}</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderColor: '#d6d6d6', borderWidth: 1, borderRadius: 30, marginBottom: 12 }}>
              <View style={{ flex: 0.15, alignItems: 'flex-end' }}>
                <EvilIcons
                  name="lock"
                  size={34}
                  color="#d6d6d6"
                />
              </View>
              <View style={{ flex: 0.85 }}>
                <TextInput
                  style={{ paddingVertical: 10, paddingHorizontal: 20, fontSize: 14, fontFamily: 'WS-Light' }}
                  value={this.state.password}
                  placeholder="Password"
                  onChangeText={(password) => this.onChange('password', password)}
                  autoCapitalize='none'
                  autoCorrect={false}
                  textColor="#000000"
                  textContentType='password'
                  secureTextEntry={this.state.hidePassword}
                  returnKeyType='done'
                  enablesReturnKeyAutomatically={true}
                  selectTextOnFocus={true}
                  spellCheck={false}
                />
              </View>
            </View>

            <Text style={{ textAlign: 'center', color: 'red', fontFamily: 'WS-Regular', fontSize: 14, marginBottom: 10 }}>{this.state.passError}</Text>

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('ForgotPassword')}
            >
              <Text style={{ textAlign: 'center', color: '#334159', fontFamily: 'WS-Light', fontSize: 14 }}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>


          <View style={{ marginHorizontal: 25, marginBottom: 60 }}>
            <CustomButton
              disabled={emailError || passError || bothError || !isDirty ? true : false}
              text="LOGIN"
              onClick={this.fetchAPI}
            />
          </View>

          {/* <TouchableOpacity style={{ alignItems: 'center', marginBottom: 60 }}
            onPress={() => this.props.navigation.navigate('Home')}
            activeOpacity={0.7}
          >
            <Text style={{ color: '#25334a', fontFamily: 'WS-Light' }}>Skip log in and take me straight to the app</Text>
          </TouchableOpacity>
 */}

          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontFamily: 'WS-Light', color: '#25334a' }}>Don't have an Account?</Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Signup')}
            >
              <Text style={{ color: '#25334a', fontFamily: 'WS-SemiBold' }}> Create Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

    );
  }
}
