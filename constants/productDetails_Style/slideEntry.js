// import React, { Component } from 'react';
// import { View, Text, Image, TouchableOpacity } from 'react-native';
// import PropTypes from 'prop-types';
// import { ParallaxImage } from 'react-native-snap-carousel';
// import styles from './slideEntryStyle';


// export default class SliderEntry extends Component {

//   static propTypes = {
//     data: PropTypes.object.isRequired,
//     parallax: PropTypes.bool,
//     parallaxProps: PropTypes.object,
//   };

//   get image() {
//     const { imageName, parallax, parallaxProps} = this.props;

//     return parallax ? (
//       <ParallaxImage
//         source={{uri: imageName}}
//         containerStyle={styles.imageContainer}
//         style={styles.image}
//         parallaxFactor={0.35}
//         showSpinner={true}
//         spinnerColor={'rgba(0, 0, 0, 0.25)'}
//         {...parallaxProps}
//       />
//     ) : (
//         <Image
//           source={imageName}
//           style={styles.image}
//         />
//       );
//   }

//   render() {
//     const { data: even, title } = this.props;
//     return (

//       <TouchableOpacity
//         activeOpacity={1}
//         style={styles.slideInnerContainer}
//       >
//         <View style={styles.shadow} />
//         <View style={styles.imageContainer}>

//           {this.image}
//           <View style={styles.radiusMask} />
//         </View>

//       </TouchableOpacity>
//     );
//   }
// }

import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles from './slideEntryStyle';

export const SliderEntry = props => {
  const { imageName, parallax, parallaxProps } = props;

  return (

    <TouchableOpacity
      activeOpacity={1}
      style={styles.slideInnerContainer}
    >
      <View style={styles.shadow} />
      <View style={styles.imageContainer}>
        <ParallaxImage
          source={{ uri: imageName }}
          containerStyle={styles.imageContainer}
          style={styles.image}
          parallaxFactor={0.35}
          showSpinner={true}
          spinnerColor={'rgba(0, 0, 0, 0.25)'}
          {...parallaxProps}
        />
        <View style={styles.radiusMask} />
      </View>

    </TouchableOpacity>

  );
}

export const SliderEntry1 = props => {
  const { imageName, title, parallax, parallaxProps, onClick } = props;

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.slideInnerContainer}
        onPress={onClick}
      >
        <View style={styles.shadow} />
        <View style={styles.imageContainer}>
          <ParallaxImage
            source={{ uri: imageName }}
            containerStyle={styles.imageContainer}
            style={styles.image}
            parallaxFactor={0.35}
            showSpinner={true}
            spinnerColor={'rgba(0, 0, 0, 0.25)'}
            {...parallaxProps}
          />
          <View style={styles.radiusMask} />
        </View>
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
}
