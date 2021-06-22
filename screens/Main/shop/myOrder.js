import React from 'react';
import {
  Platform,
  ScrollView,
  Text,
  View,
  FlatList,
  AsyncStorage,
SafeAreaView

} from 'react-native';
import { RadioButton } from 'react-native-paper';
import { Searchbar } from 'react-native-paper';
import OrderList from '../../../components/myOrderList'
import { CartCount } from '../../../components/cartCounter'
import Loader from '../../../navigation/AuthLoadingScreen'
import HTML from './pdf_Html'

const api = require('../../../api/index');

export default class MyOrder extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      title: 'My Order',
      headerRight: (
        <CartCount count={params.cartCount} onClick={() => navigation.navigate('myCartList')} />
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
    orderList: [],
    shipping: {},
    loading: true,
    isMounted: false
  }

  componentDidMount = async () => {
    this.willFocusListener = await this.props.navigation.addListener('willFocus', async () => {
      await AsyncStorage.multiGet(['userToken', 'userId', 'userCartCount'], (err, res) => {
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
          },
            () => {
              this.props.navigation.setParams({
                cartCount: this.state.cartCount,
              })
            });
          this.orderList();

        }
      })
    })
  }

  componentWillUnmount = () => {
    this.willFocusListener.remove();
  }


  orderList = async () => {
    const { userToken, userId } = this.state;
    await api.orderList({
      userToken,
      userId
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
          if (r.response_code === 2000) {
            this.setState({ orderList: r.response_data, shipping: r.response_data.shippingAddress, loading: false, isMounted: true })
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


  // printorder = async () => {
  //   const {orderList} = this.state
  //   const options = {
  //     html:HTML(orderList)
  //   }
  //    await Print.Print.printAsync({options});
  // }


  render() {
    const { firstQuery,orderList } = this.state;
    if (this.state.loading === true) {
      return (
        <View style={{ flex: 1, backgroundColor: '#334058' }}>
          <Loader loading={this.state.loading} navigation={this.props.navigation} />
        </View>
      )
    } else {
      return (
        <SafeAreaView style={{flex:1}}>
        <View style={{ flex: 1, marginTop: 5 }}>
          <ScrollView
            alwaysBounceVertical={true}
            keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 10 }}
          >
            {/* <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 35, marginBottom: 5 }}>
              <RadioButton.Group
                color="red"
                onValueChange={value => this.setState({ value })}
                value={this.state.value}

              >
                <View style={{ flex: 0.5, flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ flex: 0.4, alignItems: 'flex-end' }}>
                    <RadioButton color="#499828" value="first" />
                  </View>
                  <View style={{ flex: 0.4, alignItems: 'center' }}>
                    <Text style={{ color: "#6d6d6d", fontFamily: 'WS-Regular' }}>Causes</Text>
                  </View>
                </View>

                <View style={{ flex: 0.5, flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ flex: 0.4, alignItems: 'flex-end' }}>
                    <RadioButton color="#499828" value="second" />
                  </View>
                  <View style={{ flex: 0.4, alignItems: 'center' }}>
                    <Text style={{ color: "#6d6d6d", fontFamily: 'WS-Regular' }}>Vendors</Text>
                  </View>
                </View>
              </RadioButton.Group>
            </View> */}

            <View style={{ marginHorizontal: 10, paddingBottom: 10,marginTop:20 }}>
              <Searchbar
                style={{ borderRadius: 30, margin: 10, elevation: 4 }}
                iconColor="#afafaf"
                inputStyle={{ fontSize: 16, fontFamily: 'WS-Light', }}
                placeholder="Search for Causes/Vendors"
                onChangeText={query => { this.setState({ firstQuery: query }); }}
                value={firstQuery}
              />
            </View>
            {orderList.length > 0 ?
              <View>
                <FlatList
                  keyExtractor={item => item._id}
                  data={this.state.orderList}
                  extraData={this.state}
                  renderItem={({ item }) => {
                    return (
                      <OrderList allItem={item} products={item.products} onClick={this.printorder} title1={item.titleA} totalQty={item.totalQty} date={new Date(item.createdAt).toLocaleDateString()} orderId={item.orderId} points={item.totalPoint} status={item.orderStatus} />
                    )
                  }}
                  removeClippedSubviews={false}
                  bounces={false}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
              :
              <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 35 }}>
                <Text style={{ textAlign: 'center', color: 'gray', fontFamily: 'WS-SemiBold', fontSize: 18 }}>No Orders Found</Text>
              </View>
            }
          </ScrollView>
        </View >
        </SafeAreaView>
      );
    }
  }
}

