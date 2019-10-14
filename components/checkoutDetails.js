import React from 'react';
import {
  Text,
  View,
  ImageBackground,
  Image
} from 'react-native';

export default class CheckoutDetails extends React.Component {

  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center', marginBottom: 20 }}>
        <View style={{ flex: 0.36, alignItems: 'center', justifyContent: 'center', alignContent: 'center' }}>
          <ImageBackground
            style={{ width: 101, height: 84, alignItems: 'center', justifyContent: 'center', margin: 8, }}
            source={{ uri: this.props.image1 }}
            imageStyle={{ borderRadius: 10, backgroundColor: 'rgba(0,0,0,1)' }}
          >
            <View style={{ backgroundColor: 'rgba(0,0,0,0.2)', width: '100%', height: '100%', alignContent: 'center', justifyContent: 'center', alignItems: 'center', borderRadius: 10, padding: 10 }}>
              <Text style={{ textAlign: 'center', color: '#fff', fontFamily: 'WS-SemiBold', fontSize: 12, textShadowOffset: { width: 2, height: 2 }, textShadowColor: 'black', textShadowRadius: 20 }}>{this.props.text1}</Text>
            </View>
          </ImageBackground>
        </View>

        <View style={{ flex: 0.26, borderColor: '#b7b7b7', borderWidth: 1, borderRadius: 30, alignItems: 'center', alignContent: 'center', marginHorizontal: '6%', paddingVertical: 10 }}>
          <Text style={{ textAlign: 'center' }}>{this.props.product}</Text>
        </View>


        <View style={{ flex: 0.38, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderColor: '#b7b7b7', borderWidth: 1, borderRadius: 30, height: 40 }}>
          <View style={{ backgroundColor: '#b7b7b7', width: 26, height: 26, borderRadius: 13, alignItems: 'flex-start' }}>
            <Image
              style={{ width: 22, height: 23 }}
              source={require('../assets/img/tab/foot_print/point_img.png')}
            />
          </View>
          <Text style={{ color: '#25334a', fontFamily: 'WS-Medium', textAlign: 'center' }}>{`${this.props.text2} pts`}</Text>
        </View>
      </View>
    );
  }

}