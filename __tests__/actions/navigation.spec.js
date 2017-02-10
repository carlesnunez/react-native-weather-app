import * as actions from '../../src/actions/navigation';

describe('actions', () => {
  //OPEN_CITY_LIST
  it('should create push action to add a card to our navigation', () => {
    const expectedAction = {
      type: 'PUSH_ROUTE',
      route: { key: 'cityDetails', selectedCityId: 3 }
    }

    expect(actions.push({ key: 'cityDetails', selectedCityId: 3 })).toEqual(expectedAction);
  });

  //CLOSE_CITY_LIST
  it('should create an action to pop a card from our list', () => {
    const expectedAction = {
      type: 'POP_ROUTE'
    }

    expect(actions.pop()).toEqual({ type: 'POP_ROUTE' });
  });

})
