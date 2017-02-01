import { Text, View, TouchableHighlight } from 'react-native';
import React from 'react';
import CloudPictogram from '../components/cloudPictogram';
import style from '../styles';

const CityDetails = ({_handleNavigate, wheaterInfo, cityName}) => {
        if(wheaterInfo) {
                return (<View style={{flex: 1, backgroundColor: '#262626'}}>
                        <TouchableHighlight style={{marginTop: 30, marginLeft: 8}} onPress={() => _handleNavigate({type: 'pop'})}>
                                <Text style={{color: '#ffffff', fontSize: 20}}>{'< Back'}</Text>
                        </TouchableHighlight>
                        <View style={{ flex: 1, alignItems: 'center'}}>
                                <CloudPictogram wheaterIcon={wheaterInfo.WeatherIcon} />
                                <Text style={{color: '#ffffff', fontFamily: 'Nunito-Bold', fontSize: 50, height: 70, textAlign: 'center'}}>
                                        {`${cityName} ${wheaterInfo.Temperature.Metric.Value}º`}
                                </Text>
                                <Text style={{color: '#ffffff', fontFamily: 'Nunito-Bold', fontSize: 40, textAlign: 'center'}}>
                                        {wheaterInfo.WeatherText}
                                </Text>
                        </View>
                </View>);
        }
        return false;
};

export default CityDetails;
