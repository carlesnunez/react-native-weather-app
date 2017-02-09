import { Text, View, TouchableHighlight } from 'react-native';
import React from 'react';
import CloudPictogram from '../components/cloudPictogram';
import style from '../styles';

const CityDetails = ({_handleNavigate, city}) => {
        if(city) {
                return (<View style={{flex: 1, backgroundColor: '#262626'}}>
                        <TouchableHighlight style={{marginTop: 30, marginLeft: 8}} onPress={() => _handleNavigate({type: 'pop'})}>
                                <Text style={{color: '#ffffff', fontSize: 20}}>{'< Back'}</Text>
                        </TouchableHighlight>
                        <View style={{ flex: 1, alignItems: 'center'}}>
                                <CloudPictogram weatherIcon={city.weatherInfo.iconId} />
                                <Text style={{color: '#ffffff', fontFamily: 'Nunito-Bold', fontSize: 50, height: 70, textAlign: 'center'}}>
                                        {`${city.name} ${city.weatherInfo.temperature}º`}
                                </Text>
                                <Text style={{color: '#ffffff', fontFamily: 'Nunito-Bold', fontSize: 40, textAlign: 'center'}}>
                                        {city.weatherInfo.previsionText}
                                </Text>
                        </View>
                </View>);
        }
        return false;
};

export default CityDetails;
