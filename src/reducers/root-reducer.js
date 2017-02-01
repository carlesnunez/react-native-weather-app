import { combineReducers } from 'redux';
import navReducer from './navReducer';
import { FILL_CITY_AUTOCOMPLETE, OPEN_CITY_LIST,
         CLOSE_CITY_LIST, CHECK_CITY_WEATHER } from '../constants/ActionTypes';

const root = (state = {cityList: [], selectCityInputOpened: false, selectedCity: '', wheaterInfo: null}, action) => {
    switch (action.type) {
        case FILL_CITY_AUTOCOMPLETE:
        return {
            ...state,
            cityList: action.response
        };
        case OPEN_CITY_LIST:
        return {cityList: [], selectCityInputOpened: true, wheaterInfo: null};
        case CLOSE_CITY_LIST:
        return {cityList: [], selectCityInputOpened: false, selectedCity: '', wheaterInfo: null};
        case CHECK_CITY_WEATHER:
        return {
            ...state,
            cityList: [],
            selectCityInputOpened: false,
            selectedCity: action.cityName,
            wheaterInfo: action.wheaterInfo[0]
        }
        default:
        return state;
    }
};

const rootReducerCombined = combineReducers({ root, navReducer});
export default rootReducerCombined;
