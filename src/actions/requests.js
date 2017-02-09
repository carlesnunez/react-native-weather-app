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
    return fetch(endpoint, options);
}

export const fillCityAutoComplete = (response) => {
    return {
        type: 'FILL_CITY_AUTOCOMPLETE',
        response,
    };
};

export const navigateToCityDetails = (responseJson) => {
    return push({ key: 'cityDetails', selectedCityId: responseJson[0].MobileLink.split('/')[6] });
}

export const fillCityWeather = (weatherInfo) => {
    return {
        type: 'CHECK_CITY_WEATHER',
        weatherInfo
    }
}

export function fetchCity(cityName) {
    const APIKEY = 'zOEDguz3RM6DRGh1o9UIm7dCyU4qIlKU';
    const apiUrl = `https://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${APIKEY}&q=${cityName}&language=es`;
    return (dispatch) => {
        return doApiCall(apiUrl).then((response) => parseResponseAndExecAction(response, fillCityAutoComplete, dispatch))
        .catch((error) => {
            console.error(error);
        });
    };
}

export function checkCityWeather(cityData) {
    const APIKEY = 'zOEDguz3RM6DRGh1o9UIm7dCyU4qIlKU';
    const apiUrl = `https://dataservice.accuweather.com/currentconditions/v1/${cityData.id}?apikey=${APIKEY}&language=es-es&details=true`;

    return (dispatch) => {
        const callbackArray = [
            (response) => fillCityWeather(response, dispatch),
            (response) => navigateToCityDetails(response)
        ];
        return doApiCall(apiUrl).then((response) => parseResponseAndExecAction(response, callbackArray, dispatch))
        .catch((error) => {
            console.error(error);
        });
    };
}
