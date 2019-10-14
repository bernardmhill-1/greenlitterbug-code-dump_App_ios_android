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
import { RadioButton } from 'react-native-paper';
import { Searchbar } from 'react-native-paper';
import MyPoint from '../../components/myPoints'
import Loader from './../../navigation/AuthLoadingScreen'
import { CartCount } from '../../components/cartCounter'

const api = require('../../api/index');
var ts = new Date();

export default class Rewards extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      title: 'My Point',
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
            this.setState({ data: r.response_data.list, totalReward: r.response_data.totalReward, loading: false, isMounted: true })
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
    const { firstQuery, totalReward, data } = this.state;
    if (this.state.isMounted === false) {
      return (
        <View style={{ flex: 1, backgroundColor: '#334058' }}>
          <Loader loading={this.state.loading} navigation={this.props.navigation} />
        </View>
      )
    } else {
      return (
        <View style={{ flex: 1, marginTop: 10 }}>
          <ScrollView
            alwaysBounceVertical={true}
            keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 10 }}
          >
            {/* <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 5 }}>
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

            <View style={{ alignItems: 'center', marginBottom: 15, marginTop: 40 }}>
              <Image
                style={{ width: 108, height: 98 }}
                source={require('../../assets/img/tab/reward_point/reward_points.png')}
              />
            </View>

            <View style={{ borderBottomWidth: 1, borderBottomColor: '#b7b7b7', marginHorizontal: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }}>
                <Text style={{ color: '#25334a', fontFamily: 'WS-Medium' }}>Date</Text>
                <Text style={{ color: '#25334a', fontFamily: 'WS-Medium' }}>Place</Text>
                <Text style={{ color: '#25334a', fontFamily: 'WS-Medium' }}>Item</Text>
                <Text style={{ color: '#25334a', fontFamily: 'WS-Medium' }}>Points Collected</Text>
              </View>
            </View>
            {data.length > 0 ?
              <View>
                <View>
                  <FlatList
                    keyExtractor={item => item._id}
                    data={this.state.data}
                    renderItem={renderItem = ({ item }) => {
                      return (
                        <MyPoint date={new Date(item.createdAt).toLocaleDateString()} place={item.place} itemList={item.binCode} pointCollect={item.reward} />
                      )
                    }}
                    removeClippedSubviews={false}
                    bounces={false}
                    showsHorizontalScrollIndicator={false}
                  />
                </View>

                <View style={{ flex: 1, marginBottom: 15, flexDirection: 'row', borderTopColor: '#b7b7b7', borderTopWidth: 1, paddingVertical: 10, marginHorizontal: 20 }}>
                  <View style={{ flex: 0.64, alignItems: 'flex-end' }}>
                    <Text style={{ color: '#25334a', fontFamily: 'WS-SemiBold', marginBottom: 5 }}>Total Reward</Text>
                    <Text style={{ color: '#25334a', fontFamily: 'WS-SemiBold' }}>Remain Reward</Text>
                  </View>
                  <View style={{ flex: 0.25, alignItems: 'flex-end' }}>
                    <Text style={{ textAlign: 'center', fontFamily: 'WS-SemiBold', color: '#aecb3e', marginBottom: 5 }}>{totalReward.totalReward}</Text>
                    <Text style={{ textAlign: 'center', fontFamily: 'WS-SemiBold', color: '#aecb3e' }}>{totalReward.remainReward}</Text>
                  </View>
                </View>
              </View>
              :
              <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 35 }}>
                <Text style={{ textAlign: 'center', color: 'gray', fontFamily: 'WS-SemiBold', fontSize: 18 }}>No Collected Points</Text>
              </View>
            }

          </ScrollView>
        </View >
      );
    }
  }
}

