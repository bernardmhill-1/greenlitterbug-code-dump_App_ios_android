import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Picker,
  AsyncStorage,
  Alert,
  Dimensions,
  Modal,
  StyleSheet,
  AlertIOS,
  StatusBar
} from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { AntDesign, Entypo, MaterialIcons } from '@expo/vector-icons';
import { CustomButton } from '../../../components/Button'
import Loader from './../../../navigation/AuthLoadingScreen'
import { CartCount } from '../../../components/cartCounter'
import RNPickerSelect from 'react-native-picker-select';

const api = require('../../../api/index');
const DeviceHeight = Dimensions.get('window').height;

export default class ProductUpload extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      title: 'Scan',
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
    productTypeList: [],
    image1: null,
    userToken: '',
    userId: '',
    cartCount: 0,
    place: '',
    productType: null,
    favcategory: undefined,
    categoryList: [],
    productImage: '',
    barCodeImage: '',
    company_name: '',
    product_Category: '',
    location_value: '',
    // barCode_data: '',
    remainReward: '',
    filename: '',
    type: '',
    modalFirstVisible: false,
    modalSecondVisible: false,
    loading: true,
    isMounted: false

  }


  productCategory = (productType) => {
    this.setState({ productType: productType })
  }

  inputRefs = {
    firstTextInput: null,
    favcategory: null,
  };

  setModalFirstVisible(visible) {
    this.setState({ modalFirstVisible: visible });
  }

  setModalSecondVisible(visible) {
    this.setState({ modalSecondVisible: visible });
  }

  componentDidMount = async () => {
    await AsyncStorage.multiGet(['userToken', 'userId', 'userCartCount', 'remainReward'], (err, res) => {
      if (err) {
        alert(err);
      } else {
        this.setState({
          userToken: JSON.parse(res[0][1]),
          userId: JSON.parse(res[1][1]),
          cartCount: JSON.parse(res[2][1]),
          remainReward: JSON.parse(res[3][1])
        })
      }
    })

    this.recyclingProductTypeList();
    const company_name = this.props.navigation.state.params.companyName;
    this.setState({ company_name });
    const product_Category = this.props.navigation.state.params.productCategory;
    this.setState({ product_Category })
    const location_value = this.props.navigation.state.params.location;
    this.setState({ location_value })
    // const barCode_data = this.props.navigation.state.params.BarCodeData;
    // this.setState({ barCode_data })
    this.props.navigation.setParams({
      cartCount: this.state.cartCount,
    });
    this.listner();
    this.getPermissionAsync()

  }

  listner = () => {
    this.willFocusListener = this.props.navigation.addListener(
      'willFocus',
      () => {
        this.props.navigation.navigate('Scan')
      }
    )
  }


  UNSAFE_componentWillUnmount() {
    this.willFocusListener.remove()
  }

  recyclingProductTypeList = async () => {
    let categoryMod = []
    await api.recyclingProductTypeList({
      userToken: this.state.userToken
    },
      (e, r) => {
        if (e) {
        	Alert.alert(
            'Error', e,
            [
              {
                text: 'OK', onPress: () => this.setState({ loading: false })
              }
            ]
          );
        } else {
          if (r.response_code == 2000) {
            this.setState({ productTypeList: r.response_data, loading: false, isMounted: true }, () => {
              r.response_data.map(cat => {
                categoryMod.push({ label: cat.productTypeName, value: cat._id})
              })
            })
            this.setState({ categoryList: categoryMod })
          } else {
            Alert.alert(
              'Request failed', r.response_message,
              [
                {
                  text: 'OK', onPress: () => this.setState({ loading: false })
                }
              ]
            );
          }
        }
      })
  }

  getPermissionAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      (Platform.OS === 'android' ? Alert : AlertIOS).alert('Sorry', 'we need camera roll permissions to make this work!');
    }

  }

  _pickImage1 = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1.0,
    });

    if (result.cancelled) {
      return;
    } else {
      this.setModalFirstVisible(!this.state.modalFirstVisible)
      this.setState({ image1: result.uri });
      let localUri = result.uri;
      let filename = localUri.split('/').pop();
      this.setState({ filename });
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      this.setState({ type });
    }

  };

  _pickImage2 = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'Images',
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1.0,
    });

    if (result.cancelled) {
      return;

    } else {
      this.setModalFirstVisible(!this.state.modalFirstVisible)
      this.setState({ image1: result.uri });
      let localUri = result.uri;
      let filename = localUri.split('/').pop();
      this.setState({ filename });
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      this.setState({ type });

    }
  };


  sendPushFromLocal = async (pushData) => {
    const message = {
      to: pushData.deviceToken,
      sound: 'default',
      title: 'Points added',
      body: pushData.body
    };
    console.log(message, "push token from barcode");

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
    const data = response._bodyInit;
    console.log(`Status & Response ID-> ${data}`);
  }



  fetchAPI2 = async () => {
    let formData = new FormData();
    formData.append('productImage', { uri: this.state.image1, name: this.state.filename, type: this.state.type });
    formData.append('barCodeImage', null);
    formData.append('user_id', this.state.userId);
    formData.append('productType', this.state.productType);
    formData.append('companyName', this.state.company_name);
    formData.append('binCode', this.state.product_Category);
    formData.append('place', this.state.location_value);
    formData.append('barCode',null)
    this.setState({ loading: true });

    await fetch('https://nodeserver.mydevfactory.com:1924/api/recyclingProductAdd', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        "cache-control": "no-cache",
        'Content-Type': 'multipart/form-data',
        'authtoken': this.state.userToken
      },
      body: formData
    })
      .then(response => response.json())
      .then(async (response) => {
        if (response.response_code === 2000) {

          const push = response.response_data.pushData
          this.sendPushFromLocal(push)
          await AsyncStorage.setItem('remainReward', JSON.stringify(response.response_data.remainReward));

          this.setState({ remainReward: this.state.remainReward }, () => {
            Alert.alert(
              'Success', 'Congratulations you have earned 5 points',
              [
                {
                  text: 'OK', onPress: () => this.setState({ loading: false, isMounted: true })
                }
              ]
            );
            this.props.navigation.navigate('Home')
            // this.setState({ loading: false, isMounted: true }, () => {
            //   this.props.navigation.navigate('Home')
            // })
          })

        } else {
          if (response.response_code === 4000) {
            this.setState({ loading: false })
            this.props.navigation.navigate('Login');
            //(Platform.OS === 'android' ? Alert : AlertIOS).alert('Token Expired', 'Please login again!');
            try {
              AsyncStorage.clear();
              this.setState({ loading: false });
            } catch (error) {
              // (Platform.OS === 'android' ? Alert : AlertIOS).alert(
              //   'Error', error,
              //   [
              //     {
              //       text: 'OK', onPress: () => this.setState({ loading: false})
              //     }
              //   ]
              // );
              this.props.navigation.navigate('Login');
            }

          } else {
            this.setState({ loading: false, isMounted: true })
            // (Platform.OS === 'android' ? Alert : AlertIOS).alert(
            //   'Failed', r.response_message,
            //   [
            //     {
            //       text: 'OK', onPress: () => this.setState({ loading: false })
            //     }
            //   ]
            // );
          }
        }
      })
  };

