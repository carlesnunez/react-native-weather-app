import { createSelector } from 'redux-orm';
import orm from '../models';

const citySelector = createSelector(orm, state => state.orm, session => session.City.all().toRefArray());

export default citySelector;
