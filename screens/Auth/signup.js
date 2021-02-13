import React from 'react'
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  Dimensions,
  KeyboardAvoidingView,
  Button,
  AsyncStorage,
  Alert,
  AlertIOS,
  Platform,

} from "react-native";
import { SimpleLineIcons, MaterialCommunityIcons, MaterialIcons, EvilIcons } from '@expo/vector-icons';
import CustomButton from '../../components/Button'
import Loader from '../../navigation/AuthLoadingScreen'
import { CheckBox } from 'react-native-elements'

const api = require('../../api/index');
const DeviceHeight = Dimensions.get('window').height;

export default class Signup extends React.Component {
  static navigationOptions = {
    header: null
  };

  state = {
    fName: '',
    lName: '',
    email: '',
    pNumber: '',
    newpassword: '',
    cnfPassword: '',
    deviceToken: '121212121212',
    hidePassword: true,
    checked: false,
    modalVisibleOtp: false,
    modalVisiblePrivacy: false,
    modalVisibleTermsCondition: false,
    verificationCode: '',
    isDirty: false,
    emailError: '',
    firstError: '',
    lastError: '',
    addError: '',
    passError:'',
    lengthError:'',
    checkError: '',
    loading: false,
    privacyText: '',
    termCondtionText: '',
  };

  setModalVisiblePrivacy(visible) {
    this.setState({ modalVisiblePrivacy: visible });
    this.fetchPrivacy()
  }

  setModalVisibleOtp(visible) {
    this.setState({ modalVisibleOtp: visible });
  }

  setModalVisibleTermsCondition(visible) {
    this.setState({ modalVisibleTermsCondition: visible });
    this.fetchTermCondition()
  }

  fetchPrivacy = async () => {
    const regex = /(<([^>]+)>)/ig;
    await api.Privacy({}, (error, res) => {
      if (!error) {
        console.log("PRIVacy", res);
        this.setState({ privacyText: res.replace(regex, '') })
      } else {
        console.log('ERR', error);
      }
    })
  }

  fetchTermCondition = async () => {
    const regex = /(<([^>]+)>)/ig;
    await api.termsCondition({}, (error, res) => {
      if (!error) {
        console.log("Term Condition", res);
        this.setState({ termCondtionText: res.replace(regex, '') })
      } else {
        console.log('ERR', error);
      }
    })
  }


  onChange = (name, value) => {

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let reg1 =/^[A-Za-z0-9 ]+$/;

    if (this.state.fName == '' || this.state.lName == '' || this.state.email == '' || this.state.password == '' || this.state.cnfPassword == '' || this.state.pNumber == '') {
      this.setState({ emailError: 'All fields are Requried' })
    } else {
      this.setState({ emailError: '' })
    }
    if (name === 'fName' && value === '') {
      this.setState({ firstError: 'First Name are Requried' })
    } else if (name === 'fName' && value !== '') {
      this.setState({ firstError: '' })
    }
    if (name === 'lName' && value === '') {
      this.setState({ lastError: 'Last Name are Requried' })
    } else if (name === 'lName' && value !== '') {
      this.setState({ lastError: '' })
    }
    if (name == 'email' && (!reg.test(value) || value == '')) {
      this.setState({ addError: 'Please enter a valid email' })
    } else if (name == 'email' && (!reg.test(value) || value !== '')) {
      this.setState({ addError: '' })
    }
    if (name === 'pNumber' && (value.length < 10 || value === '')) {
      this.setState({ phonError: 'Phone No Should be  10 Digits long' })
    } else {
      this.setState({ phonError: '' })
    }
    if (name === 'newPassword' && (value.length < 7 || value === '')) {
      this.setState({ lengthError: 'Password must be at least 7 character long' })
    } else if (name === 'newPassword' && (value.length < 7 || value !== '')) {
      this.setState({ lengthError: '' })
    }
    if (name === 'cnfPassword' && (this.state.newPassword != value)) {
      this.setState({ passError: 'Password Should be Same' })
    } else {
      this.setState({ passError: '' })
    }
    if (name == 'cnfPassword' && (this.state.newPassword != value)) {
      this.setState({ passError: 'Password should be same' })
    } else {
      this.setState({ passError: '' })
    }

    this.setState({ [name]: value, isDirty: true })

  }


