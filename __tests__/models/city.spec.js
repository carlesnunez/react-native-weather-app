import { FILL_CITY_AUTOCOMPLETE, CHECK_CITY_WEATHER } from '../../src/constants/ActionTypes';

import orm from '../../src/models';
import factory from '../factories';
import Promise from 'bluebird';

import { ReduxORMAdapter, applyActionToModelReducer } from '../utils/index';
import responseFillCityAutoComplete from '../mockups/fillAutoComplete.json';
import responseCheckCityWeather from '../mockups/checkCityWeather.json';

describe.only('City model', () => {
    let session;
    beforeEach((done) => {
        session = orm.session(); // Before withMutations;
        factory.setAdapter(new ReduxORMAdapter(session));
        factory.create('City').then(()=> {
            done();
        });
    });

    it('correctly handle FILL_CITY_AUTOCOMPLETE delete all cities and push 10 new to our store', () => {
        const action = {
            type: FILL_CITY_AUTOCOMPLETE,
            response: responseFillCityAutoComplete,
        }
        //Before:
        expect(session.City.all().count()).toEqual(1);

        applyActionToModelReducer(orm, 'City', action, session);

        //After:
        expect(session.City.all().count()).toEqual(10);
    })

    it('should relate our CITY weather with a valid wheaterInfo ID given by action dispatch', ()=>{
        const action = {
            type: CHECK_CITY_WEATHER,
            wheaterInfo: responseCheckCityWeather,
        }

        factory.create('WeatherInfoFixedId').then(()=> {
            factory.create('CityWithoutWeather').then((city)=> {
                applyActionToModelReducer(orm, 'City', action, session);
                expect(session.City.withId(city.id).weatherInfo.id).toEqual(308526);
            });
        });
    })
});
