import React from 'react';
import {
  Platform,
  ScrollView,
  Text,
  View,
  Image,
  FlatList,
  Alert,
  AlertIOS,
  AsyncStorage

} from 'react-native';
import { AntDesign, MaterialIcons, EvilIcons } from '@expo/vector-icons';
import { CustomButton } from '../../../components/Button'
import CheckoutDetails from '../../../components/checkoutDetails'
import { CartCount } from '../../../components/cartCounter';
import Loader from '../../../navigation/AuthLoadingScreen'

const api = require('../../../api/index');

export default class CheckoutStep2 extends React.Component {
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
    message: '',
    userId: '',
    userToken: '',
    data: [],
    cartData: [],
    totalPoints: '',
    cartCount: 0,
    Shipping_Address: {},
    placeOrder: {},
    loading: true,
    isMounted: false
  }

  componentDidMount = async () => {
    this.willFocusListener = await this.props.navigation.addListener('willFocus', async () => {
      await AsyncStorage.multiGet(['userToken', 'userId', 'userCartCount','remainReward'], (err, res) => {
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
            cartCount: JSON.parse(res[2][1]),
            remainReward: JSON.parse(res[3][1]),
          },
            () => {
              this.props.navigation.setParams({
                cartCount: this.state.cartCount,
              })
            });
          this.cartList();
          const Shipping_Address = this.props.navigation.state.params.ShippingAddress;
          this.setState({ Shipping_Address });
        }
      })
    })
  }

  cartList = async () => {
    const { userToken, userId } = this.state;
    await api.cartList({
      userToken,
      userId
    },
      async (e, r) => {
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
          if (r.response_code === 2000) {
            this.setState({ cartData: r.response_data.list, totalPoints: r.response_data.totalPoint, loading: false, isMounted: true })
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

  sendPushFromLocal = async (pushData) => {
    const message = {
      to: pushData.deviceToken,
      sound: 'default',
      title: 'Order Place',
      body: pushData.body
    };

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
    const data = response._bodyInit;
    console.log(`Status & Response ID-> ${data}`);
  }


  checkOut = async () => {
    return new Promise(async (resolve, reject) => {
      const { userToken, userId } = this.state;
      await api.checkOut({
        userToken,
        userId
      },
        async (e, r) => {
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
            if (r.response_code === 2000) {
              const push = r.response_data.pushData
              this.sendPushFromLocal(push)
              await AsyncStorage.setItem('userCartCount', JSON.stringify(0));
              AsyncStorage.setItem('remainReward', JSON.stringify(r.response_data.remainReward))
              // console.log('carrtceckoutremainreward:',r.response_data.remainReward)
              this.setState({ placeOrder: r.response_data, loading: false, isMounted: true }, () => {
                resolve(r.response_data)
              })
            } else if (r.response_code === 2020) {
              this.props.navigation.navigate('Home')
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

  placeOrder = async () => {
    this.checkOut().then((res) => {
          this.props.navigation.navigate('OrderConfirmation', { placeOrder: res })
  
    })
 }


  render() {
    const { firstQuery } = this.state;
    if (this.state.isMounted === false) {
      return (
        <View style={{ flex: 1, backgroundColor: '#334058' }}>
          <Loader loading={this.state.loading} navigation={this.props.navigation} />
        </View>
      )
    } else {
      return (
        <View style={{ flex: 1 }}>
          <ScrollView
            alwaysBounceVertical={true}
            keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {/* <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20}}>
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

          <View style={{ marginHorizontal: 10, marginBottom: 10 }}>
            <Searchbar
              style={{ borderRadius: 30, margin: 10, elevation: 4 }}
              iconColor="#afafaf"
              inputStyle={{ fontSize: 16, fontFamily: 'WS-Light', }}
              placeholder="Search for Causes/Vendors"
              onChangeText={query => { this.setState({ firstQuery: query }); }}
              value={firstQuery}
            />
          </View> */}

            <View style={{ alignItems: 'center', marginBottom: 15, marginTop: 30 }}>
              <Image
                style={{ width: 113, height: 73 }}
                source={require('../../../assets/img/tab/check_out/checkout.png')}
              />
              <Text style={{ letterSpacing: 3, color: '#334159', fontFamily: 'WS-Medium', fontSize: 18, marginTop: 15 }}>CHECKOUT STEP 2</Text>
              <Text style={{ color: '#334159', fontFamily: 'WS-Medium', fontSize: 12, marginTop: 4 }}>order Summary</Text>
            </View>

            <View style={{ borderBottomWidth: 1, borderBottomColor: '#b7b7b7', marginHorizontal: 20 }}>
              <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }}>
                <View style={{ flex: 0.33 }}>
                  <Text style={{ color: '#25334a', fontFamily: 'WS-Medium', fontSize: 14, textAlign: 'left' }}>Total Number of Items</Text>
                </View>
                <View style={{ flex: 0.33 }}>
                  <Text style={{ color: '#25334a', fontFamily: 'WS-Medium', fontSize: 14, textAlign: 'center' }}>Total Number of Points Rewarded</Text>
                </View>
                <View style={{ flex: 0.33 }}>
                  <Text style={{ color: '#25334a', fontFamily: 'WS-Medium', fontSize: 14, textAlign: 'right' }}>Total Number of Points Redeemed</Text>
                </View>
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: -5 }}>
              <Text style={{ textAlign: 'center', color: '#b7b7b7' }}>|</Text>
              <Text style={{ textAlign: 'center', color: '#b7b7b7' }}>|</Text>
              <Text style={{ textAlign: 'center', color: '#b7b7b7' }}>|</Text>

            </View>

            <View style={{ marginBottom: 15, marginLeft: 10, marginRight: 20 }}>
              <FlatList
                keyExtractor={item => item.productId}
                data={this.state.cartData}
                renderItem={({ item, index }) => {
                  return (
                    <CheckoutDetails
                      image1={item.productImage}
                      text1={item.productName}
                      text2={item.totalPoint}
                      product={item.cartProductQty}
                    />
                  );
                }}
                removeClippedSubviews={false}
                bounces={false}
                showsHorizontalScrollIndicator={false}
              />
            </View>

            <View style={{ flex: 1, marginBottom: 10, flexDirection: 'row', borderTopColor: '#b7b7b7', borderTopWidth: 1, paddingVertical: 10, marginHorizontal: 20 }}>
              <View style={{ flex: 0.5, alignItems: 'flex-end' }}>
                <Text style={{ color: '#25334a', fontFamily: 'WS-SemiBold' }}>Remain Reward points</Text>
              </View>
              <View style={{ flex: 0.4, alignItems: 'flex-end' }}>
                <Text style={{ textAlign: 'center', fontFamily: 'WS-SemiBold', color: '#aecb3e' }}>{`${this.state.totalPoints} pts`}</Text>
              </View>
            </View>

            <View style={{ borderColor: '#b7b7b7', borderWidth: 1, marginHorizontal: 20, padding: 10 }}>
              <Text style={{ color: '#25334a', fontFamily: 'WS-Medium', fontSize: 14, marginBottom: 10 }}>Delivery Address </Text>
              <Text style={{ color: '#25334a', fontFamily: 'WS-Regular', fontSize: 12 }}> {`Address Line 1 - ${this.state.Shipping_Address.addressOne}`} </Text>
              <Text style={{ color: '#25334a', fontFamily: 'WS-Regular', fontSize: 12 }}>{`Address Line 2 - ${this.state.Shipping_Address.addressTwo}`} </Text>
              <Text style={{ color: '#25334a', fontFamily: 'WS-Regular', fontSize: 12 }}>{`Country - ${this.state.Shipping_Address.country}`} </Text>
              <Text style={{ color: '#25334a', fontFamily: 'WS-Regular', fontSize: 12 }}>{`State - ${this.state.Shipping_Address.state}`} </Text>
              <Text style={{ color: '#25334a', fontFamily: 'WS-Regular', fontSize: 12 }}>{`Zip Code - ${this.state.Shipping_Address.zipCode}`} </Text>
            </View>

          </ScrollView>

          <View style={{ flexDirection: 'row', position: 'absolute', bottom: 12, marginHorizontal: 30 }}>
            <View style={{ flex: 0.5, }}>
              <CustomButton
                onClick={() => this.props.navigation.goBack()}
                text="Previous"
                margin="zero"
                font="vary" />
            </View>

            <View style={{ flex: 0.5 }} >
              <CustomButton
                onClick={this.placeOrder}
                text="Place Order"
                margin="zero"
                font="vary"
              />
            </View>

          </View>
        </View>
      );
    }
  }
}

