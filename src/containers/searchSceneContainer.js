import { connect } from 'react-redux';
import * as requestsActions from '../actions/requests';
import * as cityListActions from '../actions/cityList';
import SearchScene from '../components/searchScene';
import React from 'react';

const mapStateToProps = (state) => {
  return state;
}

const mapDispatchToProps = (dispatch) => {
  return ({
    openCityList: () => {
      dispatch(cityListActions.openCityList());
    },
    closeCityList: () => {
      dispatch(cityListActions.closeCityList());
    },
    onDummyButtonClick: (cityName) => {
      dispatch(requestsActions.fetchCity(cityName))
    },
    checkCityWeather: (root) => {
      dispatch(requestsActions.checkCityWeather(root));
    }
  });
};
export default connect(mapStateToProps, mapDispatchToProps)(SearchScene);
