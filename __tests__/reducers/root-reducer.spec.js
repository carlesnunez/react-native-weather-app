
    import { root } from '../../src/reducers/root-reducer';
    import * as types from '../../src/constants/ActionTypes';

    describe('root reducer', () => {
        it('should return default state', () => {
            expect(root(undefined, {})).toEqual({ cityList: [], selectCityInputOpened: false, selectedCity: '', weatherInfo: null })
        });

        it('should return open city list state', () => {
            expect(
                root(
                    {
                        cityList: [], selectCityInputOpened: false, selectedCity: '', weatherInfo: null
                    },
                    {
                        type: types.OPEN_CITY_LIST
                    }
                )
            ).toEqual(
                {
                    cityList: [], selectCityInputOpened: true, selectedCity: '', weatherInfo: null
                }
            )
        });

        it('should return close city list state', () => {
            expect(
                root(
                    {
                        cityList: [], selectCityInputOpened: true, selectedCity: '', weatherInfo: null
                    },
                    {
                        type: types.CLOSE_CITY_LIST
                    }
                )
            ).toEqual(
                {
                    cityList: [], selectCityInputOpened: false, selectedCity: '', weatherInfo: null
                }
            )
        });
    })
