import React from 'react';
import {
  Text,
  View,
  TouchableOpacity
 
} from 'react-native';
import {  AntDesign, EvilIcons } from '@expo/vector-icons';

export const CartCount = props => {
  return (
    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',marginRight:5 }}>
      <TouchableOpacity
         style={{  flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginRight:5 }}
         onPress= {props.onClick}
         >
        <AntDesign
          name="shoppingcart"
          size={25}
          color="#fff"
        />

        {
          props.count === 0 || props.count === undefined ?
            null
          :   
            <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: '#e59701', alignItems: 'center', justifyContent: 'center', alignContent: 'center', position: 'relative', top: -7, left: -6 }}>
              <Text style={{ textAlign: 'center', color: '#fff', fontFamily: 'WS-Regular', fontSize: 12 }}>{props.count}</Text>
            </View>
        }
      </TouchableOpacity>

      {/* <View style={{ flex: 0.5, justifyContent: 'flex-end',marginRight:4 }}>
        <EvilIcons
          name="bell"
          size={30}
          color="#fff"
        />
      </View> */}
      {/* <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#e59701', alignItems: 'center', justifyContent: 'center', alignContent: 'center', position: 'absolute',right:0, bottom: 10 }}>
        <Text style={{ textAlign: 'center', color: '#fff', fontFamily: 'WS-Regular', fontSize: 12, }}>10</Text>
      </View> */}
    </View>
  );
}