render() {
    const placeholder = {
      label: 'Select Product Type',
      value: null,
      color: '#9EA0A4',
      fontSize:8
    };
    const { categoryList,image1,productType } = this.state;
    if (this.state.isMounted === false) {
      return (
        <View style={{ flex: 1, backgroundColor: '#334058' }}>
          <Loader loading={this.state.loading} navigation={this.props.navigation} />
        </View>
      )
    } else {

      return (
        <View style={{ flex: 1, backgroundColor: '#334259' }}>
          { Platform.OS == "android" &&
            <StatusBar translucent={true} backgroundColor={'transparent'} />}
          {this.state.loading ? <Loader loading={false} navigation={this.props.navigation} /> : <Text></Text>}
          <ScrollView
            alwaysBounceVertical={true}
            keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 10 }}
          >
            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 15, marginBottom: 10 }}>
              <Text style={{ textAlign: 'center', color: '#ffffff', fontFamily: 'WS-Medium', fontSize: 16 }}>Product Upload</Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 15, justifyContent: 'center' }}>
              <View style={{ flex: 0.2, alignItems: 'center' }}>
                <AntDesign
                  name="select1"
                  size={20}
                  color="#ffffff"
                />
              </View>

              <View style={{ flex: 0.8, alignItems: 'flex-start' }}>
                {/* <Picker
                  style={{ width: '93%', color: '#ffffff' }}
                  selectedValue={this.state.productType}
                  onValueChange={this.updateUser}
                  mode='dropdown'
                >
                  <Picker.Item key="choose product type" label="Choose Product Type" value={null} />
                  {this.state.productTypeList.map((item, i) => (
                    <Picker.Item key={i} label={item.productTypeName} value={item._id} />

                  ))}
                </Picker>

                <Text style={{ color: '#2d2d2d', fontFamily: 'WS-Regular', fontSize: 16 }}>{this.state.user}</Text> */}
                <RNPickerSelect
                  placeholder={placeholder}
                  items={categoryList}
                  value={this.state.favcategory}
                  placeholderTextColor='#ffffff'
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
                style={{ position: 'absolute', right: '10%', width: 20, height: 20, borderRadius: 10, backgroundColor: '#eaeaea', alignContent: 'center' }}
              >
                <Entypo
                  name="chevron-small-down"
                  size={20}
                  color="#313131"
                />
              </TouchableOpacity>
            </View>

            <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
              <Image
                style={{ width: '100%', height: 3 }}
                source={require('../../../assets/img/home/line.png')}
              />
            </View>


            <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 30 }}>
              <Text style={{ textAlign: 'center', color: '#fff', fontFamily: 'WS-Medium', fontSize: 14, marginBottom: 20 }}>Upload image of the product</Text>

              {
                this.state.image1 !== null ?
                  <View style={{ borderWidth: 2, borderColor: '#3e9126', borderRadius: 10 }}>
                    <Image
                      source={{ uri: this.state.image1 }}
                      resizeMode='contain'
                      style={{ width: 140, height: 140, alignSelf: 'center', borderRadius: 10 }}
                    />
                    <View style={{ right: 5, top: 5, position: 'absolute' }}>
                      <TouchableOpacity
                        onPress={() => this.setState({ image1: null })}
                        activeOpacity={0.5}
                      >
                        <MaterialIcons
                          name='close'
                          size={25}
                          color='#c0c0c0'
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  :
                  <TouchableOpacity
                    onPress={() => this.setModalFirstVisible(!this.state.modalFirstVisible)}
                    style={{ borderColor: '#fff', borderWidth: 2, width: 100, height: 100, borderRadius: 50, borderStyle: "dashed", alignItems: 'center', justifyContent: 'center' }}
                  >
                    <View style={{ alignItems: 'center', backgroundColor: '#445066', borderRadius: 40, width: 80, height: 80, justifyContent: 'center', margin: 10 }}>
                      <Image
                        style={{ width: 31, height: 30, alignItems: 'center', justifyContent: 'center' }}
                        source={require('../../../assets/img/scan_product/upload.png')}
                      />
                    </View>
                  </TouchableOpacity>
              }
            </View>


            <Modal
              animationType='fade'
              transparent={true}
              visible={this.state.modalFirstVisible}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
              }}
            >
              <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} >
                <View style={{ flex: 1, backgroundColor: '#ffffff', marginTop: DeviceHeight * 0.35, marginBottom: DeviceHeight * 0.35, marginHorizontal: '20%', borderRadius: 5, padding: '3%' }}>
                  <View style={{ alignItems: 'flex-end' }}>
                    <TouchableOpacity
                      onPress={() => this.setModalFirstVisible(!this.state.modalFirstVisible)}
                      activeOpacity={0.5}
                    >
                      <MaterialIcons
                        name='close'
                        size={30}
                        color='#c0c0c0'
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: '2%' }}>
                    <TouchableOpacity
                      onPress={this._pickImage1}
                    >
                      <Text style={{ fontSize: 16, color: '#000', textAlign: 'center', marginBottom: 10, fontFamily: 'WS-Medium', padding: 5, borderWidth: 1, borderColor: 'gray', borderRadius: 20 }}>Open Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={this._pickImage2}
                    >
                      <Text style={{ fontSize: 16, color: '#000', textAlign: 'center', marginBottom: 10, fontFamily: 'WS-Medium', padding: 5, borderWidth: 1, borderColor: 'gray', borderRadius: 20 }}>Choose From Gallery</Text>
                    </TouchableOpacity>

                  </View>
                </View>
              </View>
            </Modal>



            <View style={{ marginHorizontal: 30 }}>
              <CustomButton
                text="SUBMIT"
                onClick={this.fetchAPI2}
                disabled={image1 == null || !productType  ? true : false}
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
    paddingHorizontal: 40,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 4,
    color: 'white',
    paddingRight: '30%', // to ensure the text is never behind the icon
  },
  inputAndroid: {
    alignSelf: 'flex-start',
    width: '100%',
    marginHorizontal: 0,
    alignItems: 'flex-start',
    fontSize: 15,
    paddingLeft: 10,
    color: 'white',
    paddingVertical: 5,
    borderWidth: 0.5,
    borderColor: 'transparent',
    borderRadius: 8,
    // paddingRight: '50%',
    // to ensure the text is never behind the icon

  },
  iconContainer: {
    top: 10,
    left: '80%',
  },
});