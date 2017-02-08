import { FILL_CITY_AUTOCOMPLETE, CHECK_CITY_WEATHER } from '../../src/constants/ActionTypes';

import orm from '../../src/models';
import factory from '../factories';
import Promise from 'bluebird';

import { ReduxORMAdapter } from '../utils/index';
import responseFillCityAutoComplete from '../mockups/fillAutoComplete.json';

describe('City model', () => {
    let session;

    beforeEach(() => {
        session = orm.session(); // Before withMutations;
        factory.setAdapter(new ReduxORMAdapter(session));
        factory.create('City').then((city)=> {
            console.log(session.City.first());
            console.log(city.weatherInfo);
        });

    });

    it('correctly handle FILL_CITY_AUTOCOMPLETE', () => {
        const action = {
            type: FILL_CITY_AUTOCOMPLETE,
            response: responseFillCityAutoComplete,
        }
        expect(1).toEqual(2);
        //
        // const { City } = applyActionAndGetNextSession(orm, state, action);
        // console.log('City.all()', City.all().count());
        // expect(3).toEqual(3);
    })
});
