import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  AsyncStorage,
  SafeAreaView

} from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import {CustomButton} from '../components/Button'

export default class DrawerScreen extends Component {

  logout = async() => {
    AsyncStorage.clear();
    this.props.navigation.navigate('Login');
  }

  render() {
    return (
      <View style={{ flex: 1, marginTop: 5 }}>
        <TouchableOpacity
          style={{ alignItems: 'flex-end', marginBottom: 30 }}
          onPress={() => this.props.navigation.closeDrawer()}
        >
          <MaterialIcons
            name="close"
            size={30}
          />
        </TouchableOpacity>

        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Image
            style={{ width: 140, height:141 }}
            source={require('../assets/img/drawer/logo.png')}
          />
        </View>

        <View style={{ alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#499828', marginHorizontal: 15, elevation: 1, paddingVertical: 10,marginBottom:10 }}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')}
            style={{}}
          >
            <Text style={{}}>HOME</Text>
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#499828', marginHorizontal: 15, elevation: 1, paddingVertical: 10,marginBottom:10}}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('EditProfile')}>
            <Text style={{}}>EDIT PROFILE</Text>
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#499828', marginHorizontal: 15, elevation: 1, paddingVertical: 10,marginBottom:10 }}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Contact')}>
            <Text style={{}}>CONTACT US</Text>
          </TouchableOpacity>
        </View>


        <View style={{ alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#499828', marginHorizontal: 15, elevation: 1, paddingVertical: 10,marginBottom:10 }}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('MyOrder')}>
            <Text style={{}}>MY ORDER</Text>
          </TouchableOpacity>
        </View>

        <View style={{marginTop: 50}}>
            <CustomButton
              text="Logout"
              onClick={this.logout}
            />
        </View>

      </View>
    )
  }
}