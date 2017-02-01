import React from 'react';
import { View, Image } from 'react-native';
import styles from '../styles';

const getWheaterStateTypeDef = (wheaterIcon) => {
        switch(wheaterIcon) {
                case 1:
                case 2:
                return {sun: true, cloud: false, rain: false, moon: false, snow: false};
                case 3:
                case 4:
                case 5:
                return {sun: true, cloud: true, rain: false, moon: false, snow: false};
                case 6:
                case 7:
                case 8:
                case 11:
                return {sun: false, cloud: true, rain: false, moon: false, snow: false};
                case 12:
                case 15:
                case 25:
                case 26:
                case 29:
                return {sun: false, cloud: true, rain: true, moon: false, snow: false}
                case 13:
                case 14:
                case 16:
                case 17:
                return {sun: true, cloud: true, rain: true, moon: false, snow: false};
                case 18:
                return {sun: false, cloud: false, rain: true, moon: false, snow: false};
                case 19:
                case 20:
                case 21:
                case 22:
                case 23:
                case 24:
                return {sun: false, cloud: false, rain: false, moon: false, snow: true};
                case 33:
                return {sun: false, cloud: false, rain: false, moon: true, snow: false};
                case 34:
                case 35:
                case 36:
                case 37:
                case 38:
                return {sun: false, cloud: true, rain: false, snow: false};
                case 39:
                case 40:
                case 41:
                case 42:
                return {sun: false, cloud: true, rain: true, moon: true, snow: false};
                case 43:
                case 44:
                return {sun: false, cloud: true, rain: false, moon: false, snow: true};
                default:
                return {sun: false, cloud: false, rain: false, moon: false, snow: false};
        }
};

const getRainPictogram = () => (
        <View style={styles.cloudPictogram.rain.rootView}>
                <Image style={style.cloudPictogram.rain.odd} source={require('../assets/img/raindrops.png')} />
                <Image style={style.cloudPictogram.rain.even} source={require('../assets/img/raindrops.png')} />
                <Image style={style.cloudPictogram.rain.odd} source={require('../assets/img/raindrops.png')} />
                <Image style={style.cloudPictogram.rain.even} source={require('../assets/img/raindrops.png')} />
        </View>
);

const getSnowPictogram = () => (<View style={style.cloudPictogram.snow.rootView}>
        <Image style={{tintColor: '#d3e4ff', marginTop: -30, marginLeft: -80}} source={require('../assets/img/snowflake.png')} />
        <Image style={{tintColor: '#d3e4ff', marginTop: -20, marginLeft: 110, transform: [{ scale: 0.5 }]}} source={require('../assets/img/snowflake.png')} />
        <Image style={{tintColor: '#d3e4ff', marginTop: -10, marginLeft: -10}} source={require('../assets/img/snowflake.png')} />
        <Image style={{tintColor: '#d3e4ff', marginTop: -50, marginLeft: -80, transform: [{ scale: 0.5 }]}} source={require('../assets/img/snowflake.png')} />
        <Image style={{tintColor: '#d3e4ff', marginTop: -40, transform: [{ scale: 0.5 }]}} source={require('../assets/img/snowflake.png')} />
        <Image style={{tintColor: '#d3e4ff', marginTop: -100, marginLeft: 85, transform: [{ scale: 0.5 }]}} source={require('../assets/img/snowflake.png')} /></View>
)

const buildIcon = (wheaterIcon) => {
        let sun, snow, moon, rain, cloud;

        const wheaterStateType = getWheaterStateTypeDef(wheaterIcon),
                hasSunOrMoon = (wheaterStateType.sun || wheaterStateType.moon);

        wheaterStateType.sun && (sun = <Image style={styles.cloudPictogram.sun} source={require('../assets/img/sun.png')} />);
        wheaterStateType.snow && (snow = getSnowPictogram());
        wheaterStateType.moon && (moon = <Image style={styles.cloudPictogram.moon} source={require('../assets/img/moon.png')} />)
        wheaterStateType.rain && (rain = getRainPictogram())
        wheaterStateType.cloud && (cloud = <Image style={{marginTop: hasSunOrMoon ? -140 : 0, marginLeft: hasSunOrMoon ? 70 : 0}} source={require('../assets/img/Cloud4.png')} />)

        return (
                <View style={styles.cloudPictogram.rootView}>
                        {sun}
                        {moon}
                        {snow}
                        {cloud}
                        {rain}
                </View>
        );
};

export default ({ wheaterIcon }) => buildIcon(wheaterIcon);
