import React from 'react'
import {
  View,
  Text,
  StatusBar,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Dimensions,
  Button,
  Alert,
  AlertIOS,
  Platform,

} from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import CustomButton from '../../components/Button'
import Loader from '../../navigation/AuthLoadingScreen'

const api = require('../../api/index');

const DeviceHeight = Dimensions.get('window').height;
export default class ForgotPassword extends React.Component {
  static navigationOptions = {
    header: null
  };

  state = {
    email: '',
    otp: '',
    modalVisible: false,
    emailError: '',
    otpError: '',
    isDirty: false,
    loading: false
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  onChange = (name, value) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (name === 'email' && (!reg.test(value) || value === '')) {
      this.setState({ emailError: 'Please enter a valid email' })

    } else if (name === 'otp' && (value.length < 4 || value === '')) {
      this.setState({ otpError: 'Please enter a valid otp' })
    }
    else {
      this.setState({ emailError: '', otpError: '' })
    }
    this.setState({ [name]: value, isDirty: true })

  }


  fetchAPI = async () => {
    this.setState({ loading: true });
    await api.forgotPassword(
      this.state.email,
      (e, r) => {
        if (e) {
          (Platform.OS === 'android' ? Alert : AlertIOS).alert(
            'Error', e,
            [
              {
                text: 'OK', onPress: () => this.setState({ loading: false })
              }
            ]
          );
        } else {
          if (r.response_code == 2000) {
            (Platform.OS === 'android' ? Alert : AlertIOS).alert(
              'Success', JSON.stringify(r.response_message),
              [
                {
                  text: 'OK', onPress: () => this.setState({ loading: false }, this.setModalVisible(!this.state.modalVisible))
                }
              ]
            );
          } else {
            (Platform.OS === 'android' ? Alert : AlertIOS).alert(
              'Request failed', JSON.stringify(r.response_message),
              [
                {
                  text: 'OK', onPress: () => this.setState({ loading: false })
                }
              ]
            );
          }
        }
      })
  }

  verifyOTP = async () => {
    this.setState({ loading: true });
    await api.verifyOTP({
      email: this.state.email,
      otp: this.state.otp
    },
      (e, r) => {
        if (e) {
          (Platform.OS === 'android' ? Alert : AlertIOS).alert(
            'Error', e,
            [
              {
                text: 'OK', onPress: () => this.setState({ loading: false })
              }
            ]
          );
        } else {
          if (r.response_code == 2000) {
            this.setState({ loading: false });
            this.props.navigation.navigate('SetPassword', { userEmail: this.state.email });
            this.setModalVisible(!this.state.modalVisible);
          } else {
            (Platform.OS === 'android' ? Alert : AlertIOS).alert(
              'Request failed', JSON.stringify(r.response_message),
              [
                {
                  text: 'OK', onPress: () => this.setState({ loading: false })
                }
              ]
            );
          }
        }
      })
  }

  render() {
    const { emailError, isDirty, otpError } = this.state
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 50 }}>
        {this.state.loading && <Loader show={this.state.loading} navigation={this.props.navigation} />}
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <Image
            style={{ width: 113, height: 73 }}
            source={require('../../assets/img/forget_password/forgot_password.png')}
          />
          <Text style={{ letterSpacing: 3, color: '#334159', fontFamily: 'WS-Medium', fontSize: 18, marginTop: 15 }}>FORGET PASSWORD</Text>
        </View>

        <View style={{ borderColor: '#d6d6d6', borderWidth: 1, borderRadius: 30, marginBottom: 5, width: '100%' }}>
          <TextInput
            style={{ paddingVertical: 10, fontSize: 14, paddingHorizontal: 30, width: '100%' }}
            value={this.state.email}
            onChangeText={(email) => this.onChange('email', email)}
            placeholder="Enter Your Registered Email Address"
            autoCapitalize='none'
            autoCorrect={false}
            textContentType='emailAddress'
            selectTextOnFocus={true}
            spellCheck={false}
            keyboardType={'email-address'}
          />
        </View>
        <Text style={{ textAlign: 'center', color: 'red', fontFamily: 'WS-Regular', fontSize: 14, marginBottom: 45 }}>{this.state.emailError}</Text>
        <Modal
          animationType='fade'
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} >
            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#ffffff', marginTop: DeviceHeight * 0.25, marginBottom: DeviceHeight * 0.25, marginHorizontal: '10%', borderRadius: 5, padding: '3%' }}>
              <View style={{ alignItems: 'flex-end' }}>
                <TouchableOpacity
                  onPress={() => { this.setModalVisible(!this.state.modalVisible); }}
                  activeOpacity={0.5}
                >
                  <MaterialIcons
                    name='close'
                    size={30}
                    color='#c0c0c0'
                  />
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#ffffff' }}>
                <Text style={{ fontSize: 22, color: '#000', textAlign: 'center' }}>Enter OTP</Text>
                <Text style={{ fontSize: 12, color: '#000', textAlign: 'center', marginBottom: '6%', marginTop: '4%' }}>Which have been sent to your mail</Text>

                <KeyboardAvoidingView
                  behavior='padding'
                >
                  <View style={{ marginBottom: 5, alignItems: 'center', justifyContent: 'center' }}>
                    <TextInput
                      style={{ paddingVertical: 5, textAlign: 'center', borderColor: '#d6d6d6', borderWidth: 1, borderRadius: 30, width: '80%' }}
                      placeholder='OTP'
                      value={this.state.otp}
                      onChangeText={(otp) => this.onChange('otp', otp)}
                      textColor='#000'
                      fontSize={17}
                      textContentType='telephoneNumber'
                      returnKeyType='done'
                      selectTextOnFocus={true}
                      spellCheck={false}
                      keyboardType='number-pad'
                      maxLength={6}

                    />
                    <Text style={{ textAlign: 'center', color: 'red', fontFamily: 'WS-Regular', fontSize: 14, marginBottom: 5 }}>{this.state.otpError}</Text>
                  </View>

                  <View style={{ marginTop: '3%' }}>
                    {/* <Button
                        onPress={this.verifyOTP}
                        title='Submit'
                        color='#3e9126'
                      // disabled={otp == '' ? true : false}
                      /> */}
                    <CustomButton
                      disabled={otpError || !isDirty ? true : false}
                      onClick={this.verifyOTP}
                      text="SUBMIT"
                    />
                  </View>
                </KeyboardAvoidingView>
              </View>
            </View>
          </View>
        </Modal>

        <CustomButton
          disabled={emailError || !isDirty ? true : false}
          onClick={this.fetchAPI}
          text="SUBMIT"
        />
      </View>
    );
  }
}