import 'react-native';
import React from 'react';
import {Button} from 'react-native';
import { shallow } from 'enzyme';
import CityElement from '../../src/components/cityElement';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

describe('<CityElement />', () => {
  it('Input and Button component renders correctly', () => {
    const tree = renderer.create(
      <CityElement cityInfo={{}}/>
    );
    const json = tree.toJSON();
    expect(json).toMatchSnapshot();
  });
  const wrapper = shallow(<CityElement cityInfo={{}}/>);

  it('Should exists', () => {
    expect(wrapper.length).toEqual(1);
  });

  it('Should have one button', () => {
    expect(wrapper.find(Button)).toHaveLength(1);
  });
});
