import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  AsyncStorage,
  Alert,
  FlatList,
  AlertIOS,
  StatusBar

} from 'react-native';
import { AntDesign, EvilIcons } from '@expo/vector-icons';
import Carousel from 'react-native-snap-carousel';
import { sliderWidth, itemWidth } from '../../../constants/productDetails_Style/slideEntryStyle';
import {SliderEntry} from '../../../constants/productDetails_Style/slideEntry';
import styles from '../../../constants/productDetails_Style/indexStyle';
import DownloadList from '../../../components/causesDetailDownload';
import Loader from '../../../navigation/AuthLoadingScreen';
import {CartCount} from '../../../components/cartCounter'

const api = require('../../../api/index');


const SLIDER_1_FIRST_ITEM = 0;

export default class CausesDetails extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      title: 'Cause Details',
      headerRight: (
         <CartCount count={params.cartCount} onClick = {() => navigation.navigate('myCartList')}/>
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
    pValue: '1',
    slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
    itemId: '',
    userToken: '',
    causesDetaildata: {},
    cartCount: 0,
    image: [],
    loading: true,
    isMounted: false,

  }

  updateUser = (pValue) => {
    this.setState({ pValue: pValue })
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
    const { image } = this.state;
    return (
      <View style={styles.exampleContainer}>
        <Carousel
          keyExtractor={item => item._id}
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
          // inactiveSlideShift={20}
          containerCustomStyle={styles.slider}
          contentContainerCustomStyle={styles.sliderContentContainer}
          // loop={true}
          // loopClonesPerSide={2}
          // autoplay={true}
          // autoplayDelay={500}
          // autoplayInterval={3000}
          onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index })}
        />
      </View>
    );
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
      }
    })
    const itemId = this.props.navigation.state.params.itemId;
    this.setState({ itemId }, () => {
    this.props.navigation.setParams({
        cartCount: this.state.cartCount,
      });
      this.fetchAPI();
    });
  })
  }


  componentWillUnmount = () =>{
    this.willFocusListener.remove();
  }

  fetchAPI = async () => {
    await api.causeDetail({
      userToken: this.state.userToken,
      causesId: this.state.itemId
    },
      (e, r) => {
        if(e) {
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
            
            this.setState({ causesDetaildata: r.response_data,image: r.response_data.image,loading: false,isMounted:true })

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
    const { firstQuery } = this.state;
    const example1 = this.mainExample(1);
    const regex =/(<([^>]+)>)/ig;
    const details = this.state.causesDetaildata.description ? this.state.causesDetaildata.description : ''

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
        { Platform.OS == "android" &&
            <StatusBar translucent={true} backgroundColor={'transparent'} />}
        <ScrollView
          alwaysBounceVertical={true}
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10 }}
        >

          <View style={{ alignItems: 'center', marginBottom: 10 }}>
            <SafeAreaView style={styles.safeArea}>
              <View style={styles.container}>
                {example1}
              </View>
            </SafeAreaView>
          </View>

          <View style={{ alignItems: 'center', marginHorizontal: 20, marginBottom: 25 }}>
            <Text style={{ textAlign: 'center', color: '#25334a', fontFamily: 'WS-Medium', fontSize: 18 }}>{this.state.causesDetaildata.title}</Text>
          </View>

          <View style={{ alignItems: 'center', marginBottom: 20, marginHorizontal: 25 }}>
            <Text style={{ marginBottom: 15, textAlign: 'center', color: '#25334a', fontFamily: 'WS-Medium', fontSize: 16 }}>Description</Text>
            <Text style={{ textAlign: 'left', color: '#22384d', fontFamily: 'WS-Regular' }}>{details.replace(regex, '')}</Text>
          </View>

          <View>
            <FlatList
              keyExtractor={item => item._id}
              data={this.state.causesDetaildata.document}
              renderItem={({ item }) => {
                return (
                  <View>
                    <DownloadList title={item.title} down={item.fileUrl} />
                  </View>
                )
              }}
              removeClippedSubviews={false}
              bounces={false}
              showsHorizontalScrollIndicator={false}
            />
          </View>

        </ScrollView>
      </View>
      </SafeAreaView>
    );
  }
}
}


