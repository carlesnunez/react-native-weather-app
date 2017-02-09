import { factory } from 'factory-girl';
import bluebird from 'bluebird';
import orm from '../../src/models';
import { ReduxORMAdapter } from '../utils';

factory.define('WeatherInfo', 'WeatherInfo', {
    id: factory.sequence(n => n),
    previsionText: factory.chance('sentence'),
    iconId: factory.chance('natural', { min: 1, max: 40 }),
    temperature: factory.chance('integer', { min: -40, max: 40 }),
});

factory.define('CityWithoutWeather', 'City', {
    id: 308526,
    type: factory.sequence(n => `City${n}`),
    name: factory.chance('city'),
    country: factory.chance('country')
});

factory.define('WeatherInfoFixedId', 'WeatherInfo', {
    id: 308526,
    previsionText: factory.chance('sentence'),
    iconId: factory.chance('natural', { min: 1, max: 40 }),
    temperature: factory.chance('integer', { min: -40, max: 40 }),
});

factory.define('City', 'City', {
    id: factory.sequence(n => n),
    type: factory.sequence(n => `City${n}`),
    name: factory.chance('city'),
    country: factory.chance('country'),
    weatherInfo: factory.assoc('WeatherInfo', 'id'),
});

export default factory;
