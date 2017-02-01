import React from 'react';
import { Provider } from 'react-redux';
import storeConfiguration from '../store/store-configuration';
import MainSceneContainer from './mainSceneContainer';


const store = storeConfiguration();

export default class KeradWeather extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <MainSceneContainer />
      </Provider>
    );
  }
}
