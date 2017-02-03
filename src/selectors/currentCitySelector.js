import { createSelector } from 'redux-orm';
import orm from '../models';

const currentCitySelector = createSelector(orm, state => state.orm, (state, props) => props, (session, props) => {
    return session.City.withId(props.selectedCityId);
}
);

export default currentCitySelector;
