import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  Text,
  View,
  SafeAreaView,
  Picker,
  AsyncStorage,
  Alert,
  StyleSheet,
} from 'react-native';
import { AntDesign, EvilIcons,MaterialIcons } from '@expo/vector-icons';
import { RadioButton } from 'react-native-paper';
import { Searchbar } from 'react-native-paper';
import CustomButton1 from '../../../components/Button'
import RNPickerSelect from 'react-native-picker-select';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { sliderWidth, itemWidth } from '../../../constants/productDetails_Style/slideEntryStyle';
import { SliderEntry } from '../../../constants/productDetails_Style/slideEntry';
import styles from '../../../constants/productDetails_Style/indexStyle';
import Loader from '../../../navigation/AuthLoadingScreen'
import { CartCount } from '../../../components/cartCounter';

const api = require('../../../api/index');

const SLIDER_1_FIRST_ITEM = 0;

export default class ProductDetails extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      title: 'Product Details',
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
    value: 'first',
    firstQuery: '',
    pValue: [],
    userId: '',
    userToken: '',
    totalCartItem: '',
    favQty:undefined,
    selectedValue: '1',
    productId: '',
    productDetails: {},
    image: [],
    remainReward: '',
    slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
    loading: true,
    isMounted: false,
    isDirty: false
  }


  componentDidMount = async () => {
    this.willFocusListener = await this.props.navigation.addListener('willFocus', async () => {
      await AsyncStorage.multiGet(['userToken', 'userId', 'userCartCount', 'remainReward'], (err, res) => {
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
            totalCartItem: JSON.parse(res[2][1]),
            remainReward: JSON.parse(res[3][1]),
          },
            async () => {
              this.setState({ loading: true });
              this.props.navigation.setParams({
                cartCount: this.state.totalCartItem
              });
              await api.productDetail({
                userToken: this.state.userToken,
                productId: this.props.navigation.state.params.itemId
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
                  } else {
                    if (r.response_code === 2000) {
                      this.setState({ pValue: [] }, () =>{
                        for (let i = 1; i <= r.response_data.qty; i++) {
                          if(i > 1) {
                          this.state.pValue.push({label: i.toString(), value: i.toString()})
                         }
                        }
                      })
                      this.setState({
                        productDetails: r.response_data,
                        image: r.response_data.image,
                        loading: false,
                        isMounted: true
                      })
                    } else {
                      this.setState({ loading: false,isMounted:true});
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
            });
        }
      })
    })
  }


  addTocartfetchAPI = async () => {
    this.setState({ loading: true });
    const { selectedValue } = this.state
    await api.addTocart({
      userId: this.state.userId,
      userToken: this.state.userToken,
      productId: this.props.navigation.state.params.itemId,
      qty: selectedValue,
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
        } else {
          if (r.response_code === 2000) {
            await AsyncStorage.setItem('userCartCount', JSON.stringify(r.response_data.cartItem));
            this.props.navigation.setParams({
              cartCount: JSON.stringify(r.response_data.cartItem)
            });
            AsyncStorage.setItem('remainReward', JSON.stringify(r.response_data.remainReward))
            this.setState({ loading: false },() =>{
              this.props.navigation.navigate('ProductListing');
            })
            
          } else {
            this.setState({ loading: false,isMounted:true});
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

  // listner = () => {
  //   this.willFocusListener = this.props.navigation.addListener(
  //     'willFocus',
  //     async () => {
  //       this.props.navigation.setParams({
  //         cartCount: this.state.totalCartItem
  //       });
  //     }
  //   )
  // }

  onChange = (item) => {
    const { remainReward, productDetails, selectedValue } = this.state;
    console.log("REamin", remainReward);
    if (remainReward < (item * productDetails.point)) {
      Alert.alert('insufficient Points !');
    }
    else {
      this.setState({ selectedValue: item })
    }
    this.setState({ selectedValue: item })
  }

  inputRefs = {
    firstTextInput: null,
    favQty: null,
  };

  componentWillUnmount = () => {
    this.willFocusListener.remove();
  }


  _renderItemWithParallax({ item, index }, parallaxProps) {
    return (
      <SliderEntry
        imageName={item.imageUrl}
        parallax={true}
        parallaxProps={parallaxProps}
      />
    );
  }

  mainExample = () => {
    const { slider1ActiveSlide, image } = this.state;

    return (
      <View style={styles.exampleContainer}>
        <Carousel
          ref={c => this._slider1Ref = c}
          data={image}
          renderItem={this._renderItemWithParallax}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          hasParallaxImages={true}
          firstItem={SLIDER_1_FIRST_ITEM}
          inactiveSlideScale={0.94}
          inactiveSlideOpacity={0.7}
          activeSlideAlignment={'center'}
          inactiveSlideShift={20}
          containerCustomStyle={styles.slider}
          contentContainerCustomStyle={styles.sliderContentContainer}
          // loop={true}
          // loopClonesPerSide={2}
          // autoplay={true}
          // autoplayDelay={500}
          // autoplayInterval={3000}
          onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index })}
        />
        <Pagination
          dotsLength={image.length}
          activeDotIndex={slider1ActiveSlide}
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
    const placeholder = {
      label: '1',
      value: 1,
      color: '#9EA0A4',
    };
    const { firstQuery, productDetails, isDirty, remainReward, selectedValue } = this.state;
    const example1 = this.mainExample(1);
    const details = productDetails.description ? productDetails.description : ''
    const points = this.state.productDetails.point ? this.state.productDetails.point : ''
    const regex = /(<([^>]+)>)/ig;

    // console.log("PRoductDetails", productDetails);
    console.log('condition:', remainReward >= (selectedValue * productDetails.point));


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
            alwaysBounceVertical={true}
            keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 15 }}
          >
            {/* <View style={{ flex: 1,flexDirection:'row',alignItems: 'center', paddingHorizontal: 20, marginBottom: 5 }}>
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
          </View>

          <View style={{ marginHorizontal: 10, paddingBottom: 10 }}>
            <Searchbar
              style={{ borderRadius: 30, margin: 10, elevation: 4 }}
              iconColor="#afafaf"
              inputStyle={{ fontSize: 16, fontFamily: 'WS-Light', }}
              placeholder="Search for Causes/Vendors"
              onChangeText={query => { this.setState({ firstQuery: query }); }}
              value={firstQuery}
            />
          </View> */}
            {this.state.loading && <Loader show={this.state.loading} navigation={this.props.navigation} />}
            <View style={{ alignItems: 'center', marginBottom: 10 }}>
              <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>

                  {example1}
                </View>
              </SafeAreaView>
            </View>

            <View style={{ alignItems: 'center', marginHorizontal: 20, marginBottom: 20 }}>
              <Text style={{ marginBottom: 15, textAlign: 'center', color: '#25334a', fontFamily: 'WS-Medium', fontSize: 18 }}>{productDetails.name}</Text>
              <Text style={{ textAlign: 'center', color: '#22384d', fontFamily: 'WS-Medium' }}>{details.replace(regex, '')}</Text>
            </View>

            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderColor: '#b7b7b7', borderWidth: 1, borderRadius: 30, height: 50, width: '36%' }}>
                <View style={{ backgroundColor: '#b7b7b7', width: 32, height: 32, borderRadius: 13, alignItems: 'center' }}>
                  <Image
                    style={{ width: 28, height: 29 }}
                    source={require('../../../assets/img/tab/foot_print/point_img.png')}
                  />
                </View>
                <Text style={{ color: '#25334a', fontFamily: 'WS-Medium', textAlign: 'center', fontSize: 20 }}>{`${points} Pts`}</Text>
              </View>
            </View>
            {productDetails.qty > 0 ?
              <View>
                <View style={{ alignItems: 'center', justifyContent: 'center', borderColor: '#b7b7b7', borderWidth: 1, borderRadius: 30, marginHorizontal: '32%', height: 50, marginBottom: 20 }}>
                  {/* <Picker
                    style={{ paddingHorizontal: 40, alignItems: 'center', width: '80%' }}
                    selectedValue={this.state.selectedValue}
                    itemStyle={{ textAlign: 'center' }}
                    onValueChange={(item, i) => this.onChange(item)}
                    mode='dropdown'
                  >
                    {
                      this.state.pValue.map((item, i) => (
                        <Picker.Item key={i} label={`${item}`} value={`${item}`} />
                      ))
                    }
                  </Picker> */}

                  <RNPickerSelect
                    placeholder={placeholder}
                    items={this.state.pValue}
                    value={this.state.favQty}
                    placeholderTextColor='#000000'
                    onValueChange={(item, i) => this.onChange(item)}
                    onUpArrow={() => {
                      this.inputRefs.firstTextInput.focus();
                    }}
                    onDownArrow={() => {
                      this.inputRefs.favQty.togglePicker();
                    }}
                    style={pickerSelectStyles}
                    // value={ value }
                    useNativeAndroidPickerStyle={false}
                    Icon={() => {
                      return <MaterialIcons style={{ alignItems: 'center' }} name="arrow-drop-down" size={24} color="gray" />;
                    }}
                    ref={el => {
                      this.inputRefs.favQty = el;
                    }}
                  />

                </View>
                {remainReward >=
                  (selectedValue * productDetails.point) ?
                  <View style={{ alignItems: 'center', marginHorizontal: '20%' }}>
                    <CustomButton1
                      // disabled = {remainReward < ( selectedValue * productDetails.point) ? !isDirty : false}
                      onClick={this.addTocartfetchAPI}
                      text="Add to Cart"
                      font="vary"
                    />
                  </View>
                  :
                  <View style={{ alignItems: 'center', paddingVertical: 10, }}>
                    <Text style={{ textAlign: 'center', color: 'red', fontFamily: 'WS-SemiBold', fontSize: 16, textShadowOffset: { width: 2, height: 2 }, textShadowColor: 'black', textShadowRadius: 20, letterSpacing: 2 }}>insufficient Points !</Text>
                  </View>
                }
              </View>
              :
              <View style={{ alignItems: 'center', paddingVertical: 10, }}>
                <Text style={{ textAlign: 'center', color: 'red', fontFamily: 'WS-SemiBold', fontSize: 16, textShadowOffset: { width: 2, height: 2 }, textShadowColor: 'black', textShadowRadius: 20, letterSpacing: 2 }}>Out of Stock !</Text>
              </View>
            }
          </ScrollView>
        </View>
        </SafeAreaView>
      );
    }
  }
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    width: '80%',
    fontSize: 16,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: 'transparent',
    marginHorizontal:20,
    borderRadius: 4,
    color: 'black',
    paddingRight: '30%', // to ensure the text is never behind the icon
  },
  inputAndroid: {
    alignSelf: 'flex-start',
    width: '100%',
    marginHorizontal: 0,
    alignItems: 'flex-start',
    fontSize: 15,
    paddingLeft: 10,
    paddingVertical: 10,
    borderWidth: 0.5,
    borderColor: 'transparent',
    borderRadius: 8,
    color: '#000',
    paddingRight: '50%',
    // to ensure the text is never behind the icon

  },
  iconContainer: {
    top: 10,
    left: '60%',
  },
});