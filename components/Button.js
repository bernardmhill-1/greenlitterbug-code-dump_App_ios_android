import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

 export const  CustomButton = props => {
  const { onClick, text, margin, font,disabled} = props;
  
  return (
    <View style={{ width: '100%' }}>
      <TouchableOpacity
        disabled={props.disabled} 
        onPress={onClick}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={disabled  ? ['#808080','#808080'] : ['#3e9126', '#abdf3d',] }
          style={[ margin === "zero" ? {marginHorizontal:10,paddingVertical: 15, borderRadius: 25} : {marginHorizontal:40,paddingVertical: 15, borderRadius: 30}]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
        >
          <Text
            style={{
              backgroundColor: 'transparent',
              fontSize: font === "vary" ? 14 :15,
              color: '#fff',
              textAlign: 'center',
              fontFamily:'WS-SemiBold'
            }}>
            {text}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}


export const  CustomButton1 = props => {
  const { onClick, text, font} = props;
  
  return (
    <View style={{ width: '100%' }}>
      <TouchableOpacity
        onPress={onClick}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={['#3e9126', '#abdf3d',]}
          style={{marginHorizontal:30,paddingVertical: 15, borderRadius: 25}}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
        >
          <Text
            style={{
              backgroundColor: 'transparent',
              fontSize: font === "vary" ? 12 :15,
              color: '#fff',
              textAlign: 'center',
              fontFamily:'WS-SemiBold'
            }}>
            {text}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}
export default CustomButton;

