import React from 'react';
import { Platform, ScrollView, Text, SafeAreaView, View, FlatList, AsyncStorage, Alert, AlertIOS } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { RadioButton, Searchbar } from 'react-native-paper';
import { CustomButton } from '../../../components/Button';
import CartDetails from '../../../components/cart_Details';
import Loader from '../../../navigation/AuthLoadingScreen'
import { CartCount } from '../../../components/cartCounter'

const api = require('../../../api/index');

export default class myCartList extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      title: 'My Cart',
      // headerLeft: (
      //   <TouchableOpacity
      //     onPress={() => navigation.toggleDrawer()}
      //     style={{ justifyContent: 'center', alignItems: 'center', padding: 8, marginLeft: 10, borderRadius: 25 }}
      //     underlayColor={"rgba(0,0,0,0.32)"}
      //   >
      //     <MaterialIcons
      //       name='dehaze'
      //       size={25}
      //       color='#fff'
      //     />
      //   </TouchableOpacity>
      // ),
      headerRight: (
        <CartCount count={params.cartCount} />
      ),
      headerRightContainerStyle: {
        marginRight: 18
      },
      headerStyle: {
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
    firstQuery: '',
    userId: '',
    userToken: '',
    cartCount: 0,
    cartId: '',
    pValue: [],
    // selectedValue: '',
    selectedValue: [],
    cartData: [],
    cartProductDelete: '',
    favQty: undefined,
    loading: true,
    isMounted: false,
    isDirty: false,
    remainReward: '',
  };

  // inputChange = pValue => {
  //   this.setState({ pValue });
  // };

  componentDidMount = async () => {
    this.willFocusListener = await this.props.navigation.addListener('willFocus', async () => {
      await AsyncStorage.multiGet(['userToken', 'userId', 'userCartCount', 'remainReward'], (err, res) => {
        if (err) {
          // alert(err);
        } else {
          this.setState({
            userToken: JSON.parse(res[0][1]),
            userId: JSON.parse(res[1][1]),
            cartCount: JSON.parse(res[2][1]),
            remainReward: JSON.parse(res[3][1])
          },
            () => {
              // console.log('remainpointsMyCartsScreen:', JSON.parse(res[3][1]))
              this.props.navigation.setParams({
                cartCount: this.state.cartCount,
              })
            });
          this.cartList();

        }
      })
    })
  }

  componentWillUnmount = () => {
    this.willFocusListener.remove();

  }

  cartList = async () => {
    const { userToken, userId } = this.state;
    await api.cartList({
      userToken,
      userId
    },
      async (e, r) => {
        if (e) {
          this.setState({ loading: false, isMounted: true })
          // (Platform.OS === 'android' ? Alert : AlertIOS).alert(
          //   'Error', e,
          //   [
          //     {
          //       text: 'OK', onPress: () => this.setState({ loading: false})
          //     }
          //   ]
          // );
        } else {
          if (r.response_code === 2000) {
            // this.setState({ pValue: [] })
            // for (let i = 1; i <= 10; i++) {
            //   this.state.pValue.push(i.toString());
            // }
            this.setState({ pValue: [] }, () => {
              for (let i = 1; i <= 10; i++) {
                this.state.pValue.push({ label: (i + 1).toString(), value: (i + 1).toString() });
              }
            })
            this.setState({ cartData: r.response_data.list, loading: false, isMounted: true })
          } else {
            this.setState({ loading: false, isMounted: true })
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



  cartProductDelete = async (cartitem) => {
    const { userToken, userId } = this.state
    await api.cartProductDelete({
      userToken,
      userId,
      cartId: cartitem.cartId
    },
      async (e, r) => {
        if (e) {
          this.setState({ loading: false, isMounted: true })
          // (Platform.OS === 'android' ? Alert : AlertIOS).alert(
          //   'Error', e,
          //   [
          //     {
          //       text: 'OK', onPress: () => this.setState({ loading: false})
          //     }
          //   ]
          // );
        } else {
          if (r.response_code == 2000) {
            await AsyncStorage.setItem('userCartCount', JSON.stringify(r.response_data.cartItem));
            this.props.navigation.setParams({
              cartCount: JSON.stringify(r.response_data.cartItem)
            });
            AsyncStorage.setItem('remainReward', JSON.stringify(r.response_data.remainReward))
            // console.log('cartProductDeleteremainpoint:',r.response_data.remainReward)
            // Alert.alert('Success', r.response_message);
            this.cartList();
            this.setState({ loading: false });
          } else {
            this.setState({ loading: false, isMounted: true })
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

  cartQuatityUpdate = async (val, i) => {
    const { userToken, userId } = this.state
    await api.cartQuatityUpdate({
      userToken,
      userId,
      cartId: this.state.cartData[i].cartId,
      qty: val

    },
      async (e, r) => {
        console.log('errormess:', e)
        if (e) {
          console.log('errormess:', e)
          //console.log("hello1");
          this.setState({ loading: false, isMounted: true })
          // (Platform.OS === 'android' ? Alert : AlertIOS).alert(
          //   'Error', e,
          //   [
          //     {
          //       text: 'OK', onPress: () => this.setState({ loading: false})
          //     }
          //   ]
          // );
        } else {
          if (r.response_code == 2000) {
            //console.log("hello2");
            this.state.cartData[i].cartProductQty = JSON.parse(val);
            await AsyncStorage.setItem('userCartCount', JSON.stringify(r.response_data.cartItem));
            this.props.navigation.setParams({
              cartCount: JSON.stringify(r.response_data.cartItem)
            });

            await AsyncStorage.setItem('remainReward', JSON.stringify(r.response_data.remainReward));
            // console.log('cardupadteremainreward',r.response_data.remainReward)
            //Alert.alert('Success', r.response_message);
            // this.cartList();
            this.setState({ loading: false })

          }else {
            //console.log("hello3");
            // this.setState({ loading: false, isMounted: true})
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


  changePicker = (val, i) => {
    console.log('value:', val)
    this.setState({ loading: true });
     let newCartData = this.state.cartData.slice();
//  this.state.cartData[i].cartProductQty = JSON.parse(val);
     this.setState({ cartData: newCartData }, () => {
      this.cartQuatityUpdate(val, i);
    })
  }

  checkOutStokedProducts = () => {
    let isOutAny = false
    const { cartData } = this.state
    cartData.map(cart => {
      if (cart.stockAvl != 'yes') {
        isOutAny = true
      }
    })
    return isOutAny;
  }

  render() {
    const { firstQuery, cartData, isDirty } = this.state;
    if (this.state.isMounted === false) {
      return (
        <View style={{ flex: 1, backgroundColor: '#334058' }}>
          <Loader loading={this.state.loading} navigation={this.props.navigation} />
        </View>
      )
    } else {
      return (
        <SafeAreaView style={{flex:1}}>
        <View style={{ flex: 1 }}>
          <ScrollView
            alwaysBounceVertical
            keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ marginBottom: 50, paddingVertical: 25 }}
          >
            {this.state.loading && <Loader show={this.state.loading} navigation={this.props.navigation} />}

            <View style={{ marginBottom: 15, marginHorizontal: 10 }}>
              <Searchbar
                style={{ borderRadius: 30, margin: 10, elevation: 4 }}
                inputStyle={{ fontSize: 16, fontFamily: 'WS-Light' }}
                iconColor="#afafaf"
                placeholder="Search for Causes/Vendors"
                onChangeText={query => {
                  this.setState({ firstQuery: query });
                }}
                value={firstQuery}
              />
            </View>

            <View
              style={{ borderBottomWidth: 1, borderBottomColor: '#b7b7b7', marginHorizontal: 25 }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 10,
                }}
              >
                <View style={{ flex: 0.28 }}>
                  <Text
                    style={{
                      color: '#25334a',
                      fontFamily: 'WS-Medium',
                      fontSize: 14,
                      textAlign: 'left',
                    }}
                  >
                    Product Name
                  </Text>
                </View>
                <View style={{ flex: 0.35 }}>
                  <Text
                    style={{
                      color: '#25334a',
                      fontFamily: 'WS-Medium',
                      fontSize: 14,
                      textAlign: 'center',
                    }}
                  >
                    Qty
                  </Text>
                </View>
                <View style={{ flex: 0.36 }}>
                  <Text
                    style={{
                      color: '#25334a',
                      fontFamily: 'WS-Medium',
                      fontSize: 14,
                      textAlign: 'center',
                    }}
                  >
                    Points to be Redeemed
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: -5 }}>
              <Text style={{ textAlign: 'center', color: '#b7b7b7' }}>|</Text>
              <Text style={{ textAlign: 'center', color: '#b7b7b7' }}>|</Text>
              <Text style={{ textAlign: 'center', color: '#b7b7b7', marginRight: '5%' }}>|</Text>
            </View>
            {cartData.length > 0 ?
              <View style={{ marginLeft: 10, marginRight: 20, marginBottom: 40 }}>
                <FlatList
                  keyExtractor={item => item.cartId}
                  data={this.state.cartData}
                  renderItem={({ item, index }) => {
                    return (
                      <CartDetails
                        image1={item.productImage}
                        text1={item.productName}
                        text2={item.totalPoint}
                        stockAvl={item.stockAvl}
                        selected={JSON.stringify(this.state.cartData[index].cartProductQty)}
                        changePicker={(itemVal, i) => this.changePicker(itemVal, index)}
                        favQtyUpdate={this.state.favQty}
                        pValue={this.state.pValue}
                        onClick={() => this.cartProductDelete(item)}
                      // image1={item.productImage}
                      // text1={item.productName}
                      // text2={item.totalPoint}
                      // stockAvl={item.stockAvl}
                      // selected={JSON.stringify(this.state.cartData[index].cartProductQty)}
                      // changePicker={(itemVal) => this.changePicker(itemVal, index)}
                      // pValue={this.state.pValue}
                      // onClick={() => this.cartProductDelete(item)}
                      />
                    );
                  }}
                  removeClippedSubviews={false}
                  bounces={false}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
              :
              <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                <Text style={{ textAlign: 'center', color: 'gray', fontFamily: 'WS-SemiBold', fontSize: 18 }}>Cart is empty</Text>
              </View>
            }
          </ScrollView>

          <View
            style={{ flexDirection: 'row', position: 'absolute', bottom: 12, marginHorizontal: '25%', alignItems: 'center', marginTop: 40 }}
          >
            <CustomButton
              onClick={() => this.props.navigation.navigate('CheckOut2')}
              disabled={cartData.length === 0 || this.checkOutStokedProducts() ? true : false}
              text="Proceed to Checkout"
              margin="zero"
              font="vary"
            />
          </View>
        </View>
        </SafeAreaView>
      );
    }
  }
}
// }
