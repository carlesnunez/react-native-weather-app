import 'react-native';
import React from 'react';
import {View, TextInput, Text, Button, TouchableHighlight} from 'react-native';
import { shallow } from 'enzyme';
import CityDetails from '../../src/components/cityDetails';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

describe('<CityDetails />', () => {
  it('Input and Button component renders correctly', () => {
    const tree = renderer.create(
      <CityDetails city={{weatherInfo: {}}}/>
    );
    const json = tree.toJSON();
    expect(json).toMatchSnapshot();
  });
  const wrapper = shallow(<CityDetails city={{weatherInfo: {}}}/>);

  it('Should exists', () => {
    expect(wrapper.length).toEqual(1);
  });

  it('Should have two views', () => {
    expect(wrapper.find(View)).toHaveLength(2);
  });

  it('Should have one touchablehighlight', () => {
    expect(wrapper.find(TouchableHighlight)).toHaveLength(1);
  });

  it('Should have three texts', () => {
    expect(wrapper.find(Text)).toHaveLength(3);
  });
});
