import City from './city';
import WeatherInfo from './weatherInfo';

import { ORM } from 'redux-orm';

const orm = new ORM();
orm.register(City, WeatherInfo);

export default orm;
