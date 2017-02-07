import reducer from '../../src/reducers/navReducer';
import * as types from '../../src/constants/ActionTypes';

const initialState = {
  index: 0,
  key: 'searchScene',
  routes: [{
    key: 'searchScene',
    title: 'searchScene'
  }]
}
describe('nav reducer', () => {
  it('should return default state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual(initialState);
  });

  it('should push a route to our navigator array and move our index to it.', () => {
    const expectedState = {
      index: 1,
      key: 'searchScene',
      routes: [{
        key: 'searchScene',
        title: 'searchScene'
      },
      {
        key: 'cityDetails',
        selectedCityId: 30633
      }]
    };

    expect(
      reducer(initialState, {
        type: types.PUSH_ROUTE,
        route: { key: 'cityDetails', selectedCityId: 30633 }
      })
    ).toEqual(expectedState);

  });

  it('should pop a route from our navigator array and move our index to the previous one.', () => {
    const expectedState = {
      index: 1,
      key: 'searchScene',
      routes: [{
        key: 'searchScene',
        title: 'searchScene'
      },
      {
        key: 'cityDetails',
        selectedCityId: 30633
      }]
    };

    expect(
      reducer(expectedState, {
        type: types.POP_ROUTE
      })
    ).toEqual(initialState);

  });
})
