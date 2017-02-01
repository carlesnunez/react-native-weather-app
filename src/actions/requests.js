import { push } from './navigation';

export const parseResponseAndExecAction = (
                            response, actionToPerform, dispatch) =>
                                            response.json().then((responseJson) => {
                                                if(Array.isArray(actionToPerform)){
                                                    actionToPerform.forEach(action => dispatch(action(responseJson)))
                                                } else {
                                                    dispatch(actionToPerform(responseJson));
                                                }
                                                });

export const doApiCall = (endpoint, options) => {
    return fetch(endpoint);
}

export const fillCityAutoComplete = (response) => {
    return {
        type: 'FILL_CITY_AUTOCOMPLETE',
        response,
    };
};

export const navigateToCityDetails = (responseJson, cityName) => {
    return push({key: 'cityDetails', wheaterInfo: responseJson[0], cityName: cityName});
}

export const fillCityWeather = (wheaterInfo, cityName) => {
    return  {
        type: 'CHECK_CITY_WEATHER',
        wheaterInfo,
        cityName
    }
}

export function fetchCity(cityName) {
    const APIKEY = 'zOEDguz3RM6DRGh1o9UIm7dCyU4qIlKU';
    const apiUrl = `https://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${APIKEY}&q=${cityName}&language=es`;
    return (dispatch) => {
        doApiCall(apiUrl).then((response) => parseResponseAndExecAction(response, fillCityAutoComplete, dispatch))
        .catch((error) => {
            console.error(error);
        });
    };
}

export function checkCityWeather(cityData) {
    const APIKEY = 'zOEDguz3RM6DRGh1o9UIm7dCyU4qIlKU';
    const apiUrl = `https://dataservice.accuweather.com/currentconditions/v1/${cityData.Key}?apikey=${APIKEY}&language=es-es&details=true `;

    return (dispatch) => {
        const callbackArray = [
            (response) => fillCityWeather(response, cityData.LocalizedName, dispatch),
            (response) => navigateToCityDetails(response, cityData.LocalizedName)
        ];
        doApiCall(apiUrl).then((response) => parseResponseAndExecAction(response, callbackArray, dispatch))
        .catch((error) => {
            console.error(error);
        });
    };
}
