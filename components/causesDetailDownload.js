import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  Linking
} from 'react-native';

export default class DownloadList extends React.Component {

  _handleButtonPress = async () => {
    Linking.openURL(this.props.down)
  }

  render() {
    return (
      <View style={{}}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginHorizontal: '20%', marginBottom: 10 }}>
          <Text style={{ color: "#a6a6a6", fontFamily: 'WS-Regular' }}>{this.props.title}</Text>
          <TouchableOpacity style={{ alignItems: 'center', backgroundColor: '#f4f4f4', borderRadius: 20, width: 40, height: 40, justifyContent: 'center', }}
            onPress={this._handleButtonPress}
          >
            <Image
              style={{ width: 21, height: 21, alignItems: 'center', justifyContent: 'center' }}
              source={require('../assets/img/home/download.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
