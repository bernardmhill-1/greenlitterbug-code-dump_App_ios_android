import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  AsyncStorage,
  Alert,
  AlertIOS,
  StatusBar

} from 'react-native';
import { SimpleLineIcons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { CustomButton } from '../../../components/Button'
import Loader from '../../../navigation/AuthLoadingScreen'

const api = require('../../../api/index');

export default class Contact extends React.Component {
  static navigationOptions = {
    title: 'Contact',
    headerStyle: {
      marginTop: -20,
      backgroundColor: '#1d2b3a',
      height: 60,
    },
    headerTintColor: '#ececec',
    headerTitleStyle: {
      fontFamily: 'WS-Light',
      fontSize: 18
    },
  }

  state = {
    userToken: '',
    userId: '',
    firstName: '',
    lastName: '',
    userEmail: '',
    message: '',
    firstError: '',
    lastError: '',
    addError: '',
    messError: '',
    isDirty: false,
    isMounted: false

  }

  // updateUser = (shortorder) => {
  //   this.setState({ shortorder: shortorder })
  // }

  componentDidMount = async () => {
    await AsyncStorage.multiGet(['userToken', 'userId', 'firstName', 'lastName', 'userEmail'], (err, res) => {
      if (err) {
        // (Platform.OS === 'android' ? Alert : AlertIOS).alert(
        //   'Error', err,
        //   [
        //     {
        //       text: 'OK', onPress: () => this.setState({ loading: false})
        //     }
        //   ]
        // );
      } else {
        this.setState({
          userToken: JSON.parse(res[0][1]),
          userId: JSON.parse(res[1][1]),
          firstName: JSON.parse(res[2][1]),
          lastName: JSON.parse(res[3][1]),
          userEmail: JSON.parse(res[4][1])
        }, () => {
          this.setState({ isMounted: true })
        });
      }
    })

  }

  contactUs = async () => {
    this.setState({ loading: true })
    await api.contactUs({
      userToken: this.state.userToken,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.userEmail,
      message: this.state.message
    },
      (e, r) => {
        if (e) {
          // (Platform.OS === 'android' ? Alert : AlertIOS).alert(
          //   'Error', e,
          //   [
          //     {
          //       text: 'OK', onPress: () => this.setState({ loading: false})
          //     }
          //   ]
          // );
          //CATCH THE ERROR IN DEVELOPMENT
        } else {
          if (r.response_code === 2000) {
          	Alert.alert(
              'Success', JSON.stringify(r.response_message),
              [
                {
                  text: 'OK', onPress: () => this.setState({ loading: false, isMounted: true })
                }
              ]
            );
          } else {
            this.setState({ loading: false, isMounted: true });
            //CATCH THE ERROR IN DEVELOPMENT 

            // (Platform.OS === 'android' ? Alert : AlertIOS).alert(
            //   'Request failed', r.response_message,
            //   [
            //     {
            //       text: 'OK', onPress: () => this.setState({ loading: false})
            //     }
            //   ]
            // );
          }
        }
      })
  }


  onChange = (name, value) => {

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (this.state.firstName == '' && this.state.lastName == '' && this.state.userEmail == '' && this.state.message == '') {
      this.setState({ emailError: 'All fields are Requried' })
    } else {
      this.setState({ emailError: '' })
    }
    if (name === 'firstName' && value === '') {
      this.setState({ firstError: 'First Name are Requried' })
    } else if (name === 'firstName' && value !== '') {
      this.setState({ firstError: '' })
    }
    if (name === 'lastName' && value === '') {
      this.setState({ lastName: 'Last Name are Requried' })
    } else if (name === 'lName' && value !== '') {
      this.setState({ lastError: '' })
    }
    if (name == 'userEmail' && (!reg.test(value) || value == '')) {
      this.setState({ addError: 'Please enter a valid email' })
    } else if (name == 'userEmail' && (!reg.test(value) || value !== '')) {
      this.setState({ addError: '' })
    }
    if (name === 'message' && value === '') {
      this.setState({ messError: 'Message are Requried' })
    } else if (name === 'message' && value !== '') {
      this.setState({ messError: '' })
    }

    this.setState({ [name]: value, isDirty: true })

  }

  render() {
    const { addError, isDirty, firstError, lastError, messError } = this.state;
    if (this.state.isMounted === false) {
      return (
        <View style={{ flex: 1, backgroundColor: '#334058' }}>
          <Loader loading={this.state.loading} navigation={this.props.navigation} />
        </View>
      )
    } else {
      return (
        <View style={{ flex: 1, marginTop: 10 }}>
          { Platform.OS == "android" &&
            <StatusBar translucent={true} backgroundColor={'transparent'} />}
          <ScrollView
            alwaysBounceVertical={true}
            keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 10 }}
          >


            <View style={{ alignItems: 'center', marginBottom: 30, marginTop: 35 }}>
              <Image
                style={{ width: 113, height: 73 }}
                source={require('../../../assets/img/contact/contact.png')}
              />
              <Text style={{ letterSpacing: 3, color: '#25334a', fontFamily: 'WS-Medium', fontSize: 18, marginTop: 15, textAlign: 'center' }}>CONTACT US</Text>
            </View>


            {/* <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 15 }}>
            <View style={{ flex: 0.2, alignItems: 'center' }}>
              <AntDesign
                name="select1"
                size={20}
                color="#313131"
              />
            </View>

            <View style={{ flex: 0.8, alignItems: 'flex-start' }}>
              <Picker
                style={{ width: '97%' }}
                selectedValue={this.state.shortorder}
                onValueChange={this.updateUser}
                mode='dropdown'
              >
                <Picker.Item label="Select Query Type" value="new" />
                <Picker.Item label="Assigned" value="assigned" />
                <Picker.Item label="Completed" value="completed" />
              </Picker>

              <Text style={{ color: '#2d2d2d', fontFamily: 'WS-Regular', fontSize: 16 }}>{this.state.user}</Text>
            </View>

            <TouchableOpacity
              style={{ position: 'absolute', right: 18, width: 20, height: 20, borderRadius: 10, backgroundColor: '#eaeaea', alignContent: 'center' }}
            >
              <Entypo
                name="chevron-small-down"
                size={20}
                color="#313131"
              />
            </TouchableOpacity>
          </View> */}

            {/* <View style={{ marginHorizontal: 20, marginBottom: 30 }}>
            <Image
              style={{ width: '100%', height: 3 }}
              source={require('../../../assets/img/home/line.png')}
            />
          </View> */}
            <KeyboardAvoidingView
              behavior='padding'
            >
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
                      onChangeText={(firstName) => this.onChange('firstName', firstName)}
                      value={this.state.firstName}
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
                      onChangeText={(lastName) => this.onChange('lastName', lastName)}
                      value={this.state.lastName}
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
                      value={this.state.userEmail}
                      onChangeText={(userEmail) => this.onChange('userEmail', userEmail)}
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

                <View style={{ alignItems: 'center', borderRadius: 30, borderColor: '#d6d6d6', borderWidth: 1, elevation: 1 }}>
                  <TextInput
                    style={{ paddingVertical: 6, paddingHorizontal: 20, fontSize: 14, fontFamily: 'WS-Light', color: '#919090' }}
                    onChangeText={(message) => this.onChange('message', message)}
                    value={this.state.message}
                    placeholder="Message"
                    placeholderTextColor="#919090"
                    placeholderTextSize={30}
                    autoCapitalize="none"
                    autoCorrect={false}
                    multiline={true}
                    // numberOfLines={2}
                    textContentType='name'
                    selectTextOnFocus={true}
                    spellCheck={false}
                    keyboardType={'default'}
                  />
                </View>
              <Text style={{ textAlign: 'center', color: 'red', fontFamily: 'WS-Regular', fontSize: 14, marginBottom: 10 }}>{this.state.messError}</Text>
            </View>
            </KeyboardAvoidingView>
            
            <View style={{ marginHorizontal: 15 }}>
              <CustomButton text="SUBMIT"
                disabled={addError || firstError || lastError || addError || messError || !isDirty ? true : false}
                onClick={this.contactUs}
              />
            </View>

          </ScrollView>
        </View>
      );
    }
  }
}

