import { connect } from 'react-redux';
import * as requestsActions from '../actions/requests';
import * as cityListActions from '../actions/cityList';
import cityDetails from '../components/cityDetails';
import currentCitySelector from '../selectors/currentCitySelector';
import React from 'react';

const mapStateToProps = (state, props) => {
    return {
        city: currentCitySelector(state, props),
    }
}
export default connect(mapStateToProps)(cityDetails);
