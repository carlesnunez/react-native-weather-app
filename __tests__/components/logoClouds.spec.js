import 'react-native';
import React from 'react';
import {Animated, Image, Text} from 'react-native';
import { shallow } from 'enzyme';
import LogoClouds from '../../src/components/logoClouds';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

describe('<LogoClouds />', () => {
  it('Input and Button component renders correctly', () => {
    const tree = renderer.create(
      <LogoClouds scale={1} rotate={'30deg'} />
    );
    const json = tree.toJSON();
    expect(json).toMatchSnapshot();
  });
  const wrapper = shallow(<LogoClouds scale={1} rotate={'30deg'} />);

  it('Should exists', () => {
    expect(wrapper.length).toEqual(1);
  });

  it('Should have one Animated image', () => {
    expect(wrapper.find(Animated.Image)).toHaveLength(1);
  });

  it('Should have one image', () => {
    expect(wrapper.find(Image)).toHaveLength(1);
  });

  it('Should have one text', () => {
    expect(wrapper.find(Text)).toHaveLength(1);
  });
});
