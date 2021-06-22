import React from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  AsyncStorage,
  SafeAreaView

} from 'react-native';
import { MaterialIcons, AntDesign, EvilIcons, } from '@expo/vector-icons';
import { CartCount } from '../../../components/cartCounter';
import Loader from '../../../navigation/AuthLoadingScreen'

export default class OrderConfirmation extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      title: 'Order Confirmation',
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
        <CartCount count={params.cartCount} onClick={() => navigation.navigate('Footprint')} />
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
    userId: '',
    userToken: '',
    cartCount: 0,
    order_confirm:{},
    isMounted:false
    
  }

  componentDidMount = async () => {
    this.willFocusListener = await this.props.navigation.addListener('willFocus', async () => {
      await AsyncStorage.multiGet(['userToken', 'userId', 'userCartCount'], (err, res) => {
        if (err) {
          // (Platform.OS === 'android' ? Alert : AlertIOS).alert(
          //   'Error', err,
          //   [
          //     {
          //       text: 'OK', onPress: () => this.setState({ isMounted:true})
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
              const order_confirm = this.props.navigation.state.params.placeOrder;
              this.setState({ order_confirm,isMounted:true });
            });
           
        }
      })
    })
  }

  render() {
    const {order_confirm} = this.state
    
    if (this.state.isMounted === false) {
      return (
        <View style={{ flex: 1, backgroundColor: '#334058' }}>
          <Loader loading={this.state.loading} navigation={this.props.navigation} />
        </View>
      )
    } else {
    return (
      <View style={{ flex: 1, backgroundColor: '#334259', alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Image
            style={{ width: 80, height: 80 }}
            source={require('../../../assets/img/order_confirm/confirm.png')}
          />
        </View>

        <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 30,marginHorizontal:10 }}>
          <Text style={{ color: '#ffffff', fontFamily: 'WS-Regular', marginBottom: 6, fontSize: 14,textAlign:'center' }}>Your order has been successfully</Text>
          <Text style={{ color: '#ffffff', fontFamily: 'WS-Regular', marginBottom: 6, fontSize: 14,textAlign:'center' }}>{`placed Order Id: ${order_confirm.orderId} To see more`}</Text>
          <Text style={{ color: '#ffffff', fontFamily: 'WS-Regular', fontSize: 14,textAlign:'center' }}>details go to My Orders</Text>
        </View>

        <View style={{ flexDirection: 'row', marginHorizontal: '32%', marginBottom: 30 }}>
          <View style={{ flex: 0.45, borderBottomWidth: 2, borderBottomColor: '#fff', borderStyle: 'solid' }}></View>
          <View style={{ flex: 0.1, borderBottomWidth: 2, borderBottomColor: '#fff', borderStyle: 'solid', marginHorizontal: 8 }}></View>
          <View style={{ flex: 0.45, borderBottomWidth: 2, borderBottomColor: '#fff', borderStyle: 'solid' }}></View>
        </View>

        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontFamily: 'WS-Light', fontSize: 24, textAlign: 'center' }}>Thank You for</Text>
          <Text style={{ color: '#fff', fontFamily: 'WS-Light', fontSize: 24, textAlign: 'center' }}>Shopping</Text>
        </View>
      </View >
    );
  }
}
}