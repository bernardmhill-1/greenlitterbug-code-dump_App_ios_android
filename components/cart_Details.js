import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  Picker,
  Image,
  StyleSheet,
  Modal,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';


export default class CartDetails extends React.Component {

  constructor(props) {
    super(props);
    this.inputRefs = {
      firstTextInput: null,
      favQty: null,
    };
  }
  render() {
    const placeholder = {
      label: '1',
      value: 1,
      color: '#9EA0A4',
    };
    
    return (
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center', marginBottom: 20 }}>
        <View style={{ flex: 0.36, alignItems: 'center', justifyContent: 'center', alignContent: 'center' }}>
          <ImageBackground
            style={{ width: 101, height: 84, alignItems: 'center', justifyContent: 'center', margin: 8, }}
            source={{ uri: this.props.image1 }}
            imageStyle={{ borderRadius: 10, backgroundColor: 'rgba(0,0,0,1)' }}
          >
            <View style={{ backgroundColor: 'rgba(0,0,0,0.2)', width: '100%', height: '100%', alignContent: 'center', justifyContent: 'center', alignItems: 'center', borderRadius: 10, padding: 10 }}>
              {
                this.props.stockAvl === 'yes' ?
                  <Text style={{ textAlign: 'center', color: '#fff', fontFamily: 'WS-SemiBold', fontSize: 12, textShadowOffset: { width: 2, height: 2 }, textShadowColor: 'black', textShadowRadius: 20 }}>{this.props.text1}</Text>
                  :
                  <Text style={{ textAlign: 'center', color: 'red', fontFamily: 'WS-SemiBold', fontSize: 12, textShadowOffset: { width: 2, height: 2 }, textShadowColor: 'black', textShadowRadius: 20 }}>Out Of Stock</Text>
              }

            </View>
          </ImageBackground>
        </View>

        <View style={{ flex: 0.26, borderColor: '#b7b7b7', borderWidth: 1, borderRadius: 30, alignItems: 'center', alignItems: 'flex-end', marginHorizontal: '6%' }}>
          {/* <Picker
            style={{ height: 38, width: '100%' }}
            selectedValue={this.props.selected}
            onValueChange={(item, i) => this.props.changePicker(item, i)}
            mode='dropdown'
          >
            {
              this.props.pValue.map((item, i) => (
                <Picker.Item key={i} label={`${item}`} value={`${item}`} />
              ))
            }
          </Picker> */}

          <RNPickerSelect
            placeholder={placeholder}
            items={this.props.pValue}
            value={this.props.selected}
            placeholderTextColor='#000000'
            onValueChange={(item, i) => this.props.changePicker(item, i)}
            onUpArrow={() => {
              this.inputRefs.firstTextInput.focus();
            }}
            onDownArrow={() => {
              this.inputRefs.favQty.togglePicker();
            }}
            style={pickerSelectStyles}
            // value={ value }
            useNativeAndroidPickerStyle={false}
            Icon={() => {
              return <MaterialIcons style={{ alignItems: 'center' }} name="arrow-drop-down" size={24} color="gray" />;
            }}
            ref={el => {
              this.inputRefs.favQty = el;
            }}
          />

        </View>


        <View style={{ flex: 0.27, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderColor: '#b7b7b7', borderWidth: 1, borderRadius: 30, height: 40 }}>
          <View style={{ backgroundColor: '#b7b7b7', width: 26, height: 26, borderRadius: 13, alignItems: 'flex-start' }}>
            <Image
              style={{ width: 22, height: 23 }}
              source={require('../assets/img/tab/foot_print/point_img.png')}
            />
          </View>
          <Text style={{ color: '#25334a', fontFamily: 'WS-Medium', textAlign: 'center' }}>{`${this.props.text2} pts`}</Text>
        </View>
        <TouchableOpacity
          style={{ flex: 0.11, alignContent: 'flex-end', alignItems: 'center' }}
          onPress={this.props.onClick}
        >
          <Ionicons
            style={{ textAlign: 'center', width: 20, height: 20, borderRadius: 10, backgroundColor: '#ebebeb' }}
            name="ios-close"
            size={20}
            color="#25334a"
          />
        </TouchableOpacity>
      </View>
    );
  }

}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 4,
    color: 'black',
    paddingLeft:15
    // to ensure the text is never behind the icon

  },
  inputAndroid: {
    alignSelf: 'flex-start',
    width: '100%',
    marginHorizontal: 0,
    alignItems: 'flex-start',
    fontSize: 15,
    paddingLeft: 10,
    paddingVertical:5,
    borderWidth: 0.5,
    borderColor: 'transparent',
    borderRadius: 8,
    color: '#000',
    paddingRight: '50%',
    // to ensure the text is never behind the icon

  },
  iconContainer: {
    top: 10,
    left: '65%',
  },
});