  fetchAPI = async () => {
    if(!this.state.checked) {
      this.setState({checkError: 'You have to agree our Terms & Conditions!'})
    } else {
    this.setState({ loading: true, checkError: '' })
    await api.register({
      firstName: this.state.fName,
      lastName: this.state.lName,
      email: this.state.email,
      password: this.state.cnfPassword,
      phoneNo: this.state.pNumber,
      devicetoken: this.state.deviceToken,
      apptype: Platform.OS === 'android' ? 'ANDROID' : 'IOS'
    },
      (e, r) => {
        if (e) {
         Alert.alert(
            'Error', e,
            [
              {
                text: 'OK', onPress: () => this.setState({ loading: false })
              }
            ]
          );
        } else {
          if (r.response_code === 2000) {
            Alert.alert(
              'Success', JSON.stringify(r.response_message),
              [
                {
                  text: 'OK', onPress: () => this.setState({ loading: false }, this.setModalVisibleOtp(!this.state.modalVisibleOtp))
                }
              ]
            );
          } else {
            Alert.alert(
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
  }




  verifyEmail = async () => {
    await api.emailVerification({
      email: this.state.email,
      verificationCode: this.state.verificationCode
    },
      (e, r) => {
        if (e) {
          Alert.alert(
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
            this.setModalVisibleOtp(!this.state.modalVisibleOtp);
            this.props.navigation.navigate('Login');

          } else {
            Alert.alert(
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
    const { emailError, isDirty, lengthError,passError, firstError, lastError, phonError, addError,checkError } = this.state
    return (
      <View style={{ flex: 1 }}>
        {this.state.loading && <Loader show={this.state.loading} navigation={this.props.navigation} />}
        <ScrollView
          alwaysBounceVertical={true}
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 15 }}
        >

          <View style={{ alignItems: 'center', marginBottom: 18, marginTop: 50 }}>
            <Image
              style={{ width: 113, height: 78 }}
              source={require('../../assets/img/registration/signup.png')}
            />
            <Text style={{ letterSpacing: 3, color: '#334159', fontFamily: 'WS-Medium', fontSize: 18, marginTop: 15, textAlign: 'center' }}>SIGN UP</Text>
          </View>

          <View style={{ marginHorizontal: '10%', marginBottom: 30 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 30, borderColor: '#d6d6d6', borderWidth: 1, marginBottom: 10 }}>
              <View style={{ flex: 0.15, alignItems: 'flex-end' }}>
                <SimpleLineIcons
                  name="user"
                  size={20}
                  color="#d6d6d6"
                />
              </View>
              <View style={{ flex: 0.85 }}>
                <TextInput
                  style={{ paddingVertical: 10, paddingHorizontal: 20, fontSize: 14, fontFamily: 'WS-Light' }}
                  onChangeText={(fName) => this.onChange('fName', fName)}
                  value={this.state.fName}
                  placeholder="First Name"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType='givenName'
                  selectTextOnFocus={true}
                  spellCheck={false}
                  keyboardType={'default'}
                />
              </View>
            </View>
            <Text style={{ textAlign: 'center', color: 'red', fontFamily: 'WS-Regular', fontSize: 14 }}>{this.state.firstError}</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 30, borderColor: '#d6d6d6', borderWidth: 1, marginBottom: 10 }}>
              <View style={{ flex: 0.15, alignItems: 'flex-end' }}>
                <SimpleLineIcons
                  name="user"
                  size={20}
                  color="#d6d6d6"
                />
              </View>
              <View style={{ flex: 0.85 }}>
                <TextInput
                  style={{ paddingVertical: 10, paddingHorizontal: 20, fontSize: 14, fontFamily: 'WS-Light' }}
                  onChangeText={(lName) => this.onChange('lName', lName)}
                  value={this.state.lName}
                  placeholder="Last Name"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType='givenName'
                  selectTextOnFocus={true}
                  spellCheck={false}
                  keyboardType={'default'}

                />
              </View>
            </View>
            <Text style={{ textAlign: 'center', color: 'red', fontFamily: 'WS-Regular', fontSize: 14, marginBottom: 10 }}>{this.state.lastError}</Text>

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
            <Text style={{ textAlign: 'center', color: 'red', fontFamily: 'WS-Regular', fontSize: 14, marginBottom: 10 }}>{this.state.addError}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderColor: '#d6d6d6', borderWidth: 1, borderRadius: 30, marginBottom: 10 }}>
              <View style={{ flex: 0.15, alignItems: 'flex-end' }}>
                <SimpleLineIcons
                  name="phone"
                  size={25}
                  color="#d6d6d6"
                />
              </View>
              <View style={{ flex: 0.85 }}>
                <TextInput
                  style={{ paddingVertical: 10, paddingHorizontal: 20, fontSize: 14, fontFamily: 'WS-Light' }}
                  value={this.state.pNumber}
                  onChangeText={(pNumber) => this.onChange('pNumber', pNumber)}
                  placeholder="Phone No."
                  autoCapitalize='none'
                  autoCorrect={false}
                  textContentType='telephoneNumber'
                  selectTextOnFocus={true}
                  spellCheck={false}
                  keyboardType={'number-pad'}
                  maxLength={10}
                  returnKeyType='done'
                />
              </View>
            </View>
            <Text style={{ textAlign: 'center', color: 'red', fontFamily: 'WS-Regular', fontSize: 14, marginBottom: 10 }}>{this.state.phonError}</Text>
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
            <Text style={{ textAlign: 'center', color: 'red', fontFamily: 'WS-Regular', fontSize: 14, marginBottom: 10 }}>{this.state.lengthError}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderColor: '#d6d6d6', borderWidth: 1, borderRadius: 30, marginBottom: 15 }}>
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
            <Text style={{ textAlign: 'center', color: 'red', fontFamily: 'WS-Regular', fontSize: 14, marginBottom: 10 }}>{this.state.passError}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
              <View style={{ flex: 0.15, alignItems: 'center' }}>
                <CheckBox
                  checked={this.state.checked}
                  onPress={() => this.onChange('checked', !this.state.checked)}
                />
              </View>
              <View style={{ flex: 0.85 }}>
                <Text style={{ marginTop: 10, color: '#334159', fontFamily: 'WS-Light' }}>I agree to the <Text style={{ color: 'blue', textDecorationLine: 'underline' }} onPress={() => { this.setModalVisibleTermsCondition(!this.state.modalVisibleTermsCondition) }} activeOpacity={0.5}>Terms and Conditions</Text> and <Text style={{ color: 'blue', textDecorationLine: 'underline' }} onPress={() => { this.setModalVisiblePrivacy(!this.state.modalVisiblePrivacy) }} activeOpacity={0.5} >Privacy Policy</Text></Text>
              </View>
        
              <Modal
                animationType='fade'
                transparent={true}
                visible={this.state.modalVisibleTermsCondition}
                onRequestClose={() => {
                  Alert.alert('Modal has been closed.');

                }}
              >
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} >
                  <View style={{ flex: 1, backgroundColor: '#ffffff', marginTop: DeviceHeight * 0.10, marginBottom: DeviceHeight * 0.10, marginHorizontal: '10%', borderRadius: 5, padding: '3%' }}>
                    <View style={{ alignItems: 'flex-end', }}>
                      <TouchableOpacity
                        onPress={() => { this.setModalVisibleTermsCondition(!this.state.modalVisibleTermsCondition) }}
                        activeOpacity={0.5}
                      >
                        <MaterialIcons
                          name='close'
                          size={25}
                          color='red'
                        />
                      </TouchableOpacity>
                    </View>

                    <View style={{ alignItems: 'center', justifyContent: 'center', alignContent: 'center' }}>
                      <Text style={{ fontSize: 18, color: '#000', fontWeight: 'bold', textAlign: 'center' }}>Terms and Conditions</Text>
                    </View>

                    <View style={{ flex: 10, backgroundColor: '#ffffff' }}>

                      <ScrollView
                        showsVerticalScrollIndicator={true}
                        contentContainerStyle={{ paddingVertical: 5, alignItems: 'center', justifyContent: 'center', marginHorizontal: 10 }}
                      >
                        <Text style={{ textAlign: 'left' }}>{this.state.termCondtionText}</Text>
                      </ScrollView>

                    </View>
                  </View>
                </View>
              </Modal>

              <Modal
                animationType='fade'
                transparent={true}
                visible={this.state.modalVisiblePrivacy}
                onRequestClose={() => {
                  Alert.alert('Modal has been closed.');

                }}
              >
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} >
                  <View style={{ flex: 1, backgroundColor: '#ffffff', marginTop: DeviceHeight * 0.10, marginBottom: DeviceHeight * 0.10, marginHorizontal: '10%', borderRadius: 5, padding: '3%' }}>
                    <View style={{ alignItems: 'flex-end' }}>
                      <TouchableOpacity
                        onPress={() => { this.setModalVisiblePrivacy(!this.state.modalVisiblePrivacy) }}
                        activeOpacity={0.5}
                      >
                        <MaterialIcons
                          name='close'
                          size={25}
                          color='red'
                        />
                      </TouchableOpacity>
                    </View>

                    <View style={{  alignItems: 'center', justifyContent: 'center', alignContent: 'center' }}>
                      <Text style={{ fontSize: 18, color: '#000', textAlign: 'center', fontWeight: 'bold' }}>Privacy policy</Text>
                    </View>

                    <View style={{ flex: 10, backgroundColor: '#ffffff' }}>

                      <ScrollView
                        showsVerticalScrollIndicator={true}
                        contentContainerStyle={{ paddingVertical: 5, alignItems: 'center', justifyContent: 'center',marginLeft:5 }}
                      >
                        <Text style={{ textAlign: 'left' }}>{this.state.privacyText}</Text>
                      </ScrollView>

                    </View>
                  </View>
                </View>
              </Modal>
            </View>
          </View>

          <Text style={{ textAlign: 'center', color: 'red', fontFamily: 'WS-Regular', fontSize: 14, marginBottom: 10 }}>{this.state.checkError}</Text>


          <View style={{ marginBottom: 30, marginHorizontal: 20 }}>
            <CustomButton
              disabled={emailError || passError || firstError || lastError || addError || phonError || !isDirty ? true : false}
              text="SUBMIT"
              onClick={this.fetchAPI}
            />

            <Modal
              animationType='fade'
              transparent={true}
              visible={this.state.modalVisibleOtp}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');

              }}
            >
              <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} >
                <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#ffffff', marginTop: DeviceHeight * 0.25, marginBottom: DeviceHeight * 0.25, marginHorizontal: '10%', borderRadius: 5, padding: '3%' }}>
                  <View style={{ alignItems: 'flex-end' }}>
                    <TouchableOpacity
                      onPress={() => { this.setModalVisibleOtp(!this.state.modalVisibleOtp); }}
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
                      <View style={{ marginBottom: 10, alignItems: 'center', justifyContent: 'center' }}>
                        <TextInput
                          style={{ paddingVertical: 5, textAlign: 'center', borderColor: '#d6d6d6', borderWidth: 1, borderRadius: 30, width: '80%' }}
                          placeholder='OTP'
                          value={this.state.verificationCode}
                          onChangeText={(otp) => this.setState({ verificationCode: otp })}
                          textColor='#000'
                          fontSize={17}
                          textContentType='telephoneNumber'
                          returnKeyType='done'
                          selectTextOnFocus={true}
                          spellCheck={false}
                          keyboardType='number-pad'
                          maxLength={6}
                          returnKeyType='done'
                        />
                      </View>
                      <View style={{ marginTop: '3%' }}>
                        <CustomButton
                          // disabled={otpError || !isDirty ? true : false}
                          onClick={this.verifyEmail}
                          text="SUBMIT"
                        />
                      </View>
                    </KeyboardAvoidingView>
                  </View>
                </View>
              </View>
            </Modal>

          </View>


          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontFamily: 'WS-Light', color: '#25334a' }}>Already have an account?</Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Login')}
            >
              <Text style={{ color: '#25334a', fontFamily: 'WS-SemiBold' }}> Login Now</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </View>
    );
  }
}