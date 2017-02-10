import citySelector from '../../src/selectors/citySelector';
import orm from '../../src/models';
import factory from '../factories';
import { applyActionToModelReducer, ReduxORMAdapter } from '../utils';

describe('Selectors', () => {
    let session, state;
    beforeEach((done) => {
        state = orm.getEmptyState();
        session = orm.mutableSession(state); // Before withMutations;
        factory.setAdapter(new ReduxORMAdapter(session));
        factory.create('City').then(() => {
            done();
        });
    });

    it('should create an action to close the city list', () => {
        const result = citySelector({orm: state});
        expect(result.length).toEqual(1);
        expect(Object.keys(result[0])).toEqual(['id', 'type', 'name', 'country', 'weatherInfo']);
    });
});
