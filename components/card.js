import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { sliderItemWidth, sliderItemHorizontalMargin, slideWidth } from '../constants/styles';
import { LinearGradient } from 'expo-linear-gradient';

const Card = (props) => {
  const { image, text, onClick,title } = props;
  return (
    <View style={{paddingHorizontal: sliderItemHorizontalMargin,paddingVertical:10,alignItems: 'center', justifyContent: 'center', }} >
      <View style={{backgroundColor: '#fefefe', borderRadius: 15, elevation: 5,  width: slideWidth, height:slideWidth,alignItems:'center',justifyContent:'center',backgroundColor: '#f2eff1', borderRadius: 20,shadowColor: 'gray', shadowOpacity: 0.8, shadowRadius: 2, shadowOffset: { height: 1, width: 0 } }}>
          {
            image ?
              <Image style={{height:slideWidth,width:slideWidth, alignItems:'center',justifyContent:'center', borderRadius: 20}} source={{ uri: image }} />
              :
              <TouchableOpacity
                onPress={onClick}
                style={{}}
              >
                <Text>{text}</Text>
              </TouchableOpacity>
          }
        {
          image ?
            <View style={{ position: 'absolute', bottom:-12, width: '100%' }}>
              <TouchableOpacity
                onPress={onClick}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['#3e9126', '#abdf3d',]}
                  style={{ marginHorizontal: 15, paddingVertical:10, borderRadius: 30 }}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text
                    style={{
                      backgroundColor: 'transparent',
                      fontSize: 12,
                      color: '#fff',
                      textAlign: 'center',
                      fontFamily: 'WS-SemiBold',
                    }}>
                    View Details
                </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            : <View/>
        }
        
      </View>
      {image ?
          <View style={{alignItems:'center',justifyContent:'center',marginTop:20}}>
          <Text style={{textAlign: 'center', color: 'gray', fontFamily: 'WS-SemiBold', fontSize: 12}}>{title}</Text>
        </View>
        : <Text></Text>
      }
    </View>
  );
}

export default Card;
