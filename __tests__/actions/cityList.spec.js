import * as actions from '../../src/actions/cityList';

describe('actions', () => {
  //OPEN_CITY_LIST
  it('should create an action to open the city list', () => {
    const expectedAction = {
      type: 'OPEN_CITY_LIST'
    }

    expect(actions.openCityList()).toEqual(expectedAction);
  });

  //CLOSE_CITY_LIST
  it('should create an action to close the city list', () => {
    const expectedAction = {
      type: 'CLOSE_CITY_LIST'
    }

    expect(actions.closeCityList()).toEqual(expectedAction);
  });

})
