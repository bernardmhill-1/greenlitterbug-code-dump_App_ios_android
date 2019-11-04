import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AsyncStorage,
  Button,
  Dimensions,
  Modal,
  Alert,
  AlertIOS,

} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { CustomButton } from '../../../components/Button'
import { CartCount } from '../../../components/cartCounter'

const api = require('../../../api/index');
const { width } = Dimensions.get('window')
const qrSize = width * 0.7

export default class BarCodeScan extends React.Component {
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
    company_name: '',
    product_Category: '',
    location_value: '',
    hasCameraPermission: null,
    scanned: false,
    modalVisible: false,
    data: '',
    barCodeDetails: '',
    cartCount: 0
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  componentDidMount = async () => {
    this.willFocusListener = await this.props.navigation.addListener('willFocus', async () => {
      await AsyncStorage.multiGet(['userToken', 'userId', 'userCartCount'], (err, res) => {
        if (err) {
          alert(err);
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
        }
      })
      const company_name = this.props.navigation.state.params.companyName;
      this.setState({ company_name });
      const product_Category = this.props.navigation.state.params.productCategory;
      this.setState({ product_Category })
      const location_value = this.props.navigation.state.params.location;
      this.setState({ location_value })
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      this.setState({ hasCameraPermission: status === 'granted' });
      this.getPermissionAsync();
    })
  }

  getPermissionAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      (Platform.OS === 'android' ? Alert : AlertIOS).alert('Sorry', 'we need camera roll permissions to make this work!');
    }

  }

  componentWillUnmount = () => {
    this.willFocusListener.remove();
  }


  handleBarCodeScanned =({type, data}) => { 
    console.log("TYPE", type);
    
    if (!data) {
      alert('Invalid BAR code')
    } else {
      const os = Platform.OS
      const checkType = type.toString().includes('EAN-13')
      if(checkType && os == 'ios') {
        data =  data.substr(1)
        console.log("BARCODE", data);
      }
      this.setState({ scanned: true, data:data},() => {
        this.setModalVisible(!this.state.modalVisible);
        this.searchRecyclingProduct();
      });
    }
  };

  // scanComplete = () => {
  //   const { data, company_name, product_Category, location_value } = this.state
  //   this.props.navigation.navigate('ProductUpload', {
  //     companyName: company_name,
  //     productCategory: product_Category,
  //     location: location_value,
  //     BarCodeData: data
  //   })
  // }

  skipScan = () => {
    const { company_name, product_Category, location_value } = this.state
    this.props.navigation.navigate('ProductUpload', {
      companyName: company_name,
      productCategory: product_Category,
      location: location_value,
    })
  }


  searchRecyclingProduct = async () => {
    const { data } = this.state
    console.log('barcodeData', data)
    await api.searchRecyclingProduct({
      userToken: this.state.userToken,
      barCode: data
    },
      (e, r) => {
        if (e) {
          // this.setState({loading: false, isMounted: true})
          (Platform.OS === 'android' ? Alert : AlertIOS).alert(
            'Error', e,
            [
              {
                text: 'OK', onPress: () => this.setState({ loading: false })
              }
            ]
          );
        } else {
          if (r.response_code == 2000) {
            this.setState({ barCodeDetails: r.response_data, loading: false, isMounted: true })
          } else {
            // this.setState({loading: false, isMounted: true})
            (Platform.OS === 'android' ? Alert : AlertIOS).alert(
              'Info', r.response_message,
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



  recyclingProductAdd = async () => {
    const {barCodeDetails} = this.state
    let formData = new FormData();
    formData.append('productImage', null);
    formData.append('barCodeImage', null);
    formData.append('user_id', this.state.userId);
    formData.append('productType', null);
    formData.append('companyName', this.state.company_name);
    formData.append('binCode', this.state.product_Category);
    formData.append('place', this.state.location_value);
    formData.append('barcodeId', barCodeDetails._id)
    this.setState({ loading: true });

    await fetch('https://nodeserver.brainiuminfotech.com:1924/api/recyclingProductAdd', {
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
            (Platform.OS === 'android' ? Alert : AlertIOS).alert(
              'Success', 'Congratulations you have earned 5 points',
              [
                {
                  text: 'OK', onPress: () => this.setState({ loading: false, isMounted: true })
                }
              ]
            );
            console.log('resycling add data:', response.response_data)
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
    const { data, barCodeDetails,scanned } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: '#334259' }}>
        <ScrollView
          alwaysBounceVertical={true}
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10 }}
        >
          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 40, marginBottom: 40 }}>
            <Text style={{ textAlign: 'center', color: '#ffffff', fontFamily: 'WS-Medium', fontSize: 20 }}>Start Scanning Bar Code</Text>
          </View>

        {!barCodeDetails.image && 
          <TouchableOpacity
            style={{ alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#fff', backgroundColor: '#1e2c46', marginHorizontal: '20%', paddingVertical: 25, marginBottom: 30, }}
            onPress={() => { this.setModalVisible(!this.state.modalVisible); }}
          >
            <Image
              style={{ width: 180, height: 120 }}
              source={require('../../../assets/img/barcode_Scanner/bar_code.png')}
            />
          </TouchableOpacity>
        }


          <Modal
            animationType='fade'
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}
          > 
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }} >
              <BarCodeScanner
                onBarCodeScanned={this.handleBarCodeScanned}
                style={[StyleSheet.absoluteFill, styles.container]}>
                <Text style={styles.description}>Scan your Bar code</Text>
                <Image
                  style={styles.qr}
                  source={require('../../../assets/img/barcode_Scanner/bar_code.png')}
                />
                <Text
                  onPress={() => { this.setModalVisible(!this.state.modalVisible); }}
                  style={styles.cancel}>
                  Cancel
               </Text>
              </BarCodeScanner>
            </View>
          </Modal>

          {barCodeDetails.barcode ? 
           <View style={{ marginBottom: 40, alignItems: 'center' }} >
            <View style={{ borderWidth: 2, borderColor: '#3e9126', borderRadius: 10,marginHorizontal:20 }}>
              <Image
                source={{ uri:barCodeDetails.image }}
                resizeMode="cover"
                style={{ width:215, height:150, alignSelf: 'center', borderRadius: 10 }}
              />
            </View>
            <Text style={{ textAlign: 'center', color: '#ffffff', fontFamily: 'WS-Medium', fontSize: 14,marginTop:13,marginBottom:5 }}>{`Recycle BAR Code: ${barCodeDetails.barcode}`} </Text>
            <Text style={{ textAlign: 'center', color: '#ffffff', fontFamily: 'WS-Medium', fontSize: 14,marginBottom:5 }}>{`Product Name : ${barCodeDetails.name}`} </Text>
            <Text style={{ textAlign: 'center', color: '#ffffff', fontFamily: 'WS-Medium', fontSize: 14, }}>{`product Type: ${barCodeDetails.RecyclingProductType}`} </Text>
          </View> :
            <Text style={{ textAlign: 'center', color: '#ffffff', fontFamily: 'WS-Regular', fontSize: 16, marginBottom: 15, marginTop: -10 }}>Tap above to scan Bar code</Text>
          }
          <View>
            
          </View>
         {
           barCodeDetails.image ?
           <View style={{ marginHorizontal: 30, marginHorizontal: '20%', marginBottom: 15 }}>
           <CustomButton
             // disabled={this.state.data ? false : true}
             text="Re-Scan"
             onClick={() => this.setState({barCodeDetails: ''})}
           />
         </View>

         :
        <>
       <View style={{ alignItems: 'center', marginBottom: 15, marginHorizontal: 22 }}>
         <Text style={{ textAlign: 'center', color: '#fffeff', fontFamily: 'WS-Regular' }}>If item does not have bar code click SKIP to upload image</Text>
       </View>

       <View style={{ marginHorizontal: 30, marginHorizontal: '20%', marginBottom: 15 }}>
         <CustomButton
           // disabled={this.state.data ? false : true}
           text="SKIP"
           onClick={this.skipScan}
         />
       </View>
       </>
         }

          <View style={{ marginHorizontal: 30 }}>
            <CustomButton
              disabled={this.state.barCodeDetails ? false : true}
              text="Submit"
              onClick={this.recyclingProductAdd}
            />
          </View>

        </ScrollView>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  qr: {
    marginTop: '20%',
    marginBottom: '20%',
    width: qrSize,
    height: qrSize,
  },
  description: {
    fontSize: width * 0.09,
    marginTop: '10%',
    textAlign: 'center',
    width: '70%',
    color: 'white',
  },
  cancel: {
    fontSize: width * 0.05,
    textAlign: 'center',
    width: '70%',
    color: 'white',
  },

})