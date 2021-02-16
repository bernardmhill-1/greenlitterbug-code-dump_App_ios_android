import React from 'react'
import {
  View,
  Text,
  ScrollView,
  Platform,
  Image,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  Alert,
  AlertIOS,
  StatusBar
} from "react-native";

import { SimpleLineIcons, MaterialIcons } from '@expo/vector-icons';
import CustomButton from '../../../components/Button'
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import Loader from './../../../navigation/AuthLoadingScreen'

const api = require('../../../api/index');

export default class EditProfile extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: 'Edit Profile',
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
    fName: '',
    lName: '',
    pNumber: '',
    userToken: '',
    userId: '',
    image: null,
    filename: '',
    type: '',
    data: '',
    loading: true,
    isDirty: false,
    firstError: '',
    lastError: '',
    phonError: '',
    isMounted: false

  };

  onChange = (name, value) => {
    let reg =/^[A-Za-z0-9 ]+$/;
    

    if (this.state.fName == '' && this.state.lName == '' && this.state.pNumber == '') {
      this.setState({ emailError: 'All fields are Requried' })
    } else {
      this.setState({ emailError: '' })
    }
    if (name === 'fName' && (!reg.test(value)) || value === '') {
      this.setState({ firstError: 'special character does not allowed' })
    } else if (name === 'fName' && value !== '') {
      this.setState({ firstError: '' })
    }
    if (name === 'lName' && (!reg.test(value)) || value === '') {
      this.setState({ lastError: 'special character does not allowed' })
    } else if (name === 'lName' && value !== '') {
      this.setState({ lastError: '' })
    }
    if (name === 'pNumber' && (value.length < 10 || value === '')) {
      this.setState({ phonError: 'Phone No Should be  10 Digits long' })
    } else if (name === 'pNumber' && (value.length < 10 || value !== '')) {
      this.setState({ phonError: '' })
    }
    this.setState({ [name]: value, isDirty: true })

  }


  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'Images',
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1.0,
    });

    if (result.cancelled) {
      return;
    } else {
      this.setState({ image: result.uri })
      let localUri = result.uri;
      let filename = localUri.split('/').pop();
      this.setState({ filename });
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      this.setState({ type }, () => {
        this.editProfileAPI();
      });
    }
  };

  componentDidMount = async () => {
    await AsyncStorage.multiGet(['userToken', 'userId'], (err, res) => {
      if (err) {
        Alert.alert(
          'Error', err,
          [
            {
              text: 'OK', onPress: () => this.setState({ loading: false })
            }
          ]
        );
      } else {
        this.setState(prevState => ({
          userToken: JSON.parse(res[0][1]),
          userId: JSON.parse(res[1][1])
        }));
      }
    })
    this.viewProfileDetails()
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      (Platform.OS === 'android' ? Alert : AlertIOS).alert('Sorry', 'we need camera roll permissions to make this work!');
    }

  }

  fetchAPI = async () => {
    await api.editProfile({
      userToken: this.state.userToken,
      userId: this.state.userId,
      firstName: this.state.fName,
      lastName: this.state.lName,
      phoneNo: this.state.pNumber
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
            this.setState({ loading: false })
            Alert.alert('Success', r.response_message);
            this.setData(r);
          } else {
            Alert.alert(
              'Request failed', JSON.stringify(r.response_message),
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

  editProfileAPI = async () => {
    let formData = new FormData();
    formData.append('image', { uri: this.state.image, name: this.state.filename, type: this.state.type });
    formData.append('_id', this.state.userId);
    await api.editProfileImage({
      formData: formData,
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
          	Alert.alert(
              'Success', JSON.stringify(r.response_message),
              [
                {
                  text: 'OK', onPress: () => this.setState({ loading: false })
                }
              ]
            );
          } else {
            Alert.alert(
              'Request failed', JSON.stringify(r.response_message),
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


  viewProfileDetails = async () => {
    await api.viewProfile({
      userId: this.state.userId,
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
            this.setState({
              fName: r.response_data.first_name,
              image: r.response_data.profile_image,
              lName: r.response_data.last_name,
              pNumber: r.response_data.phone_no,
              loading: false,
              isMounted: true
            })
            //	Alert.alert('Success', r.response_message);
          } else {
          	Alert.alert(
              'Request failed', JSON.stringify(r.response_message),
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

  setData = async (r) => {
    try {
      await AsyncStorage.multiSet([
        ['firstName', JSON.stringify(this.state.fName)],
        ['lastName', JSON.stringify(this.state.lName)],
        ['userPhoneNo', JSON.stringify(this.state.pNumber)]
      ])
      this.props.navigation.navigate('');
    } catch (e) {
      Alert.alert(
        'Error', error,
        [
          {
            text: 'OK', onPress: () => this.setState({ loading: false })
          }
        ]
      );
    }
  }

  render() {
    const { firstError, lastError, phonError, isDirty } = this.state;
    return (
      <View style={{ flex: 1, marginHorizontal: 50 }}>
        { Platform.OS == "android" &&
            <StatusBar translucent={true} backgroundColor={'transparent'} />}
        <ScrollView
          alwaysBounceVertical={true}
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 15 }}
        >
          {this.state.loading && <Loader loading={this.state.loading} />}
          {
            this.state.image !== null ?
              <View style={{ marginBottom: 40, marginTop: 50, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ width: 110, height: 110, borderRadius: 55, borderWidth: 2, borderColor: '#3e9126', alignItems: 'center', justifyContent: 'center' }}>
                  <Image
                    source={{ uri: this.state.image }}
                    resizeMode='cover'
                    style={{ width: 100, height: 100, borderRadius: 50, alignSelf: 'center', }}
                  />
                  <View style={{ right: 5, top: 8, position: 'absolute', backgroundColor: '#3e9126', width: 20, height: 20, borderRadius: 10, alignItems: 'center' }}>
                    <TouchableOpacity
                      onPress={() => this.setState({ image: null })}
                      activeOpacity={0.5}
                    >
                      <MaterialIcons
                        name='close'
                        size={20}
                        color='#ffffff'
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View> :
              <TouchableOpacity style={{ alignItems: 'center', marginBottom: 40, marginTop: 50 }}
                onPress={this._pickImage}
                activeOpacity={0.7}

              >
                <Image
                  style={{ width: 113, height: 96 }}
                  source={require('../../../assets/img/edit_profile/edit_profile.png')}
                />

              </TouchableOpacity>
          }
          <View style={{ marginBottom: 30 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 30, borderColor: '#d6d6d6', borderWidth: 1, marginBottom: 10 }}>
              <View style={{ flex: 0.15, alignItems: 'flex-end' }}>
                <SimpleLineIcons
                  name="user"
                  size={20}
                  color="#d6d6d6"
                />
              </View>
              <View style={{ flex: 0.85 }}>
                <TextInput
                  style={{ paddingVertical: 10, paddingHorizontal: 20, fontSize: 14, fontFamily: 'WS-Light' }}
                  onChangeText={(fName) => this.onChange('fName', fName)}
                  value={this.state.fName}
                  placeholder="First Name"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType='givenName'
                  selectTextOnFocus={true}
                  spellCheck={false}
                  keyboardType={'default'}
                />
              </View>
            </View>

            <Text style={{ textAlign: 'center', color: 'red', fontFamily: 'WS-Regular', fontSize: 14,marginBottom:5 }}>{this.state.firstError}</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 30, borderColor: '#d6d6d6', borderWidth: 1, marginBottom: 5 }}>
              <View style={{ flex: 0.15, alignItems: 'flex-end' }}>
                <SimpleLineIcons
                  name="user"
                  size={20}
                  color="#d6d6d6"
                />
              </View>
              <View style={{ flex: 0.85 }}>
                <TextInput
                  style={{ paddingVertical: 10, paddingHorizontal: 20, fontSize: 14, fontFamily: 'WS-Light' }}
                  onChangeText={(lName) => this.onChange('lName', lName)}
                  value={this.state.lName}
                  placeholder="Last Name"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType='givenName'
                  selectTextOnFocus={true}
                  spellCheck={false}
                  keyboardType={'default'}

                />
              </View>
            </View>

            <Text style={{ textAlign: 'center', color: 'red', fontFamily: 'WS-Regular', fontSize: 14,marginVertical:5 }}>{this.state.lastError}</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderColor: '#d6d6d6', borderWidth: 1, borderRadius: 30, marginBottom: 5 }}>
              <View style={{ flex: 0.15, alignItems: 'flex-end' }}>
                <SimpleLineIcons
                  name="phone"
                  size={25}
                  color="#d6d6d6"
                />
              </View>
              <View style={{ flex: 0.85 }}>
                <TextInput
                  style={{ paddingVertical: 10, paddingHorizontal: 20, fontSize: 14, fontFamily: 'WS-Light' }}
                  value={this.state.pNumber}
                  onChangeText={(pNumber) => this.onChange('pNumber', pNumber)}
                  placeholder="Phone No."
                  autoCapitalize='none'
                  autoCorrect={false}
                  textContentType='telephoneNumber'
                  selectTextOnFocus={true}
                  spellCheck={false}
                  keyboardType={'number-pad'}
                  maxLength={10}
                  returnKeyType='done'
                />
              </View>
            </View>
            <Text style={{ textAlign: 'center', color: 'red', fontFamily: 'WS-Regular', fontSize: 14 }}>{this.state.phonError}</Text>
          </View>


          <View style={{ marginBottom: 30 }}>
            <CustomButton
              text="UPDATE"
              disabled={firstError || lastError || phonError || !isDirty ? true : false}
              onClick={this.fetchAPI}
            />
          </View>

          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('ChangePassword')}>
              <Text style={{ fontFamily: 'WS-Light', color: '#25334a' }}>Change Password</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </View>
    );

  }
}