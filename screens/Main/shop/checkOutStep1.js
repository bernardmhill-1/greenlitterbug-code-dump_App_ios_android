import React from 'react';
import {
  Platform,
  ScrollView,
  Text,
  View,
  Image,
  TextInput,
  AsyncStorage,
  Alert,
  AlertIOS

} from 'react-native';
import { AntDesign, EvilIcons } from '@expo/vector-icons';
import { CustomButton } from '../../../components/Button'
import { CartCount } from '../../../components/cartCounter'
import Loader from '../../../navigation/AuthLoadingScreen'

const api = require('../../../api/index');

export default class CheckOutStep1 extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      title: 'Checkout',
      headerRight: (
        <CartCount count={params.cartCount} onClick={() => navigation.navigate('myCartList')} />
      ),
      headerRightContainerStyle: {
        marginRight: 18
      },
      headerStyle: {
        marginTop: -20,
        backgroundColor: '#1d2b3a',
        height: 60,

      },
      headerTintColor: '#ffffff',
      headerTitleStyle: {
        fontFamily: 'WS-Light',
        fontSize: 18
      },

    }
  }

  state = {
    value: 'first',
    firstQuery: '',
    userToken: '',
    userId: '',
    cartCount: 0,
    addressLine1: '',
    addressLine2: '',
    country: '',
    stateN: '',
    zipCode: '',
    hidePassword: true,
    shippingAddress: {},
    allError: '',
    address1Error: '',
    address2Error: '',
    countryError: '',
    stateError: '',
    zipcodeError: '',
    isDirty: false,
    loading: true,
    isMounted: false

  }

  componentDidMount = async () => {
    this.willFocusListener = await this.props.navigation.addListener('willFocus', async () => {
      await AsyncStorage.multiGet(['userToken', 'userId', 'userCartCount'], (err, res) => {
        if (err) {
          (Platform.OS === 'android' ? Alert : AlertIOS).alert(
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
            cartCount: JSON.parse(res[2][1]),
          }, () => {
            this.props.navigation.setParams({
              cartCount: this.state.cartCount,
            });
          });
          this.viewShippingAddress();
          this.setState({ isDirty: true,isMounted:true })
        }
      })
    })
  }

  componentWillUnmount = () => {
    this.willFocusListener.remove();
  }

  addShippingAddress =  () => {
   return new Promise(async(resolve, reject) => {
    const { userToken, userId, addressLine1, addressLine2, country, stateN, zipCode } = this.state
    await api.addShippingAddress({
      userToken,
      userId,
      addressOne: addressLine1,
      addressTwo: addressLine2,
      country: country,
      state: stateN,
      zipCode: zipCode,

    },
      (e, r) => {
        if(e) {
          this.setState({loading: false, isMounted: true})
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
          if (r.response_code == 2000) {
            this.setState({ shippingAddress: r.response_data, loading: false, isMounted: true }, () => {
              resolve(r.response_data)
            })
            //  Alert.alert('Success', r.response_message);
          } else {
            this.setState({ loading: false }, () => {
              reject('Api error')
            });
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
   })
    
  }


  addShippingData = () => {
    this.addShippingAddress().then((res) => {
      this.props.navigation.navigate('CheckOutStep2', { ShippingAddress: res })
    })    
  }

  viewShippingAddress = async () => {
    const { userToken, userId } = this.state
    await api.viewShippingAddress({
      userToken,
      userId,
    },
      (e, r) => {
        if(e) {
          this.setState({loading: false, isMounted: true})
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
          if (r.response_code == 2000) {
            if(r.response_data) {
            this.setState({
              addressLine1: r.response_data.addressOne,
              addressLine2: r.response_data.addressTwo,
              country: r.response_data.country,
              stateN: r.response_data.state,
              zipCode: r.response_data.zipCode,
              isMounted: true
            })
          }
            this.setState({ loading: false,isMounted:true });
            this.validateOnLoad();
          } else {
            this.setState({ isMounted:true });
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

  validateOnLoad = () => {
    if(this.state.addressLine1 === '') {
      this.setState({address1Error: 'Address Line 1 Required'})
    } else {
      this.setState({address1Error: ''})
    }
    if(this.state.addressLine2 === '') {
      this.setState({address2Error: 'Address Line 2 Required'})
    } else {
      this.setState({address2Error: ''})
    }
    if(this.state.country === '') {
      this.setState({countryError: 'Country is Required'})
    } else {
      this.setState({countryError: ''})
    }
    if(this.state.stateN === '') {
      this.setState({stateError: 'state is Required'})
    } else {
      this.setState({stateErrorError: ''})
    }
    if(this.state.zipCode === '') {
      this.setState({zipCodeError: 'ZipCode is Required'})
    } else {
      this.setState({zipCodeError: ''})
    }
  }

  onChange = (name, value) => {
    if (this.state.addressLine1 == '' && this.state.addressLine2 == '' && this.state.country == '' && this.state.stateN == '' && this.state.zipCode == '') {
      this.setState({ allError: 'All fields are Required' })
    } else {
      this.setState({ allError: '' })
    }
    if (name === 'addressLine1' && value === '') {
      this.setState({ address1Error: 'Address Line 1 Required' })
    } else if (name === 'addressLine1' && value !== '') {
      this.setState({ address1Error: '' })
    }
    if (name === 'addressLine2' && value === '') {
      this.setState({ address2Error: 'Address Line 2 Required' })
    } else if (name === 'addressLine2' && value !== '') {
      this.setState({ address2Error: '' })
    }
    if (name === 'country' && value === '') {
      this.setState({ countryError: 'Country is Required' })
    } else if (name === 'country' && value !== '') {
      this.setState({ countryError: '' })
    }
    if (name === 'stateN' && value === '') {
      this.setState({ stateError: 'State is Required' })
    } else if (name === 'stateN' && value !== '') {
      this.setState({ stateError: '' })
    }
    if (name === 'zipCode' && value === '') {
      this.setState({ zipcodeError: 'zipCode is Required' })
    } else if (name === 'zipCode' && value !== '') {
      this.setState({ zipcodeError: '' })
    }

    this.setState({ [name]: value, isDirty: true })

  }

  render() {
    const { firstQuery, allError, address1Error, address2Error, countryError, stateError, zipcodeError, isDirty } = this.state;
    if (this.state.isMounted === false) {
      return (
        <View style={{ flex: 1, backgroundColor: '#334058' }}>
          <Loader loading={this.state.loading} navigation={this.props.navigation} />
        </View>
      )
    } else {
      return (
        <View style={{ flex: 1, marginTop: 50 }}>
          <ScrollView
            alwaysBounceVertical={true}
            keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingVertical:10}}
          >
            {/* <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }}>
            <RadioButton.Group
              onValueChange={value => this.setState({ value })}
              value={this.state.value}
            >
              <View style={{ flex: 0.5, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 0.4, alignItems: 'flex-end' }}>
                  <RadioButton color="#499828" value="first" />
                </View>
                <View style={{ flex: 0.4, alignItems: 'center' }}>
                  <Text>Causes</Text>
                </View>
              </View>

              <View style={{ flex: 0.5, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 0.4, alignItems: 'flex-end' }}>
                  <RadioButton color="#499828" value="second" />
                </View>
                <View style={{ flex: 0.4, alignItems: 'center' }}>
                  <Text>Vendors</Text>
                </View>
              </View>
            </RadioButton.Group>
          </View>

          <View style={{ marginHorizontal: 10, marginBottom: 15 }}>
            <Searchbar
              style={{ borderRadius: 30, margin: 10, elevation: 4 }}
              inputStyle={{ fontSize: 16, fontFamily: 'WS-Light', }}
              placeholder="Search for Causes/Vendors"
              onChangeText={query => { this.setState({ firstQuery: query }); }}
              value={firstQuery}
            />
          </View> */}

            <View style={{ alignItems: 'center', marginBottom: 15 }}>
              <Image
                style={{ width: 113, height: 73 }}
                source={require('../../../assets/img/tab/check_out/checkout.png')}
              />
              <Text style={{ letterSpacing: 3, color: '#334159', fontFamily: 'WS-Medium', fontSize: 18, marginTop: 15 }}>CHECKOUT STEP 1</Text>
            </View>

            <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
              <View style={{ backgroundColor: '#ffffff', borderColor: '#d6d6d6', borderWidth: 1, borderRadius: 30, marginBottom: 10 }}>
                <TextInput
                  style={{ paddingVertical: 8, paddingHorizontal: 20, fontSize: 14, fontFamily: 'WS-Medium', textAlign: 'center', color: "#334159" }}
                  value={this.state.addressLine1}
                  onChangeText={(addressLine1) => this.onChange('addressLine1', addressLine1)}
                  placeholder="Address Line 1"
                  autoCapitalize='none'
                  textColor="#334159"
                  autoCorrect={false}
                  textContentType='addressCityAndState'
                  selectTextOnFocus={true}
                  spellCheck={false}
                  keyboardType={'email-address'}
                />
              </View>
              <Text style={{ textAlign: 'center', color: 'red', fontFamily: 'WS-Regular', fontSize: 14, marginBottom: 10 }}>{this.state.address1Error}</Text>

              <View style={{ backgroundColor: '#ffffff', borderColor: '#d6d6d6', borderWidth: 1, borderRadius: 30, marginBottom: 10 }}>
                <TextInput
                  style={{ paddingVertical: 8, paddingHorizontal: 20, fontSize: 14, fontFamily: 'WS-Medium', textAlign: 'center', color: "#334159" }}
                  value={this.state.addressLine2}
                  onChangeText={(addressLine2) => this.onChange('addressLine2', addressLine2)}
                  placeholder="Address Line 2"
                  autoCapitalize='none'
                  textColor="#334159"
                  autoCorrect={false}
                  textContentType='addressCityAndState'
                  selectTextOnFocus={true}
                  spellCheck={false}
                  keyboardType={'email-address'}
                />
              </View>
              <Text style={{ textAlign: 'center', color: 'red', fontFamily: 'WS-Regular', fontSize: 14, marginBottom: 10 }}>{this.state.address2Error}</Text>

              <View style={{ backgroundColor: '#ffffff', borderColor: '#d6d6d6', borderWidth: 1, borderRadius: 30, marginBottom: 10 }}>
                <TextInput
                  style={{ paddingVertical: 8, paddingHorizontal: 20, fontSize: 14, fontFamily: 'WS-Medium', textAlign: 'center', color: "#334159" }}
                  value={this.state.country}
                  onChangeText={(country) => this.onChange('country', country)}
                  placeholder="Country"
                  autoCapitalize='none'
                  textColor="#334159"
                  autoCorrect={false}
                  textContentType='countryName'
                  selectTextOnFocus={true}
                  spellCheck={false}
                  keyboardType={'email-address'}
                />
              </View>
              <Text style={{ textAlign: 'center', color: 'red', fontFamily: 'WS-Regular', fontSize: 14, marginBottom: 10 }}>{this.state.countryError}</Text>

              <View style={{ backgroundColor: '#ffffff', borderColor: '#d6d6d6', borderWidth: 1, borderRadius: 30, marginBottom: 10 }}>
                <TextInput
                  style={{ paddingVertical: 8, paddingHorizontal: 20, fontSize: 14, fontFamily: 'WS-Medium', textAlign: 'center', color: "#334159" }}
                  value={this.state.stateN}
                  onChangeText={(stateN) => this.onChange('stateN', stateN)}
                  placeholder="State"
                  autoCapitalize='none'
                  textColor="#334159"
                  autoCorrect={false}
                  textContentType='addressState'
                  selectTextOnFocus={true}
                  spellCheck={false}
                  keyboardType={'email-address'}
                />
              </View>
              <Text style={{ textAlign: 'center', color: 'red', fontFamily: 'WS-Regular', fontSize: 14, marginBottom: 10 }}>{this.state.stateError}</Text>

              <View style={{ backgroundColor: '#ffffff', borderColor: '#d6d6d6', borderWidth: 1, borderRadius: 30, marginBottom: 10 }}>
                <TextInput
                  style={{ paddingVertical: 8, paddingHorizontal: 20, fontSize: 14, fontFamily: 'WS-Medium', textAlign: 'center', color: "#334159" }}
                  value={this.state.zipCode}
                  onChangeText={(zipCode) => this.onChange('zipCode', zipCode)}
                  placeholder="Zip Code"
                  autoCapitalize='none'
                  textColor="#334159"
                  autoCorrect={false}
                  textContentType='postalCode'
                  selectTextOnFocus={true}
                  spellCheck={false}
                  keyboardType={'number-pad'}
                  maxLength={6}
                />
              </View>
            </View>
            <Text style={{ textAlign: 'center', color: 'red', fontFamily: 'WS-Regular', fontSize: 14, marginBottom: 10 }}>{this.state.zipcodeError}</Text>
            <Text style={{ textAlign: 'center', color: 'red', fontFamily: 'WS-Regular', fontSize: 14 }}>{this.state.allError}</Text>
            <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
              <CustomButton
                disabled={allError || address1Error || address2Error || countryError || stateError || zipcodeError || !isDirty ? true : false}
                onClick={this.addShippingData}
                text="PROCEED"
              />
            </View>
          </ScrollView>
        </View>
      );
    }
  }
}

