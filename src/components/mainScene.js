import {
  BackAndroid,
  NavigationExperimental
} from 'react-native';
import dismissKeyBoard from 'react-native/Libraries/Utilities/dismissKeyboard';
import React from 'react';
import {pop, push} from '../actions/navigation';
import SearchSceneContainer from '../containers/searchSceneContainer';
import CityDetailsContainer from '../containers/cityDetailsContainer';

const {
  CardStack: NavigationCardStack
} = NavigationExperimental;

class MainScene extends React.Component {
  constructor (props) {
    super(props)
    this._renderScene = this._renderScene.bind(this)
    this._handleBackAction = this._handleBackAction.bind(this)
  }

  componentDidMount () {
    BackAndroid.addEventListener('hardwareBackPress', this._handleBackAction)
  }
  componentWillUnmount () {
    BackAndroid.removeEventListener('hardwareBackPress', this._handleBackAction)
  }

  _renderScene(props) {
    const { route } = props.scene;
    if (route.key === 'searchScene') {
      return <SearchSceneContainer _handleNavigate={this._handleNavigate.bind(this)} />
    }

    if (route.key === 'cityDetails') {
      return <CityDetailsContainer _handleNavigate={this._handleNavigate.bind(this)} selectedCityId={route.selectedCityId}/>
    }
  }

  _handleNavigate (action) {
    switch (action && action.type) {
      case 'push':
      this.props.pushRoute(action.route)
      return true
      case 'back':
      case 'pop':
      return this._handleBackAction()
      default:
      return false
    }
  }

  _handleBackAction () {
    if (this.props.navigation.index === 0) {
      return false
    }
    this.props.popRoute()
    return true
  }

  render() {
    return <NavigationCardStack
      direction='vertical'
      navigationState={this.props.navigation}
      onNavigate={this._handleNavigate.bind(this)}
      renderScene={this._renderScene} />
    }
};

export default MainScene;
