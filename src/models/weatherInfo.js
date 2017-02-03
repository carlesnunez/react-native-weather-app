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
            const wheaterInfoID = action.wheaterInfo[0].MobileLink.split("/")[6];
            WeatherInfo.create({
                id: wheaterInfoID,
                previsionText: action.wheaterInfo[0].WeatherText,
                iconId: action.wheaterInfo[0].WeatherIcon,
                temperature: action.wheaterInfo[0].Temperature.Metric.Value,
            });
            break;
        }
    }
}
