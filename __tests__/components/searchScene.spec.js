import 'react-native';
import React from 'react';
import {View, TouchableWithoutFeedback, TextInput, ListView} from 'react-native';
import { shallow } from 'enzyme';
import SearchScene from '../../src/components/searchScene';
import LogoClouds from '../../src/components/logoClouds';
import CityElement from '../../src/components/cityElement';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

describe('<SearchScene />', () => {
    let cityList = [{"id":"316938","type":"City","name":"Ankara","country":"TR"},{"id":"182536","type":"City","name":"Atenas","country":"GR"},{"id":"126995","type":"City","name":"Alejandría","country":"EG"},{"id":"56912","type":"City","name":"Anqing","country":"CN"},{"id":"202438","type":"City","name":"Ahmedabad","country":"IN"},{"id":"102138","type":"City","name":"Anshan","country":"CN"},{"id":"59083","type":"City","name":"Anyang","country":"CN"},{"id":"178551","type":"City","name":"Acra","country":"GH"},{"id":"126831","type":"City","name":"Adís Abeba","country":"ET"},{"id":"221790","type":"City","name":"Amán","country":"JO"}];
    // it('Input and Button component renders correctly', () => {
    //   const tree = renderer.create(
    //     <SearchScene cityList={cityList} />
    //   );
    //   const json = tree.toJSON();
    //   expect(json).toMatchSnapshot();
    // });
    const wrapper = shallow(<SearchScene cityList={cityList} />);

    it('Should exists', () => {
        expect(wrapper.length).toEqual(1);
    });

    it('Should have one two views', () => {
        expect(wrapper.find(View)).toHaveLength(3)
    })

    it('Should have touchable without feedback', () => {
        expect(wrapper.find(TouchableWithoutFeedback)).toHaveLength(1)
    })

    it('Should have one logoClouds', () => {
        expect(wrapper.find(LogoClouds)).toHaveLength(1)
    })

    it('Should have one textInput', () => {
        expect(wrapper.find(TextInput)).toHaveLength(1)
    })

    it('Should have one ListView', () => {
        expect(wrapper.find(ListView)).toHaveLength(1)
    })
});
