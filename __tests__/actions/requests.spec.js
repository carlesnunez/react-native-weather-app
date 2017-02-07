import nock from 'nock';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { FILL_CITY_AUTOCOMPLETE, CHECK_CITY_WEATHER, PUSH_ROUTE } from '../../src/constants/ActionTypes'
import * as actions from '../../src/actions/requests';
import iso from "isomorphic-fetch";
import fillCityAutoCompleteResponse from '../mockups/fillAutoComplete.json';
import checkCityWeatherResponse from '../mockups/checkCityWeather.json'
import oneCityResponse from '../mockups/oneCity.json';
const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);
describe('async actions', () => {
        afterEach(() => {
                nock.cleanAll();
        })

        it('creates FILL_CITY_AUTOCOMPLETE when fetching city list has been done', () => {
                nock('https://dataservice.accuweather.com/')
                .get('/locations/v1/cities/autocomplete?apikey=zOEDguz3RM6DRGh1o9UIm7dCyU4qIlKU&q=Madr&language=es')
                .reply(200, fillCityAutoCompleteResponse);
                const expectedActions = [
                        { type: FILL_CITY_AUTOCOMPLETE, response: fillCityAutoCompleteResponse }
                ]
                const store = mockStore({ todos: [] });
                return store.dispatch(actions.fetchCity('Madr')).then(() => {
                        expect(store.getActions()).toEqual(expectedActions);
                })
        });

        it('creates CHECK_CITY_WEATHER when fetching city weather has been done', ()=> {
                nock('https://dataservice.accuweather.com/')
                .get(`/currentconditions/v1/308526?apikey=zOEDguz3RM6DRGh1o9UIm7dCyU4qIlKU&language=es-es&details=true`)
                .reply(200, checkCityWeatherResponse);
                const expectedActions = [
                        {
                                type: CHECK_CITY_WEATHER,
                                wheaterInfo: checkCityWeatherResponse,
                        },
                        {
                                type: PUSH_ROUTE,
                                route: { key: 'cityDetails', selectedCityId: checkCityWeatherResponse[0].MobileLink.split('/')[6] }
                        }
                ]
                const store = mockStore({ todos: [] });
                return store.dispatch(actions.checkCityWeather(oneCityResponse)).then(() => {
                        expect(store.getActions()).toEqual(expectedActions);
                })
        })
});
