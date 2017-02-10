import React from 'react';
import { View, Image, Text, Animated } from 'react-native';
import styles from '../styles';

export default ({ scale, rotate, onDummyButtonClick }) => (
        <View>
            <Animated.Image style={{...styles.logoClouds.imageSun, transform: [ { scale: scale }, { rotate: rotate } ]}}
                source={require('../assets/img/sun.png')} />
                <Image style={styles.logoClouds.imageCloud} source={require('../assets/img/Cloud4.png')} />
                <Text style={styles.logoClouds.title}>ReduxWeather</Text>
            </View>
    );
