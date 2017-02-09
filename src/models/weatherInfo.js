import { fk, many, attr, Model } from 'redux-orm';
import { CHECK_CITY_WEATHER } from '../constants/ActionTypes';

export default class WeatherInfo extends Model {
    static get fields() {
        return {
            id: attr(),
            previsionText: attr(),
            iconId: attr(),
            temperature: attr(),
        }
    }

    static get modelName() {
        return 'WeatherInfo';
    }

    static reducer(action, WeatherInfo, session) {
        switch(action.type){
            case CHECK_CITY_WEATHER:
            const weatherInfoID = action.weatherInfo[0].MobileLink.split("/")[6];
            WeatherInfo.create({
                id: weatherInfoID,
                previsionText: action.weatherInfo[0].WeatherText,
                iconId: action.weatherInfo[0].WeatherIcon,
                temperature: action.weatherInfo[0].Temperature.Metric.Value,
            });
            break;
        }
    }
}
