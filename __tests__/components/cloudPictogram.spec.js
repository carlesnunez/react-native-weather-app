import 'react-native';
import React from 'react';
import { shallow } from 'enzyme';
import CloudPictogram from '../../src/components/cloudPictogram';
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

describe('<CloudPictogram />', () => {
    it('Input and Button component renders correctly', () => {
      const tree = renderer.create(
        <CloudPictogram weatherIcon={2} />
      );
      const json = tree.toJSON();
      expect(json).toMatchSnapshot();
    });
    const wrapper = shallow(<CloudPictogram weatherIcon={2} />);

    it('Should exists', () => {
        expect(wrapper.length).toEqual(1);
    });
});
