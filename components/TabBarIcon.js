import React from 'react';
import{ Image} from 'react-native'
import { Ionicons,MaterialCommunityIcons } from '@expo/vector-icons';

import Colors from '../constants/Colors';

export class TabBarIcon extends React.Component {
  render() {
    return (
      <Ionicons
        name={this.props.name}
        size={26}
        style={{ marginBottom: -3 }}
        color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
      />
    );
  }
}

export class MaterialCommunityIcon extends React.Component {
  render() {
    return (
      <MaterialCommunityIcons
        name={this.props.name}
        size={26}
        style={{ marginBottom: -3 }}
        color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
      />
    );
  }
}

export class ImageIcon extends React.Component {
  render() {
    const { height} = this.props;
    return (
      <Image
         source={this.props.image}
         style={[{marginBottom: -3,width:25,height:height},{tintColor:this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}]}
        
      />
    );
  }
}

