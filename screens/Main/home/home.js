import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AsyncStorage,
  Alert,
  SafeAreaView,
  FlatList,
  AlertIOS

} from 'react-native';
import { MaterialIcons, } from '@expo/vector-icons';
import { RadioButton } from 'react-native-paper';
import { Searchbar } from 'react-native-paper';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { sliderWidth1, sliderItemWidth } from '../../../constants/styles';
import { sliderWidth, itemWidth } from '../../../constants/productDetails_Style/slideEntryStyle';
import { SliderEntry1 } from '../../../constants/productDetails_Style/slideEntry';
import styles from '../../../constants/productDetails_Style/indexStyle';
import Card from '../../../components/card';
import CausesList from './causesList';
import Loader from '../../../navigation/AuthLoadingScreen'
import { CartCount } from '../../../components/cartCounter'
import { CheckBox } from 'react-native-elements'

const api = require('../../../api/index');


const SLIDER_1_FIRST_ITEM = 0;
const SLIDER_2_FIRST_ITEM = 0

export default class Home extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      title: 'Home',
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
    value: 'second',
    radio_1: false,
    radio_2: true,
    selectedType: '',
    activeSlide: 0,
    shortorder: 'Select Query Type',
    slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
    slider2ActiveSlide: SLIDER_2_FIRST_ITEM,
    causesdata: [],
    searchKey: '',
    userToken: '',
    loading: true,
    VendresList: [],
    productList: [],
    featuredAdsList: [],
    cartCount: 0,
    isMounted: false
  }

  changeRadio_1 = () => {
    if (this.state.radio_1) {
      this.setState({ radio_2: false, radio_1: true }, () => this.causeList())
    } else {
      this.setState({ radio_2: false, radio_1: true }, () => this.causeList())
    }
  }

  changeRadio_2 = () => {
    if (this.state.radio_2) {
      this.setState({ radio_2: true, radio_1: false })
    } else {
      this.setState({ radio_2: true, radio_1: false })
    }
  }

  searchFilterFunction = searchKey => {
    this.setState({ searchKey }, () => {
      if (searchKey.length > 2) {
        this.causeList()
        this.setState({ loading: false })
      } else if (searchKey.length == 0) {
        this.causeList()
      }
    })
  };

  updateUser = (shortorder) => {
    this.setState({ shortorder: shortorder })
  }

  componentDidMount = async () => {
    this.willFocusListener = await this.props.navigation.addListener('willFocus', async () => {
      await AsyncStorage.multiGet(['userToken', 'userId', 'userCartCount'], (err, res) => {
        if (err) {
          // alert(err);
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
          this.featuredVendor();
          this.featuredAdsList();
        }
      })
    })
    // this.willFocusListener = this.props.navigation.addListener(
    //   'willFocus',
    //    () => {
    //     this.props.navigation.setParams({
    //       cartCount: this.state.cartCount,
    //     });
    //   }
    // )
  }

  componentWillUnmount = () => {
    this.willFocusListener.remove();
  }


  causeList = async () => {
    await api.causeList({
      userToken: this.state.userToken,
      searchKey: this.state.searchKey
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
            this.setState({ causesdata: r.response_data, loading: false, isMounted: true })
          } else {
            this.setState({ loading: false, isMounted: true, causesdata: [] })

            //CATCH THE ERROR IN DEVELOPMENT 
            //    (Platform.OS === 'android' ? Alert : AlertIOS).alert(
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



  featuredVendor = async () => {
    await api.home({
      userToken: this.state.userToken,
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
          if (r.response_code === 2000) {
            this.setState({ VendresList: r.response_data.featuredVendor, productList: r.response_data.popularProduct, loading: false, isMounted: true }, () => {
              this.state.VendresList.push({ text: 'View More' })
              this.state.productList.push({ text: 'View More' })
            });
            this.causeList();
          } else {
            if (r.response_code === 4000) {
              // Alert.alert('Token Expired', 'Please login again!');
              try {
                AsyncStorage.clear();
                this.setState({ loading: false });
                this.props.navigation.navigate('Login');
              } catch (error) {
                this.setState({ loading: false }, () => {
                  this.props.navigation.navigate('Login');
                });
                //Alert.alert('Error', error);
              }
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
        }
      })
  }

  featuredAdsList = async () => {
    await api.featuredAdsList({
      userToken: this.state.userToken,
    },
      (e, r) => {
        if (e) {
          this.setState({ loading: false });
          //CATCH THE ERROR IN DEVELOPMENT 
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
            this.setState({ featuredAdsList: r.response_data, loading: false, isMounted: true }, () => {
              this.featuredVendor();
            })
          } else {
            if (r.response_code === 4000) {
              // Alert.alert('Token Expired', 'Please login again!');
              try {
                AsyncStorage.clear();
                this.setState({ loading: false });
                this.props.navigation.navigate('Login');
              } catch (error) {
                this.setState({ loading: false });
                // Alert.alert('Error', error);
                this.props.navigation.navigate('Login');
              }
            } else {
              this.setState({ loading: false });
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
        }
      })
  }

  _renderItemWithParallax = ({ item, index }, parallaxProps) => {
    //  console.log('nav:',item.content)
    return (
      <SliderEntry1
        key={index}
        imageName={item.image}
        title={item.content}
        onClick={() => this.props.navigation.navigate('VendorsDetails', { itemId: item.vendorId._id })}
        parallax={true}
        parallaxProps={parallaxProps}
      />
    );
  }



  mainExample = () => {
    const { slider2ActiveSlide, featuredAdsList } = this.state;
    return (
      <View style={styles.exampleContainer}>
        <Carousel
          ref={c => this._slider1Ref = c}
          data={featuredAdsList}
          renderItem={this._renderItemWithParallax}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          hasParallaxImages={true}
          firstItem={SLIDER_2_FIRST_ITEM}
          inactiveSlideScale={0.94}
          inactiveSlideOpacity={0.7}
          activeSlideAlignment={'center'}
          inactiveSlideShift={20}
          containerCustomStyle={styles.slider}
          contentContainerCustomStyle={styles.sliderContentContainer}
          loop={true}
          loopClonesPerSide={1}
          autoplay={true}
          autoplayDelay={500}
          autoplayInterval={3000}
          onSnapToItem={(index) => this.setState({ slider2ActiveSlide: index })}
        />
        <Pagination
          dotsLength={featuredAdsList.length}
          activeDotIndex={slider2ActiveSlide}
          containerStyle={styles.paginationContainer}
          dotColor={'gray'}
          dotStyle={styles.paginationDot}
          inactiveDotColor={"#d8d8d8"}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
          carouselRef={this._slider1Ref}
          tappableDots={!!this._slider1Ref}
          activeAnimationType={'spring'}

        />
      </View>
    );
  }



  render() {
    const { searchKey, causesdata } = this.state;
    const { slider1ActiveSlide } = this.state;
    const example1 = this.mainExample(1);
    const regex = /(<([^>]+)>)/ig;
    if (this.state.isMounted === false) {
      return (
        <View style={{ flex: 1, backgroundColor: '#334058' }}>
          <Loader loading={this.state.loading} navigation={this.props.navigation} />
        </View>
      )
    } else {
      return (
        <View style={{ flex: 1, marginTop: 5 }}>
          <ScrollView
            alwaysBounceVertical={true}
            keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 10 }}
          >

            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, marginBottom: 5 }}>
              {/* <RadioButton.Group
                color="red"
                onValueChange={value => { this.setState({ value, searchKey: '' }); this.causeList() }}
                value={this.state.value}

              > */}
              <View style={{ flex: 0.6, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 0.3, alignItems: 'flex-end' }}>
                  {/* <RadioButton color="#499828" value="first" /> */}
                  <CheckBox
                    checked={this.state.radio_1}
                    onPress={this.changeRadio_1}
                    checkedIcon='dot-circle-o'
                    uncheckedIcon='circle-o'
                    checkedColor='#499828'
                    size={26}
                    containerStyle={{ backgroundColor: 'transparent', borderWidth: 0, padding: 0 }}
                  />
                </View>
                <View style={{ flex: 0.7, alignItems: 'center' }}>
                  <Text>Recycling Instructions</Text>
                </View>
              </View>


              <View style={{ flex: 0.4, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 0.4, alignItems: 'flex-end' }}>
                  {/* <RadioButton color="#499828" value="second" /> */}
                  <CheckBox
                    checked={this.state.radio_2}
                    onPress={this.changeRadio_2}
                    checkedIcon='dot-circle-o'
                    uncheckedIcon='circle-o'
                    checkedColor='#499828'
                    size={26}
                    containerStyle={{ backgroundColor: 'transparent', borderWidth: 0, padding: 0 }}
                  />
                </View>
                <View style={{ flex: 0.4, alignItems: 'center' }}>
                  <Text>Vendors</Text>
                </View>
              </View>
              {/* </RadioButton.Group> */}
            </View>


            <View style={{ marginHorizontal: 10 }}>
              <Searchbar
                style={{ borderRadius: 30, margin: 10, elevation: 4 }}
                iconColor="#afafaf"
                inputStyle={{ fontSize: 16, fontFamily: 'WS-Light', }}
                placeholder="Search for Causes/Vendors"
                onChangeText={searchKey => this.searchFilterFunction(searchKey)}
                value={searchKey}
                autoCorrect={false}
                onFocus={() => this.props.navigation.navigate(this.state.radio_2 === true ? 'VendresListing' : '', { searchActive: true })}
              />
            </View>



            {this.state.radio_2 === true ?
              <View>
                {/* <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginHorizontal: 15 }}>
                  <View style={{ flex: 0.2, alignItems: 'center' }}>
                    <MaterialIcons
                      name="filter-none"
                      size={20}
                      color="#313131"
                    />
                  </View>
  
                  <View style={{ flex: 0.8, alignItems: 'flex-start' }}>
                    <Picker
                      style={{ width: '95%' }}
                      selectedValue={this.state.shortorder}
                      onValueChange={this.updateUser}
                      mode='dropdown'
                    >
                      <Picker.Item label="Choose Category" value="new" />
                      <Picker.Item label="Assigned" value="assigned" />
                      <Picker.Item label="Completed" value="completed" />
                    </Picker>
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
                </View> */}
                <View style={{ alignItems: 'center', marginBottom: 10 }}>
                  <SafeAreaView style={styles.safeArea}>
                    <View style={styles.container}>

                      {example1}
                    </View>
                  </SafeAreaView>
                </View>

                <View style={{ alignItems: 'center' }}>
                  <Text style={{ marginBottom: 20, letterSpacing: 3, fontSize: 16, fontWeight: '300', color: '#25334a', fontFamily: 'WS-Medium' }}>FEATURED VENDORS</Text>
                  <View style={styles.container1}>
                    <Carousel
                      contentContainerCustomStyle={{ overflow: 'hidden', width: sliderItemWidth * this.state.VendresList.length }}
                      data={this.state.VendresList}
                      hasParallaxImages={true}
                      renderItem={({ item, index }) => {
                        if (!('text' in item)) {
                          return <Card key={index} onClick={() => this.props.navigation.navigate('VendorsDetails', { itemId: item._id })} image={item.companyLogo} title={item.companyName} />
                        }
                        return <Card key={index} onClick={() => this.props.navigation.navigate(this.state.value === 'second' ? 'VendresListing' : '')} text={item.text} />
                      }}
                      sliderWidth={sliderWidth1}
                      itemWidth={sliderItemWidth}
                      activeSlideAlignment={'start'}
                      inactiveSlideScale={1}
                      inactiveSlideOpacity={1}
                      firstItem={SLIDER_1_FIRST_ITEM}
                      onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index })}
                    />

                    <View style={{ marginTop: -30 }}>
                      <Pagination
                        dotsLength={(this.state.VendresList.length) / 2}
                        activeDotIndex={slider1ActiveSlide}
                        // containerStyle={styles.paginationContainer}
                        dotColor={'gray'}
                        dotStyle={styles.paginationDot}
                        inactiveDotColor={"#d8d8d8"}
                        inactiveDotOpacity={0.4}
                        inactiveDotScale={0.6}
                        activeAnimationType={'spring'}

                      />
                    </View>
                  </View>
                </View>

                <View style={{ alignItems: 'center' }}>
                  <Text style={{ marginBottom: 20, letterSpacing: 3, fontSize: 18, fontWeight: '300', color: '#25334a', fontFamily: 'WS-Medium' }}>POPULAR PRODUCT</Text>
                  <View style={styles.container1}>
                    <Carousel
                      contentContainerCustomStyle={{ overflow: 'hidden', width: sliderItemWidth * this.state.productList.length }}
                      data={this.state.productList}
                      renderItem={({ item, index }) => {
                        if (!('text' in item)) {
                          return <Card key={index} onClick={() => this.props.navigation.navigate('ProductDetails', { itemId: item._id })} image={item.image} title={item.name} />
                        }
                        return <Card key={index} onClick={() => this.props.navigation.navigate('ProductListing')} text={item.text} />
                      }}
                      sliderWidth={sliderWidth1}
                      itemWidth={sliderItemWidth}
                      activeSlideAlignment={'start'}
                      inactiveSlideScale={1}
                      inactiveSlideOpacity={1}
                    />
                  </View>
                </View>
              </View>
              :
              causesdata.length > 0 ?
                <View style={{ marginTop: 10 }}>
                  {this.state.loading && <Loader show={this.state.loading} navigation={this.props.navigation} />}
                  <FlatList
                    keyExtractor={item => item._id}
                    data={this.state.causesdata}
                    renderItem={({ item }) => {
                      return (
                        <View>
                          <CausesList onClick={() => this.props.navigation.navigate('CausesDetails', { itemId: item._id })} title={item.title} desc={item.description.replace(regex, '')} />
                        </View>
                      )
                    }}
                    removeClippedSubviews={false}
                    bounces={false}
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
                :

                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                  <Text style={{ textAlign: 'center', color: 'gray', fontFamily: 'WS-SemiBold', fontSize: 18 }}>No search result Found</Text>
                </View>
            }

          </ScrollView>

        </View>
      );
    }
  }
}

