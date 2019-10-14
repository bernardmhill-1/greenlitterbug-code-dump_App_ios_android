import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors } from './indexStyle';

const IS_IOS = Platform.OS === 'ios';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp(percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

const slideHeight = viewportHeight * 0.33;
const slideWidth = wp(90);
const itemHorizontalMargin = wp(2);

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

const entryBorderRadius = 8;

export default StyleSheet.create({
  slideInnerContainer: {
    width: itemWidth,
    height: slideHeight,
    paddingHorizontal: itemHorizontalMargin,
    paddingBottom: 18 // needed for shadow
  },
  shadow: {
    position: 'absolute',
    top: 0,
    left: itemHorizontalMargin,
    right: itemHorizontalMargin,
    bottom: 18,
    shadowColor: colors.black,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    borderRadius: entryBorderRadius
  },
  imageContainer: {
    flex: 1,
    elevation: 2,
    marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius,
    borderBottomLeftRadius: entryBorderRadius,
    borderBottomRightRadius: entryBorderRadius,
    zIndex: 1,
    shadowColor: 'gray',
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: { height: 1, width: 0 }



  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
    borderRadius: IS_IOS ? entryBorderRadius : 0,
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius,
    borderBottomLeftRadius: entryBorderRadius,
    borderBottomRightRadius: entryBorderRadius
  },

  radiusMask: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: entryBorderRadius,
    backgroundColor: 'white',

  },
  textContainer:{
    position: 'absolute',
     zIndex: 99999,
     alignItems:'center',
     paddingVertical:10,
     width: itemWidth-15,
     left: itemHorizontalMargin,
     right: itemHorizontalMargin,
     paddingHorizontal:15,
     bottom:16,
     backgroundColor: 'rgba(0,0,0,0.3)',
     borderRadius: IS_IOS ? entryBorderRadius : 0,
     borderBottomLeftRadius: entryBorderRadius,
     borderBottomRightRadius: entryBorderRadius
     
  },
  title: {
    color: colors.background1,
    fontSize: 14,
    fontWeight: 'bold',

  }

});
