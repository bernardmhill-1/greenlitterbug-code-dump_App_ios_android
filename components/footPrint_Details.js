import React from 'react';
import {
  Text,
  View,
} from 'react-native';

export default class FootPrintDetails extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, marginHorizontal: 15 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, marginHorizontal: 5 }}>
          <View style={{ flex: 0.24, alignItems: 'flex-start' }}>
            <Text style={{ textAlign: 'center', color: '#626467', fontFamily: 'WS-Medium' }}>{this.props.totalItem}</Text>
          </View>
          <View style={{ flex: 0.3, alignItems: 'flex-start' }}>
            <Text style={{ textAlign: 'center', color: '#626467', fontFamily: 'WS-Medium' }}>{this.props.totalPoints}</Text>
          </View>
          <View style={{ flex: 0.24, alignItems: 'flex-start' }}>
            <Text style={{ textAlign: 'center', color: '#626467', fontFamily: 'WS-Medium' }}>{this.props.TotalRedeemPoint}</Text>
          </View>
          <View style={{ flex: 0.28, alignItems: 'center' }}>
            <Text style={{ textAlign: 'center', fontFamily: 'WS-SemiBold', color: '#aecb3e' }}>{this.props.pointCollect}</Text>
            <Text style={{ textAlign: 'center', fontFamily: 'WS-SemiBold', color: '#aecb3e' }}>{this.props.pointremains}</Text>
          </View>
        </View>

      </View>
    );
  }

}
