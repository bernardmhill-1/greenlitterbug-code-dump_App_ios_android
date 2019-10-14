import { Dimensions } from 'react-native';

const { width: viewportWidth } = Dimensions.get('window');

function wp(percentage) {
  const value = percentage * viewportWidth / 100;
  return Math.round(value);
}


export const slideWidth = wp(33);
export const sliderItemHorizontalMargin = wp(4);

export const sliderWidth1 = viewportWidth;
export const sliderItemWidth = slideWidth + sliderItemHorizontalMargin * 4;