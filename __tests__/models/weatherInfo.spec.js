import { FILL_CITY_AUTOCOMPLETE, CHECK_CITY_WEATHER } from '../../src/constants/ActionTypes';

import orm from '../../src/models';
import factory from '../factories';
import Promise from 'bluebird';

import { ReduxORMAdapter, applyActionToModelReducer } from '../utils/index';
import responseCheckCityWeather from '../mockups/checkCityWeather.json';

describe('City model', () => {
    let session;
    beforeEach((done) => {
        session = orm.session(); // Before withMutations;
        factory.setAdapter(new ReduxORMAdapter(session));
        factory.create('WeatherInfo').then(() => {
            done();
        });
    });

    it('should relate our CITY weather with a valid wheaterInfo ID given by action dispatch', ()=>{
        const action = {
            type: CHECK_CITY_WEATHER,
            wheaterInfo: responseCheckCityWeather,
        }
        expect(session.WeatherInfo.all().count()).toEqual(1);
        applyActionToModelReducer(orm, 'WeatherInfo', action, session);
        expect(session.WeatherInfo.all().count()).toEqual(2);
        expect(session.WeatherInfo.all().toRefArray()[1].id).toEqual("308526")
    })
});
