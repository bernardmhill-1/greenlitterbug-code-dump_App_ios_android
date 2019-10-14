import React from 'react';
import {
  TouchableOpacity,
  View,
  Text
} from 'react-native';
import { CustomButton1 } from '../../../components/Button'

export default class CausesList extends React.Component {

  render() {
    return (
      <View style={{alignContent:'flex-start',width:'100%'}}>
        <View style={{alignItems:'center',marginBottom:20,paddingVertical:20, backgroundColor: "#ffffff", borderRadius: 10, marginHorizontal: 20, elevation: 2,shadowColor: 'gray', shadowOpacity: 0.8, shadowRadius: 2, shadowOffset: { height: 1, width:0 }}}>
          <View style={{ paddingHorizontal: 20,alignContent:'flex-start',alignItems:'flex-start',alignSelf:'flex-start' }}>
            <Text style={{ color: '#24324c', fontFamily: 'WS-Medium', fontSize: 20, marginBottom: 8,textAlign:'left' }}>{this.props.title}</Text>
            <Text style={{ color: '#24324c', fontFamily: 'WS-Medium', fontSize: 12, marginBottom: 8,textAlign:'left' }}>{this.props.desc}</Text>
          </View>

          <View style={{justifyContent:'center',alignItems:'center', position: 'absolute', zIndex: 99999, bottom: -14, marginHorizontal: '10%' }}>
            <CustomButton1 text='Read More' onClick={this.props.onClick} font="vary" />
          </View>
        </View>
        
      </View>
    );
  }

}
