import React from 'react';
import {
  TouchableOpacity,
  View,
  Image,
  Text
} from 'react-native';
import { CustomButton1 } from './Button'

export default class ProductDetails extends React.Component {

  render() {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal:20, marginBottom: 80 }}>
        <View style={{ backgroundColor: '#fefefe', borderRadius: 15, elevation: 5, height: 127, width: 148,shadowColor: 'gray', shadowOpacity: 0.8, shadowRadius: 2, shadowOffset: { height: 1, width: 0} }} >
          <Image
            style={{ width: 148, height: 127, borderRadius: 15 }}
            source={{ uri: this.props.image }}
            resizeMode="cover"
          />
          <View style={{ marginTop: -20 }}>
            <CustomButton1 onClick={this.props.onClick} text="View Details" font="vary" />
          </View>
          <Text style={{ textAlign: 'center', color: 'gray', fontFamily: 'WS-SemiBold', fontSize: 12, marginTop: 5 }}>{this.props.productName}</Text>
        </View>
      </View>

    );
  }

}