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
  StyleSheet,
  Linking,
  AlertIOS,
  StatusBar
} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { sliderWidth1, sliderItemWidth } from '../../../constants/styles';
import Card from '../../../components/card';
import Loader from '../../../navigation/AuthLoadingScreen'
import {CartCount} from '../../../components/cartCounter'

const api = require('../../../api/index');


const SLIDER_1_FIRST_ITEM = 0; 

export default class VendorsDetails extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      title: 'Vendor Details',
      headerRight: (
        <CartCount count={params.cartCount} onClick = {() => navigation.navigate('myCartList')}/>
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
    activeSlide: 0,
    slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
    userToken: '',
    loading: true,
    productList: [],
    vendorId: '',
    vendorsDetails: [],
    cartCount:0,
    loading: true,
    isMounted: false

  }

  _handleButtonPress = async () => {
    Linking.openURL(this.state.vendorsDetails.websiteUrl)
  }

  componentDidMount = async () => {
    this.willFocusListener = await this.props.navigation.addListener('willFocus', async () => {
    await AsyncStorage.multiGet(['userToken', 'userId','userCartCount'], (err, res) => {
      if (err) {
        //alert(err);
      } else {
        this.setState({
          userToken: JSON.parse(res[0][1]),
          userId: JSON.parse(res[1][1]),
          cartCount: JSON.parse(res[2][1])
        });
        this.homeFetchAPI();
        const vendorId = this.props.navigation.state.params.itemId;
        this.setState({ vendorId }, () => {
          this.props.navigation.setParams({
            cartCount: this.state.cartCount,
          });
        });
       }
    })
    this.fetchAPI();
  })
  }

  componentWillUnmount = () =>{
    this.willFocusListener.remove();
  }

  fetchAPI = async () => {
    await api.vendorDetail({
      userToken: this.state.userToken,
      vendorId: this.state.vendorId
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
        } else {
          if (r.response_code == 2000) {
            // Alert.alert('Success', r.response_message);
            this.setState({ vendorsDetails: r.response_data.detail, loading: false,isMounted:true })
            
          } else {
            this.setState({loading: false, isMounted: true})
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


  homeFetchAPI = async () => {
    await api.home({
      userToken: this.state.userToken,
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
        } else {
          if (r.response_code === 2000) {
            this.setState({ productList: r.response_data.popularProduct, loading: false }, () => {
              this.state.productList.push({ text: 'View More' })
            });
          } else {
            this.setState({loading: false, isMounted: true})
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
    const { vendorsDetails,productList } = this.state;
    if (this.state.isMounted === false) {
      return (
        <View style={{ flex: 1, backgroundColor: '#334058' }}>
          <Loader loading={this.state.loading} navigation={this.props.navigation} />
        </View>
      )
    } else {
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        { Platform.OS == "android" &&
            <StatusBar translucent={true} backgroundColor={'transparent'} />}
        <ScrollView
          alwaysBounceVertical={true}
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignContent: 'center',borderBottomColor:'	#009fff',borderStyle:'solid',marginBottom:20,paddingVertical:20,backgroundColor:'#009fff',marginTop:-10}}>
            <View style={{ flex: 0.3, alignItems:'center' }}>

              { vendorsDetails.companyLogo !== null ?
                <Image
                style={{ width: 60, height: 60,borderRadius:30 }}
                source={{uri:vendorsDetails.companyLogo}}
              />
              :

              <Image
              style={{ width: 60, height: 61, }}
              source={require('../../../assets/img/drawer/logo.png')}
            />
            }
           
            </View>
            <View style={{ flex: 0.7, alignItems: 'flex-start' }}>
              <Text style={{ textAlign: 'left', color: '#fff', fontFamily: 'WS-Regular', fontSize: 18,fontWeight:'bold' }}>{vendorsDetails.companyName}</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignContent: 'center', alignSelf: 'center', marginHorizontal: 10}}>
            <View style={{ flex: 0.4, alignItems: 'flex-start', marginLeft: 10 }}>
              <Text style={{ textAlign: 'center', color: 'gray', fontFamily: 'WS-SemiBold', fontSize: 16, marginBottom: 5 }}>Owner Name :</Text>
            </View>
            <View style={{ flex: 0.6, alignItems: 'flex-start' }}>
              <Text style={{ textAlign: 'left', color: 'gray', fontFamily: 'WS-Regular', fontSize: 14, marginBottom: 5 }}>{vendorsDetails.ownerName}</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignContent: 'center', alignSelf: 'center', marginHorizontal: 10 }}>
            <View style={{ flex: 0.4, alignItems: 'flex-start', marginLeft: 10 }}>
              <Text style={{ textAlign: 'center', color: 'gray', fontFamily: 'WS-SemiBold', fontSize: 16, marginBottom: 5 }}>Email :</Text>
            </View>
            <View style={{ flex: 0.6, alignItems: 'flex-start' }}>
              <Text style={{ textAlign: 'left', color: 'gray', fontFamily: 'WS-Regular', fontSize: 14, marginBottom: 5 }}>{vendorsDetails.email}</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignContent: 'center', alignSelf: 'center', marginHorizontal: 10 }}>
            <View style={{ flex: 0.4, alignItems: 'flex-start', marginLeft: 10 }}>
              <Text style={{ textAlign: 'center', color: 'gray', fontFamily: 'WS-SemiBold', fontSize: 16, marginBottom: 5 }}>phone No :</Text>
            </View>
            <View style={{ flex: 0.6, alignItems: 'flex-start' }}>
              <Text style={{ textAlign: 'left', color: 'gray', fontFamily: 'WS-Regular', fontSize: 14, marginBottom: 5 }}>{vendorsDetails.phoneNo}</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignContent: 'center', alignSelf: 'center', marginHorizontal: 10 }}>
            <View style={{ flex: 0.4, alignItems: 'flex-start', marginLeft: 10 }}>
              <Text style={{ textAlign: 'center', color: 'gray', fontFamily: 'WS-SemiBold', fontSize: 16, marginBottom: 5 }}>Address :</Text>
            </View>
            <View style={{ flex: 0.6, alignItems: 'flex-start' }}>
              <Text style={{ textAlign: 'left', color: 'gray', fontFamily: 'WS-Regular', fontSize: 14, marginBottom: 5 }}>{vendorsDetails.address}</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignContent: 'center', alignSelf: 'center', marginHorizontal: 10 }}>
            <View style={{ flex: 0.4, alignItems: 'flex-start', marginLeft: 10 }} >
              <Text style={{ textAlign: 'center', color: 'gray', fontFamily: 'WS-SemiBold', fontSize: 16, marginBottom: 5 }}>Website Url :</Text>
            </View>
            <TouchableOpacity style={{ flex: 0.6, alignItems: 'flex-start' }}
              onPress ={this._handleButtonPress}
            >
              <Text style={{ textAlign: 'left', color: 'blue', fontFamily: 'WS-Regular', fontSize: 14,textDecorationLine:"underline",textDecorationColor:'blue', marginBottom: 5 }}>{vendorsDetails.websiteUrl}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', marginHorizontal:10, marginBottom: 20 }}>
            <View style={{ flex: 0.4, alignItems: 'flex-start', marginLeft: 10 }}>
              <Text style={{ textAlign: 'center', color: 'gray', fontFamily: 'WS-SemiBold', fontSize: 16, marginBottom: 5 }}>description :</Text>
            </View>
            <View style={{ flex: 0.6, alignItems: 'flex-start' }}>
              <Text style={{ textAlign: 'left', color: 'gray', fontFamily: 'WS-Regular', fontSize: 14, marginBottom: 5 }}>{vendorsDetails.description}</Text>
            </View>
          </View>


          <View style={{ alignItems: 'flex-start', alignItems: 'center', justifyContent: 'center', marginBottom: 25 }}>
            <Text style={{ fontSize: 16, fontWeight: '300', color: '#25334a', fontFamily: 'WS-Medium', borderBottomColor: 'gray', borderBottomWidth: 1, paddingVertical: 5, letterSpacing: 3 }}>PRODUCTS </Text>
          </View>

          <View style={{ alignItems: 'center' }}>
            <View style={styles.container}>
              <Carousel
                contentContainerCustomStyle={{ overflow: 'hidden', width: sliderItemWidth * this.state.productList.length }}
                data={productList}
                hasParallaxImages={true}
                renderItem={({ item, index }) => {
                  if (!('text' in item)) {
                    return <Card key={index} onClick={() => this.props.navigation.navigate('ProductDetails', { itemId: item._id })} image={item.image} title={item.name} />
                  }
                  return <Card key={index} onClick={() => this.props.navigation.navigate('VendresListing')} text={item.text} />
                }}
                sliderWidth={sliderWidth1}
                itemWidth={sliderItemWidth}
                activeSlideAlignment={'start'}
                inactiveSlideScale={1}
                inactiveSlideOpacity={1}
                firstItem={SLIDER_1_FIRST_ITEM}
                onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index })}
              />
            </View>
          </View>

        </ScrollView>
      </View >
    );
  }
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 56,
    backgroundColor: '#ffffff',

  },
  paginationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 0
  },
  paginationContainer: {
    // paddingVertical: 8
  },
})