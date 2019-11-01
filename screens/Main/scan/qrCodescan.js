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
import * as Permissions from 'expo-permissions'
import { MaterialIcons,} from '@expo/vector-icons';
import { CustomButton } from '../../../components/Button'
import { CartCount } from '../../../components/cartCounter'

const { width } = Dimensions.get('window')
const qrSize = width * 0.7

export default class Scan extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      title: 'Scan',
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
    hasCameraPermission: null,
    scanned: false,
    modalVisible: false,
    data: {},
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
            data :'',
          }, () => {
            this.props.navigation.setParams({
              cartCount: this.state.cartCount,
            });
          });
        }
      })
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      this.setState({ hasCameraPermission: status === 'granted' });
      // this.getPermissionAsync();
    })
  }

  // getPermissionAsync = async () => {
  //   const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  //   if (status !== 'granted') {
  //     (Platform.OS === 'android' ? Alert : AlertIOS).alert('Sorry', 'we need camera roll permissions to make this work!');
  //   }

  // }

  componentWillUnmount = () => {
    this.willFocusListener.remove();
  }


  handleBarCodeScanned = ({ type, data }) => {
    if (!data) {
      alert('Invalid QR code')
    } else if (!data.includes("productcategory")) {
      alert('Invalid QR code')
    } else {
      this.setState({ scanned: true, data: JSON.parse(data) }, () => {
        this.setModalVisible(!this.state.modalVisible);
      });
    }
  };

  scanComplete = () => {
    const { data } = this.state
    this.props.navigation.navigate('BarCodeScan', {
      companyName: data.companyname,
      productCategory: data.productcategory,
      location: data.location,
    })
  }

  render() {
    const { data } = this.state;
    console.log('data:',data)
    return (
      <View style={{ flex: 1, backgroundColor: '#334259' }}>
        <ScrollView
          alwaysBounceVertical={true}
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10 }}
        >

            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 60, marginBottom: 40 }}>
              <Text style={{ textAlign: 'center', color: '#ffffff', fontFamily: 'WS-Medium', fontSize: 20 }}>Start Scanning QR Code</Text>
            </View>

            <TouchableOpacity
              style={{ alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#fff', backgroundColor: '#1e2c46', marginHorizontal: '30%', paddingVertical: 20, marginBottom: 30, }}
              onPress={() => { this.setModalVisible(!this.state.modalVisible); }}
            >
              <Image
                style={{ width: 80, height: 80 }}
                source={require('../../../assets/img/barcode_Scanner/scanning.png')}
              />
            </TouchableOpacity>


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
                  <Text style={styles.description}>Scan your QR code</Text>
                  <Image
                    style={styles.qr}
                    source={require('../../../assets/img/barcode_Scanner/scanning.png')}
                  />
                  <Text
                    onPress={() => { this.setModalVisible(!this.state.modalVisible); }}
                    style={styles.cancel}>
                    Cancel
               </Text>
                </BarCodeScanner>
              </View>
            </Modal>

            {data.productcategory ? <View style={{ marginBottom: 40, alignItems: 'center' }} >
              <Text style={{ textAlign: 'center', color: '#ffffff', fontFamily: 'WS-Regular', fontSize: 14, marginBottom: 5 }} >{`Company Name: ${data.companyname}`}</Text>
              <Text style={{ textAlign: 'center', color: '#ffffff', fontFamily: 'WS-Medium', fontSize: 18 }}>{`Bin Category: ${data.productcategory}`} </Text>
              <Text style={{ textAlign: 'center', color: '#ffffff', fontFamily: 'WS-Medium', fontSize: 18 }}>{`Location: ${data.location}`} </Text>
            </View> :
              <Text style={{ textAlign: 'center', color: '#ffffff', fontFamily: 'WS-Regular', fontSize: 16, marginBottom: 15, marginTop: -10 }}>Tap above to scan QR code</Text>
            }
            {/* 
          <View style={{ borderRadius: 30, borderWidth: 1, borderColor: '#fff', marginHorizontal: '25%', paddingVertical: 15, backgroundColor: '#1d283a', marginBottom: 40, alignItems: 'center' }}>
            <Text style={{ textAlign: 'center', color: '#fffeff', fontFamily: 'WS-Regular' }}>Point Achieve: 5</Text>
          </View> */}

            <View style={{ marginHorizontal: 30 }}>
              <CustomButton
                disabled={this.state.data.productcategory ? false : true}
                text="NEXT"
                onClick={this.scanComplete}
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
