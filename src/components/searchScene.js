import React from 'react';
import { View, ListView, Text, TextInput, TouchableWithoutFeedback, Animated, Easing } from 'react-native';
import LogoClouds from '../components/logoClouds';
import CityElement from '../components/cityElement';
import style from '../styles';
import dismissKeyBoard from 'react-native/Libraries/Utilities/dismissKeyboard';

export default class SearchScene extends React.Component {
  constructor(props) {
    super();
    this.spinValue = new Animated.Value(0);
    this.bounceValue = new Animated.Value(0);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  }

  componentDidMount() {
    this.spin();
    this.bounce();
  }

  onKeyPress(text) {
    this.props.onDummyButtonClick(text);
  }

  spin() {
    this.spinValue.setValue(0);

    Animated.timing(
      this.spinValue,
      {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
      },
    ).start(() => this.spin());
  }

  bounce() {
    this.bounceValue.setValue(1.5);
    Animated.spring(
      this.bounceValue,
      {
        toValue: 1,
        friction: 1,
      },
    ).start();
  }

  selectCityInputOpened(value ){
    //If our value is true we open the list otherwise if is false and our list is not currently closed we close the list:
    value ? this.props.openCityList() : (this.props.root.selectCityInputOpened && this.props.closeCityList());
  }

  getCityElement(cityInfo) {
    return <CityElement onPress={this.props.checkCityWeather} cityInfo={cityInfo} />
  }

  getCityListElement(){
    if(this.props.root.cityList.length > 0) {
      return  <ListView style={{ flex: 1, backgroundColor: '#ebebeb' }}
        dataSource={this.ds.cloneWithRows(this.props.root.cityList)}
        enableEmptySections={true}
        renderRow={rowData => this.getCityElement(rowData)}
      />
    }

    return false;
  }

  render() {
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });
    return (<View style={{ flex: 1, alignItems: 'center', backgroundColor: '#262626', marginTop: (this.props.root.selectCityInputOpened ? -355: 0)}} >
      <TouchableWithoutFeedback style={style.searchScene.touchableComponent} onPress={() => {
        dismissKeyBoard();
        this.selectCityInputOpened(false);
      }}>

      <View>
        <LogoClouds scale={this.bounceValue} rotate={spin} />
        <TextInput style={style.searchScene.textInput}
          onChange={(e)=> e.nativeEvent.text && this.onKeyPress(e.nativeEvent.text)}
          onFocus={() => this.selectCityInputOpened(true)}
          value={this.props.root.selectedCity}
          placeholder="Search for a city..." />
        </View>
      </TouchableWithoutFeedback>
      <View style={{flex: 1, alignSelf: 'stretch'}}>{this.getCityListElement()}</View>
    </View>)
  }
}
