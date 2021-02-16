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
  StatusBar

} from 'react-native';
import {MaterialIcons } from '@expo/vector-icons';
import { Searchbar } from 'react-native-paper';
import ProductDetails from '../../../components/vendorList'
import Loader from '../../../navigation/AuthLoadingScreen'
import {CartCount} from '../../../components/cartCounter';
const api = require('../../../api/index');

export default class VendresListing extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    
    return {
      title: 'Vendors Listing',
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
    userToken: '',
    searchKey: '',
    value: 'second',
    cartCount:0,
    firstQuery: '',
    activeSlide: 0,
    venderData: [],
    loading: true,
    isMounted: false
  }

  componentDidMount = async () => {
    this.willFocusListener = await this.props.navigation.addListener('willFocus', async () => {
    await AsyncStorage.multiGet(['userToken', 'userId','userCartCount'], (err, res) => {
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
        });
        this.props.navigation.setParams({
          cartCount: this.state.cartCount,
        });
        this.fetchAPI();
      }
    })
  })
  }

  componentWillUnmount = () =>{
    this.willFocusListener.remove();
  }


  searchFilterFunction = searchKey => {
    this.setState({ searchKey }, () => {
      if (searchKey.length > 2) {
        this.fetchAPI()
      } else if (searchKey.length == 0) {
        this.fetchAPI()
      }
    })
  };


  fetchAPI = async () => {
    await api.vendorListing({
      userToken: this.state.userToken,
      searchKey: this.state.searchKey
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
            this.setState({ venderData: r.response_data, loading: false,isMounted:true })
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
    const { searchKey, venderData } = this.state;
    if (this.state.isMounted === false) {
      return (
        <View style={{ flex: 1, backgroundColor: '#334058' }}>
          <Loader loading={this.state.loading} navigation={this.props.navigation} />
        </View>
      )
    } else {
    return (
      <View style={{ flex: 1 }}>
        { Platform.OS == "android" &&
            <StatusBar translucent={true} backgroundColor={'transparent'} />}
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
          <View style={{ marginHorizontal: 10, paddingBottom: 20 }}>
            <Searchbar
              style={{ borderRadius: 30, margin: 10, elevation: 4 }}
              iconColor="#afafaf"
              inputStyle={{ fontSize: 16, fontFamily: 'WS-Light', }}
              placeholder="Search for Causes/Vendors"
              onChangeText={searchKey => this.searchFilterFunction(searchKey)}
              value={searchKey}
              autoCorrect={false}
              autoFocus={this.props.navigation.getParam('searchActive', false)}
            />
          </View>

          {/* <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginHorizontal: 15 }}>
            <View style={{ flex: 0.5, flexDirection: 'row', borderRightWidth: 1, borderRightColor: '#6d6d6d', justifyContent: 'space-between' }}>
              <View style={{ flex: 0.5, alignItems: 'flex-end', marginRight: 10 }}>
                <AntDesign
                  name="filter"
                  size={20}
                  color="#6d6d6d"
                />
              </View>
              <View style={{ flex: 0.5, alignItems: 'flex-start' }}>
                <Text style={{ color: "#6d6d6d", fontFamily: 'WS-Regular' }}>Filter</Text>
              </View>

            </View>

            <View style={{ flex: 0.3, flexDirection: 'row' }}>
              <View style={{ flex: 0.5, alignItems: 'flex-end', marginRight: 10 }}>
                <MaterialCommunityIcons
                  name="sort-descending"
                  size={20}
                  color="#6d6d6d"
                />
              </View>
              <View style={{ flex: 0.7, alignItems: 'flex-start' }}>
                <Text style={{ color: "#6d6d6d", fontFamily: 'WS-Regular' }}>Sort By</Text>
              </View>
            </View>
          </View> */}

          {/* <View style={{ marginHorizontal: 15, marginBottom: 20 }}>
            <Image
              style={{ width: '100%', height: 3 }}
              source={require('../../../assets/img/home/line.png')}
            />
          </View> */}
          {venderData.length > 0 ?

            <FlatList
              keyExtractor={item => item._id}
              data={this.state.venderData}
              extraData={this.state}
              numColumns={2}
              renderItem={({ item }) => {
                return (
                  venderData.length > 0 ?
                    <View>
                      <ProductDetails onClick={() => this.props.navigation.navigate('VendorsDetails', { itemId: item._id })} image={item.companyLogo} companyName={item.companyName} />
                    </View>
                    :
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                      <Text style={{ textAlign: 'center', color: 'gray', fontFamily: 'WS-SemiBold', fontSize: 18 }}>No data Found</Text>
                    </View>
                )
              }}
              removeClippedSubviews={false}
              bounces={false}
              showsHorizontalScrollIndicator={false}
            />
            :
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
              <Text style={{ textAlign: 'center', color: 'gray', fontFamily: 'WS-SemiBold', fontSize: 18 }}>No search result Found</Text>
            </View>
          }



        </ScrollView>
      </View >
    );
  }
}
}
