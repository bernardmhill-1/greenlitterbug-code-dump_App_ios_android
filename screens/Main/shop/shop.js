import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  Picker,
  AsyncStorage,
  Alert,
  AlertIOS

} from 'react-native';
import { MaterialIcons, AntDesign, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { Searchbar } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import ProductDetails from '../../../components/productList'
import Loader from '../../../navigation/AuthLoadingScreen'
import { CartCount } from '../../../components/cartCounter'

const api = require('../../../api/index');

export default class ProductListing extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      title: 'Product',
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
    favcategory: undefined,
    activeSlide: 0,
    userToken: '',
    category: '',
    cartcount: 0,
    pageNo: '',
    productList: [],
    productCategoryList: [],
    categoryList: [],
    productType: null,
    totalPage: '1',
    searchKey: '',
    ordersArray: '',
    sort: 'desc',
    loading: true,
    isMounted: false,
  }

  productCategory = (productType) => {
    this.setState({ productType: productType }, () => {
      this.productList();
    })
  }

  inputRefs = {
    firstTextInput: null,
    favcategory: null,
  };

  sortArray = () => {
    const { sort } = this.state
    const orders = this.state.productList
    const ordersArray = sort == 'desc' ? orders.reverse() : orders
    this.setState({ ordersArray })
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
          this.productCategoryList();

        }
      })
    })
  }

  componentWillUnmount = () => {
    this.willFocusListener.remove();
  }


  searchFilterFunction = searchKey => {
    this.setState({ searchKey }, () => {
      if (searchKey.length > 2) {
        this.productList()
        this.setState({ loading: false })
      } else if (searchKey.length == 0) {
        this.productList()
      }
    })
  };

  productList = async () => {
    const { searchKey, userToken, productType, totalPage } = this.state
    await api.productList({
      userToken,
      searchKey,
      category: productType,
      totalPage
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
        } else {
          if (r.response_code == 2000) {
            this.setState({ productList: r.response_data.productList, totalPage: r.response_data.totalPage, loading: false })
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

  productCategoryList = async () => {
    let categoryMod = []
    await api.productCategoryList({
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
        } else {
          if (r.response_code == 2000) {
            this.setState({ productCategoryList: r.response_data, loading: false, isMounted: true }, () => {

              r.response_data.map(cat => {
                categoryMod.push({ label: cat.category, value: cat._id })
              })
            })
            this.setState({ categoryList: categoryMod })

            this.productList();
          } else {
            this.setState({ loading: false, isMounted: true });
            //CATCH THE ERROR IN DEVELOPMENT THIS IS PRODUCTION BUILD
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


  emptyProductComponent = () => {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 35 }}>
        <Text style={{ textAlign: 'center', color: 'gray', fontFamily: 'WS-SemiBold', fontSize: 18 }}>No Products Found !</Text>
      </View>
    );
  }

  render() {
    const placeholder = {
      label: 'All',
      value: null,
      color: '#9EA0A4',
    };
    const { searchKey, categoryList } = this.state;
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
            contentContainerStyle={{ paddingVertical: 10 }}
          >

            <View style={{ marginHorizontal: 10, paddingBottom: 10 }}>
              <Searchbar
                style={{ borderRadius: 30, margin: 10, elevation: 4 }}
                iconColor="#afafaf"
                inputStyle={{ fontSize: 16, fontFamily: 'WS-Light', }}
                placeholder="Search for Vendors"
                onChangeText={searchKey => this.searchFilterFunction(searchKey)}
                value={searchKey}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginHorizontal: 15 }}>
              <View style={{ flex: 0.2, alignItems: 'center' }}>
                <MaterialIcons
                  name="filter-none"
                  size={20}
                  color="#313131"
                />
              </View>

              <View style={{ flex: 0.8, alignItems: 'flex-start' }}>
                {/* <Picker
                  style={{ width: '95%' }}
                  selectedValue={this.state.productType}
                  onValueChange={this.productCategory}
                  mode='dropdown'
                >
                  <Picker.Item key="all" label="All" value={null} />
                  {this.state.productCategoryList.map((item, i) => (
                    <Picker.Item key={i} label={item.category} value={item._id} />

                  ))}
                </Picker> */}
                <RNPickerSelect
                  placeholder={placeholder}
                  items={categoryList}
                  value={this.state.favcategory}
                  placeholderTextColor='#000000'
                  onValueChange={this.productCategory}
                  onUpArrow={() => {
                    this.inputRefs.firstTextInput.focus();
                  }}
                  onDownArrow={() => {
                    this.inputRefs.favcategory.togglePicker();
                  }}
                  style={pickerSelectStyles}
                  // value={ value }
                  useNativeAndroidPickerStyle={false}
                  Icon={() => {
                    return <MaterialIcons style={{ alignItems: 'center' }} name="arrow-drop-down" size={24} color="gray" />;
                  }}
                  ref={el => {
                    this.inputRefs.favcategory = el;
                  }}
                />
              </View>

              <TouchableOpacity
                style={{ position: 'absolute', right: 28, width: 20, height: 20, borderRadius: 10, backgroundColor: '#eaeaea', alignContent: 'center' }}
              >
                <Entypo
                  name="chevron-small-down"
                  size={20}
                  color="#313131"
                />
              </TouchableOpacity>
            </View>

            <View style={{ marginHorizontal: 10, marginBottom: 20 }}>
              <Image
                style={{ width: '100%', height: 3 }}
                source={require('../../../assets/img/home/line.png')}
              />
            </View>


            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10, marginHorizontal: 15 }}>
              {/* <View style={{ flex: 0.5, flexDirection: 'row', borderRightWidth: 1, borderRightColor: '#6d6d6d', justifyContent: 'space-between' }}>
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

              </View> */}
              <TouchableOpacity

                style={{ flex: 0.3, flexDirection: 'row' }}
                onPress={this.sortArray}
              >
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
              </TouchableOpacity>
            </View>

            <View style={{ marginHorizontal: 16, marginBottom: 20 }}>
              <Image
                style={{ width: '100%', height: 3 }}
                source={require('../../../assets/img/home/line.png')}
              />
            </View>

            <View style={{ marginBottom: 15 }}>
              <FlatList
                keyExtractor={item => item._id}
                ListEmptyComponent={this.emptyProductComponent}
                data={this.state.productList}
                numColumns={2}
                extraData={this.state}
                renderItem={({ item }) => {
                  return (
                    <View>
                      <ProductDetails onClick={() => this.props.navigation.navigate('ProductDetails', { itemId: item._id })} image={item.image} productName={item.name} />
                    </View>
                  )
                }}
                removeClippedSubviews={false}
                bounces={false}
                showsHorizontalScrollIndicator={false}
              />
            </View>

          </ScrollView>
        </View >
      );
    }
  }
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 4,
    color: 'black',
    paddingRight: '30%', // to ensure the text is never behind the icon
  },
  inputAndroid: {
    width: '100%',
    fontSize: 15,
    paddingVertical: 5,
    borderWidth: 0.5,
    borderColor: 'transparent',
    borderRadius: 8,
    color: '#000',
    // to ensure the text is never behind the icon

  },
  iconContainer: {
    top: 10,
    // left:'80%',
    left: '80%',

  },
});