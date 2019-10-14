import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  AsyncStorage,
  Alert,
  AlertIOS,

} from 'react-native';
import { MaterialIcons, } from '@expo/vector-icons';
import Loader from '../../../navigation/AuthLoadingScreen'
import { CartCount } from '../../../components/cartCounter'

const api = require('../../../api/index');
var ts = new Date();

export default class FootPrint extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      title: 'Foot Print',
      headerLeft: (
        <TouchableOpacity
          onPress={() => navigation.toggleDrawer()}
          style={{ justifyContent: 'center', alignItems: 'center', padding: 8, marginLeft: 10, borderRadius: 25 }}
          underlayColor={"rgba(0,0,0,0.32)"}
        >
          <MaterialIcons
            name='dehaze'
            size={25}
            color='#fff'
          />
        </TouchableOpacity>
      ),
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
    userId: '',
    userToken: '',
    message: '',
    data: [],
    totalReward: {},
    cartCount: 0,
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
            cartCount: JSON.parse(res[2][1])
          },
            () => {
              this.props.navigation.setParams({
                cartCount: this.state.cartCount,
              })
            });
          this.ProductListByUser();
        }
      })
    })

  }

  componentWillUnmount = () => {
    this.willFocusListener.remove();
  }


  ProductListByUser = async () => {
    this.setState({ loading: true })
    await api.ProductListByUser({
      userId: this.state.userId,
      userToken: this.state.userToken
    },
      (e, r) => {
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
          //CATCH THE ERROR IN DEVELOPMENT 
        } else {
          if (r.response_code == 2000) {
            this.setState({
              data: r.response_data.list,
              totalReward: r.response_data.totalReward.totalReward,
              remainReward: r.response_data.totalReward.remainReward,
              loading: false,
              isMounted: true
            })
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




  render() {
    const { firstQuery, totalReward, data, remainReward } = this.state;
    const datalength = data.length;
    const RedeemedPoint = totalReward - remainReward;
    if (this.state.isMounted === false) {
      return (
        <View style={{ flex: 1, backgroundColor: '#334058' }}>
          <Loader loading={this.state.loading} navigation={this.props.navigation} />
        </View>
      )
    } else {
      return (
        <View style={{ flex: 1, marginTop: 40 }}>
          <ScrollView
            alwaysBounceVertical={true}
            keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 10 }}
          >

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
                    Total Items
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
                    Total Points Rewarded
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
                    Total Points Redeemed
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: -5 }}>
              <Text style={{ textAlign: 'center', color: '#b7b7b7' }}>|</Text>
              <Text style={{ textAlign: 'center', color: '#b7b7b7' }}>|</Text>
              <Text style={{ textAlign: 'center', color: '#b7b7b7', marginRight: '5%' }}>|</Text>
            </View>

            {data.length > 0 ?
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 30 }}>
                  <View style={{ flex: 0.26, borderColor: '#b7b7b7', borderWidth: 1, borderRadius: 30, alignItems: 'center', alignContent: 'center', marginHorizontal: '6%', paddingVertical: 10 }}>
                    <Text style={{ textAlign: 'center' }}>{datalength}</Text>
                  </View>


                  <View style={{ flex: 0.37, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderColor: '#b7b7b7', borderWidth: 1, borderRadius: 30, height: 40, marginHorizontal: 15 }}>
                    <View style={{ backgroundColor: '#b7b7b7', width: 26, height: 26, borderRadius: 13, alignItems: 'flex-start' }}>
                      <Image
                        style={{ width: 22, height: 23 }}
                        source={require('../../../assets/img/tab/foot_print/point_img.png')}
                      />
                    </View>
                    <Text style={{ color: '#25334a', fontFamily: 'WS-Medium', textAlign: 'center' }}>{`${totalReward} pts`}</Text>
                  </View>


                  <View style={{ flex: 0.37, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderColor: '#b7b7b7', borderWidth: 1, borderRadius: 30, height: 40, marginHorizontal: 15 }}>
                    <View style={{ backgroundColor: '#b7b7b7', width: 26, height: 26, borderRadius: 13, alignItems: 'flex-start' }}>
                      <Image
                        style={{ width: 22, height: 23 }}
                        source={require('../../../assets/img/tab/foot_print/point_img.png')}
                      />
                    </View>
                    <Text style={{ color: '#25334a', fontFamily: 'WS-Medium', textAlign: 'center' }}>{`${RedeemedPoint} pts`}</Text>
                  </View>

                </View>

                <View style={{ flex: 1, marginBottom: 15, flexDirection: 'row', borderTopColor: '#b7b7b7', borderTopWidth: 1, paddingVertical: 10, marginHorizontal: 20 }}>
                  <View style={{ flex: 0.64, alignItems: 'flex-end' }}>
                    <Text style={{ color: '#25334a', fontFamily: 'WS-SemiBold' }}>Remain Reward</Text>
                  </View>
                  <View style={{ flex: 0.25, alignItems: 'flex-end' }}>
                    <Text style={{ textAlign: 'center', fontFamily: 'WS-SemiBold', color: '#aecb3e' }}>{remainReward}</Text>
                  </View>
                </View>
              </View>
              :
              <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 35 }}>
                <Text style={{ textAlign: 'center', color: 'gray', fontFamily: 'WS-SemiBold', fontSize: 18 }}>No data found!</Text>
              </View>
            }

          </ScrollView>
        </View >
      );
    }
  }
}

