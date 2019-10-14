import { StyleSheet } from 'react-native';

export const colors = {
    black: '#1a1917',
    gray: '#888888',
    background1: '#fff',
    background2: 'red'
};

export default StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,

    },
    scrollview: {
        flex: 1
    },
    exampleContainer: {
         paddingVertical:8
    },
    slider: {

        overflow: 'visible' // for custom animations
    },
    sliderContentContainer: {
        // paddingVertical: 10 // for custom animation
    },
    paginationContainer: {
        paddingVertical: 8
    },
    paginationDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 0
    },
    container1: {
        flex: 1,
        // paddingTop: 56,
        backgroundColor: '#ffffff',
    
      },
});