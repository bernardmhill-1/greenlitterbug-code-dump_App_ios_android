import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  AsyncStorage,
  Alert,
  AlertIOS,
  Platform,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { EvilIcons } from "@expo/vector-icons";
import { CustomButton } from '../../../components/Button'
import Loader from '../../../navigation/AuthLoadingScreen'

const api = require('../../../api/index');

export default class ChangePassword extends Component {
  static navigationOptions = ({
    title: 'Change Password',

    headerStyle: {
      backgroundColor: '#1d2b3a',
      height: 60,
    },
    headerTintColor: '#ffffff',
    headerTitleStyle: {
      fontFamily: 'WS-Light',
      fontSize: 18
    },
  });

  state = {
    currentPassword: '',
    newPassword: '',
    cnfPassword: '',
    hidePassword: true,
    userId: '',
    userToken: '',
    currError: '',
    newError: '',
    cnfError: '',
    loading:false
  }

  onChange = (name, value) => {
    if (name === 'currentPassword' && (value.length < 7 || value === '')) {
      this.setState({ currError: 'At least 7 characters' })
    } else if (name === 'newPassword' && (value.length < 7 || value === '')) {
      this.setState({ newError: 'At least 7 characters' })
    } else if (name === 'cnfPassword' && (this.state.newPassword != value)) {
      this.setState({ cnfError: 'Password Mismatches' })
    }

    else {
      this.setState({ currError: '', newError: '', cnfError: '' })
    }
    this.setState({ [name]: value, isDirty: true })

  }

  componentDidMount = async () => {
    await AsyncStorage.multiGet(['userToken', 'userId'], (err, res) => {
      if (err) {
      	Alert.alert(
          'Error', err,
          [
            {
              text: 'OK', onPress: () => this.setState({ loading: false})
            }
          ]
        );
      } else {
        this.setState({
          userToken: JSON.parse(res[0][1]),
          userId: JSON.parse(res[1][1]),
        });
      }
    })

  }

  fetchAPI = async () => {
     this.setState({ loading: true })
     await api.changePassword({
      userToken: this.state.userToken,
      userId: this.state.userId,
      currentpassword: this.state.currentPassword,
      newPassword: this.state.newPassword,

    },
      (e, r) => {
        if(e) {
          Alert.alert(
            'Error', e,
            [
              {
                text: 'OK', onPress: () => this.setState({ loading: false})
              }
            ]
          );
        } else {
          if (r.response_code == 2000) {
            this.setState({ loading: false });
            // Alert.alert('Success', r.response_message);
            this.props.navigation.navigate('Login');
          } else {
            Alert.alert(
              'Something went wrong ', JSON.stringify(r.response_message),
              [
                {
                  text: 'OK', onPress: () => this.setState({ loading: false})
                }
              ]
            );
          }
        }
      })
  }


  render() {
    const { currError, newError, cnfError, isDirty } = this.state
    return (
      <SafeAreaView style={{flex:1}}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginHorizontal: 50 }}>
        { Platform.OS == "android" &&
            <StatusBar translucent={true} backgroundColor={'transparent'} />}
        {this.state.loading && <Loader show={this.state.loading} navigation={this.props.navigation} />}
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <Image
            style={{ width: 113, height: 73 }}
            source={require('../../../assets/img/forget_password/forgot_password.png')}
          />
          <Text style={{ letterSpacing: 3, color: '#334159', fontFamily: 'WS-Medium', fontSize: 18, marginTop: 15 }}>CHANGE PASSWORD</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderColor: '#d6d6d6', borderWidth: 1, borderRadius: 30, marginBottom: 10 }}>
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
              value={this.state.currentPassword}
              placeholder="Current Password"
              onChangeText={(currentPassword) => this.onChange('currentPassword', currentPassword)}
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

        <Text style={{ textAlign: 'center', color: 'red', fontFamily: 'WS-Regular', fontSize: 14, marginBottom: 5 }}>{this.state.currError}</Text>

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
              value={this.state.newPassword}
              placeholder="New Password"
              onChangeText={(newPassword) => this.onChange('newPassword', newPassword)}
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

        <Text style={{ textAlign: 'center', color: 'red', fontFamily: 'WS-Regular', fontSize: 14, marginBottom: 5 }}>{this.state.newError}</Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderColor: '#d6d6d6', borderWidth: 1, borderRadius: 30, marginBottom: 30 }}>
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
              value={this.state.cnfPassword}
              placeholder="Confirm Password"
              onChangeText={(cnfPassword) => this.onChange('cnfPassword', cnfPassword)}
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

        <Text style={{ textAlign: 'center', color: 'red', fontFamily: 'WS-Regular', fontSize: 14, marginTop: -15, marginBottom: 5 }}>{this.state.cnfError}</Text>

        <CustomButton
          onClick={this.fetchAPI}
          disabled={currError || newError || cnfError || !isDirty ? true : false}
          text="SUBMIT"

        />
      </View>
      </SafeAreaView>
    )
  }
}