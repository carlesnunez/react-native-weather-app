import citySelector from '../../src/selectors/citySelector';
import currentCitySelector from '../../src/selectors/currentCitySelector';
import orm from '../../src/models';
import factory from '../factories';
import { applyActionToModelReducer, ReduxORMAdapter } from '../utils';

describe('Selectors', () => {
    let session, state, currentCityId;
    beforeEach((done) => {
        state = orm.getEmptyState();
        session = orm.mutableSession(state); // Before withMutations;
        factory.setAdapter(new ReduxORMAdapter(session));
        factory.create('City').then((city) => {
            currentCityId = city.id;
            done();
        });
    });

    it('should create an action to close the city list', () => {
        const result = currentCitySelector({ orm: state }, { selectedCityId: currentCityId });
        expect(Object.keys(result.ref)).toEqual(['id', 'type', 'name', 'country', 'weatherInfo']);
    });
});
