##DISPONES DE EL README EN CASTELLANO AQUÍ [README_ES](https://github.com/carlesnunez/react-native-weather-app/README_ES.md)

![rn](https://img.shields.io/badge/React%20Native--blue.svg)
![ios](https://img.shields.io/badge/IOS--blue.svg)
![android](https://img.shields.io/badge/Android--blue.svg)
![redux](https://img.shields.io/badge/Redux--yellowgreen.svg)
![redux-orm](https://img.shields.io/badge/redux%20thunk--yellowgreen.svg)
![redux-thun](https://img.shields.io/badge/redux%20ORM--yellowgreen.svg)
![jest](https://img.shields.io/badge/Jest%20--green.svg)

# React native + redux-ORM + redux-thunk APP
This article aims to show how to create, test and interact with an API through a time query application by city.

*This application is not intended to teach you how react-native works or redux in depth as it is assumed to be something that is previously known. Nor is it a step-by-step explanation, it is only intended to explain in a general way how redux-orm and redux-thunk are integrated with the whole ecosystem*
### Medium level

![Imgur](http://i.imgur.com/muCu3zo.gif)

## Explanation of the project

The following project is intended to be an application with react-native, redux-orm and redux-thunk that requests the weather data to an AccuWeather api parsee the response, include it in the redux-orm ecosystem and allow us to use it. For this we will use a followed of libraries and methods that will help us with our task. It is very important that we know the previous steps and above all it is redux, react-native and how they work to be able to understand the scope of this project, even so, I will try to be as explicit as possible with each step so that you do not lose detail.

In any case, you can open an issue with things that you do not understand or believe are wrong and can be improved, so we will learn all!

The project has two views:
  - Search for cities.
  - Detail of the selected
  
**Everything clear? So let's start!**

## Defining our data model:
To manage relationships between identifiers and our data we will use a powerful library called [Redux-ORM] (https://github.com/tommikaikkonen/redux-orm) created by [tommikaikkonen] (https://github.com/tommikaikkonen ).

**What is redux-orm **

As they are defined redux orm is a "small" ORM "simple" and "immutable" library that allows us to manage relational data in our redux store.

**Which models will our application have?**

Our application will have two models of redux-orm **city** and **weather**
 - **City** will have:
    Id
    Type
    Name
    Country
    - weatherInfo
 - **weather** will have
    Id
    - previsionText
    - iconId
    Temperature
      
**Defining one of our models**
If you go to the file **src/models/city.js** you can see the following:
```javascript
import { fk, many, attr, Model } from 'redux-orm';
import propTypesMixin from 'redux-orm-proptypes';
import { FILL_CITY_AUTOCOMPLETE, CHECK_CITY_WEATHER } from '../constants/ActionTypes';

const ValidatingModel = propTypesMixin(Model);
export default class City extends ValidatingModel {
    static get fields() {
        return {
            id: attr(),
            type: attr(),
            name: attr(),
            country: attr(),
            weatherInfo: fk('WeatherInfo')
        }
    }
    static get modelName() {
        return 'City';
    }

    static reducer(action, City, session) {
        switch(action.type){
            case FILL_CITY_AUTOCOMPLETE:
            City.all().toModelArray().forEach(city => city.delete());
            const payload = action.response.map((city) => {
                    City.create({
                        id: city.Key,
                        type: city.Type,
                        name: city.LocalizedName,
                        country: city.Country.ID
                    })
            });
            break;
            case CHECK_CITY_WEATHER:
            const weatherInfoID = action.weatherInfo[0].MobileLink.split("/")[6];
            City.withId(weatherInfoID).set('weatherInfo', weatherInfoID);
            break;
        }
    }
}
```
A lot of hit information, right? Do not worry, now break it down:

```javascript
static get fields() {
        return {
            id: attr(),
            type: attr(),
            name: attr(),
            country: attr(),
            weatherInfo: fk('WeatherInfo')
        }
    }
```
In this static method we are only defining a property, called **fields** that serves to define the properties of our City model. In our case we will define our attributes as follows:
  - id: A simple attribute of type ID that will also serve us as primaryKey of our model
  - type: Type of city, in our case it will always be CITY but accuweather sends data from countries and even countries.
  - country: The country in which the city is located, for example [ES] for Spain or [IT] for Italy
  - weatherInfo: This property has a peculiarity since it is of type FK and this means that it has direct relation of many to one with a weatherInfo. Redux ORM has several types of relationships, attr, fk or one to one.

```javascript
  static get modelName() {
        return 'City';
    }
 ```
  
  This static method is also defining a property, in this case **modelName**. This property determines what name this model has within the redux-orm ecosystem. **It is important.**

```javascript
static reducer(action, City, session) {
        switch(action.type){
            case FILL_CITY_AUTOCOMPLETE:
            City.all().toModelArray().forEach(city => city.delete());
            const payload = action.response.map((city) => {
                    City.create({
                        id: city.Key,
                        type: city.Type,
                        name: city.LocalizedName,
                        country: city.Country.ID
                    })
            });
            break;
            case CHECK_CITY_WEATHER:
            const weatherInfoID = action.weatherInfo[0].MobileLink.split("/")[6];
            City.withId(weatherInfoID).set('weatherInfo', weatherInfoID);
            break;
        }
    }
```

We come to the **reducer** method.

By now you will have noticed that all apparent logic related to a model is located within the reduction method of our model. This seems to be very useful because (always maintaining the philosophy of functional programming) our reducer will make the relevant changes ONLY to your model and will return a new state implicitly even if we do not see any return in the function 'Reducer'.

Later on we will explain how this is managed with a case of using the app.

**How to create a 'record' in some reduxORM model?**

Attached in the previous example we can see the following line.

```javascript
 City.create({
                        id: city.Key,
                        type: city.Type,
                        name: city.LocalizedName,
                        country: city.Country.ID
                    })
```

It's that easy. And you will be thinking ... **but if I have a relationship how do I add it?**

```javascript
City.withId(weatherInfoID).set('weatherInfo', weatherInfoID);
```
Same as the previous example. Simply take the record where you want to add the relationship and tell the ID that record you want to relate it. Redux-ORM will be smart enough to make the relationship and solve all problems for us so we can then do something as simple as 'myCity.weatherInfo' to get its related object.

**How to initialize redux orm and its models?**

```javascript
  import City from './city';
  import WeatherInfo from './weatherInfo';

  import { ORM } from 'redux-orm';

  const orm = new ORM();
  orm.register(City, WeatherInfo);

  export default orm;
```

In this file we can see that we import our models, import ORM from the redux-orm library and instantiate it.
Once this is done, we register our models. This tells our ORM instance that it has these two data models. All of our models must be registered.

The reducers must also be initialized in the corresponding combReducers, but that will be explained later.

## Defining our Reducers:

We get to the part of the reducers, to make memory ... What is a reducer?

Following the idea of redux base a reducer must be a PURE FUNCTION that receives an input, perform an action and return a new output, with new output I mean a new object, array or whatever. A pure function should always return the same given the same input and will never do collateral actions such as ... an API request.


```javascript
import { combineReducers } from 'redux';
import { createReducer } from 'redux-orm';
import orm from '../models';

import navReducer from './navReducer';
import { FILL_CITY_AUTOCOMPLETE, OPEN_CITY_LIST,
    CLOSE_CITY_LIST, CHECK_CITY_WEATHER } from '../constants/ActionTypes';

export const root = (state = { cityList: [], selectCityInputOpened: false, selectedCity: '', weatherInfo: null }, action) => {
        switch (action.type) {
            case OPEN_CITY_LIST:
            return {cityList: [], selectCityInputOpened: true, weatherInfo: null };
            case CLOSE_CITY_LIST:
            return { cityList: [], selectCityInputOpened: false, selectedCity: '', weatherInfo: null };
            default:
            return state;
        }
    };

    const rootReducerCombined = combineReducers({ root, navReducer, orm: createReducer(orm) });

    export default rootReducerCombined;
```

As you can see, the use of a reducer in react-native is not far from the use of a reducer in react web since redux is used and nothing more.

But you will say ... hey, you're importing orm and combining like a normal reducer .... Well yes, specifically here:


```javascript
const rootReducerCombined = combineReducers({ root, navReducer, orm: createReducer(orm) }); 
```

As I said before, redux-orm gives us the option to define the reducers that are related to the model in the same but then we have to combine them equally. When passing the instance of orm and call the function ** createReducer ** redux-orm provides us we are creating reducers in themselves and adding them to our redux ecosystem.

As you see, it is entirely plausible to have pure redux reducers and redux-orm reducers at a time.

## Making an api call to receive data. It's time to use REDUX-THUNK:

First of all ... what is [REDUX-THUNK] (https://github.com/gaearon/redux-thunk)?

According to its own documentation, redux-thunk is a [middleware] (http://redux.js.org/docs/advanced/Middleware.html) that allows an action creator to return a function. It can be used to delay the dispatch of an action as well as submit the dispatch of this to a condition and prevent it from being triggered.
Sounds good does not it? Let's look at an example of their own very simple documentation:

```javascript
const INCREMENT_COUNTER = 'INCREMENT_COUNTER';

function increment() {
  return {
    type: INCREMENT_COUNTER
  };
}

function incrementAsync() {
  return dispatch => {
    setTimeout(() => {
      // Yay! Can invoke sync or async actions with `dispatch`
      dispatch(increment());
    }, 1000);
  };
}
```
By this example we delay the call to action increment in 1000 seconds even if our component has already called the action.

**Let's look at a more realistic example**

If you open the file **src/actions/requests.js** you will see the following:

```javascript
import { push } from './navigation';

//UTIL FUNCTIONS HERE:

export const parseResponseAndExecAction = (
                            response, actionToPerform, dispatch) =>
                                            response.json().then((responseJson) => {
                                                if(Array.isArray(actionToPerform)){
                                                    actionToPerform.forEach(action => dispatch(action(responseJson)))
                                                } else {
                                                    dispatch(actionToPerform(responseJson));
                                                }
                                                });

export const doApiCall = (endpoint, options) => {
    return fetch(endpoint, options);
}

//ACTION CREATORS HERE:

export const fillCityAutoComplete = (response) => {
    return {
        type: 'FILL_CITY_AUTOCOMPLETE',
        response,
    };
};

export const navigateToCityDetails = (responseJson) => {
    return push({ key: 'cityDetails', selectedCityId: responseJson[0].MobileLink.split('/')[6] });
}

export const fillCityWeather = (weatherInfo) => {
    return {
        type: 'CHECK_CITY_WEATHER',
        weatherInfo
    }
}

//REDUX-THUNKS FROM HERE:

export function fetchCity(cityName) {
    const APIKEY = 'zOEDguz3RM6DRGh1o9UIm7dCyU4qIlKU';
    const apiUrl = `https://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${APIKEY}&q=${cityName}&language=es`;
    return (dispatch) => {
        return doApiCall(apiUrl).then((response) => parseResponseAndExecAction(response, fillCityAutoComplete, dispatch))
        .catch((error) => {
            console.error(error);
        });
    };
} 

export function checkCityWeather(cityData) {
    const APIKEY = 'zOEDguz3RM6DRGh1o9UIm7dCyU4qIlKU';
    const apiUrl = `https://dataservice.accuweather.com/currentconditions/v1/${cityData.id}?apikey=${APIKEY}&language=es-es&details=true`;

    return (dispatch) => {
        const callbackArray = [
            (response) => fillCityWeather(response, dispatch),
            (response) => navigateToCityDetails(response)
        ];
        return doApiCall(apiUrl).then((response) => parseResponseAndExecAction(response, callbackArray, dispatch))
        .catch((error) => {
            console.error(error);
        });
    };
}
```

Okay, this is big so I'll try to break it down in deph.

When a component performs an action call using dispatch (fetchCity(cityName)) we will call the following function:

```javascript
export function fetchCity(cityName) {
    const APIKEY = 'zOEDguz3RM6DRGh1o9UIm7dCyU4qIlKU';
    const apiUrl = `https://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${APIKEY}&q=${cityName}&language=es`;
    return (dispatch) => {
        return doApiCall(apiUrl).then((response) => parseResponseAndExecAction(response, fillCityAutoComplete, dispatch))
        .catch((error) => {
            console.error(error);
        });
    };
}
```

This function will make a call to our api through doApiCall which is a method that only performs a fetch (). Once the response is received it will return a function that will be called following the normal flow and parses the response (transformed into a valid JSON format) and calls the fillCityAutoComplete action.

**Why should I parse the JSON if the response from my backend already comes in JSON format?**

This question is completely logical but its answer is even more so. The fetch we use does not really make a request using the HTML api. It is react native who intercepts and sends it to the native code of the device so that it is the one that makes the request. Therefore, our answer will not only be the one that comes from our backend but will also be parsed by the device, adding information that may be of interest. Using the '.json ()' method we will get the absolute data of our answer ASYNCHRONOUS.

**Same with checkCityWeather method.**

**NOTE: The parseResponseAndExecAction method is a proprietary method, used to override a little of the logic that requires parsing the response, expecting it to solve the problem and call the action. NOT TO BE USED**


## Integrating REDUX with REACT-NATIVE

 The entire redux ecosystem integrates perfectly with **react-native**. If you have previously worked with react + redux you will know that the components are connected to redux using the ** connect ** method of the 'react-redux' library. In the case of react-native is exactly the same. We separate the components that relate to redux from the ones that do not and we call them **CONTAINERS** a container is: A component that includes the logic necessary to pass to our component its props and its actions through the method **connect (mapStateToProps, MapDispatchToProps)(OurComponent)**
 
 
 An example is the file **src/components/searchScene.js**

 
```javascript
import { connect } from 'react-redux';
import * as requestsActions from '../actions/requests';
import * as cityListActions from '../actions/cityList';
import SearchScene from '../components/searchScene';
import cityListSelector from '../selectors/citySelector';
import React from 'react';

const mapStateToProps = (state) => {
  return {
    cityList: cityListSelector(state),
    selectCityInputOpened: state.root.selectCityInputOpened,
    selectedCity: state.root.selectedCity
  }
}

const mapDispatchToProps = (dispatch) => {
  return ({
    openCityList: () => {
      dispatch(cityListActions.openCityList());
    },
    closeCityList: () => {
      dispatch(cityListActions.closeCityList());
    },
    onDummyButtonClick: (cityName) => {
      dispatch(requestsActions.fetchCity(cityName))
    },
    checkCityWeather: (root) => {
      dispatch(requestsActions.checkCityWeather(root));
    }
  });
};
export default connect(mapStateToProps, mapDispatchToProps)(SearchScene);
```
Let's see, first of all we import:
```javascript
import React from 'react';
import { connect } from 'react-redux';
import * as requestsActions from '../actions/requests';
import * as cityListActions from '../actions/cityList';
import SearchScene from '../components/searchScene';
import cityListSelector from '../selectors/citySelector';
```
- We need to import connect from react-redux.
- We will import ALL of our requests exports and save them under the alias requestsActions.
- Same with cityListActions

We collect our component, this component will be INJECTED with the properties and actions that we decide on the methods mapStateToProps and matchDispatchToProps.

**IMPORTANT** - We import cityListSelector. A selector is nothing more than a function that computes data and returns it formatted. And you say ... and what is it for? Well, this is for example filtering a list of items optimally. Imagine that you want to see only elements with the property VISIBLE to true, because thanks to the selector we could access the list of the state, filter it and return the visible state to true. A selector is also **memoized** that means that our function will only be computed if one of the elements used has changed and that in itself is already super optimum.

More info on selectors and memoization here:
Http://redux.js.org/docs/recipes/ComputingDerivedData.html
Https://en.wikipedia.org/wiki/Memoization

## What does a selector look like?

```javascript
import { createSelector } from 'redux-orm';
import orm from '../models';

const currentCitySelector = createSelector(orm, state => state.orm, (state, props) => props, (session, props) => {
    return session.City.withId(props.selectedCityId);
}
);

export default currentCitySelector;
```

The selectors, at first glance, may seem complicated to try to explain a little. Specifically this selector what it does is to receive some props and to return the City that matches with the selectedCity. To do this access our redux-orm and look for ID in the model CITY la city with the corresponding ID. If that property were changed, currentCitySelector would recompute my city again by returning another.


With this it is explained to my way of seeing all the 'liosas' things of redux + redux-thunk + redux-orm and now ... let's go with a practical case.


#REAL CASE EXAMPLE

**Let's say I want to look for a city**

![Imgur](http://i.imgur.com/fiytEtK.gif)

At the moment I write in the input I am firing the textInput method onChange from **src/components/searchScene.js**
```javascript
onChange={(e)=> e.nativeEvent.text && this.onKeyPress(e.nativeEvent.text)}
```
This calls the ONKEYPRESS method located in this same file, which in turn will call **this.props.onDummyButtonClick(text);**

**onDummyButtonClick** is located in our container and we injected it using mapDispatchToProps, do you remember?

File: **src/containers/searchSceneContainer.js**
Specifically here:
```javascript
const mapDispatchToProps = (dispatch) => {
  return ({
    openCityList: () => {
      dispatch(cityListActions.openCityList());
    },
    closeCityList: () => {
      dispatch(cityListActions.closeCityList());
    },
    onDummyButtonClick: (cityName) => {
      dispatch(requestsActions.fetchCity(cityName))
    },
    checkCityWeather: (root) => {
      dispatch(requestsActions.checkCityWeather(root));
    }
  });
};
```

This will only call fetchCity, passing it the name of the city you just wrote. Let's continue the flow .... if we go to fetchCity, file **src/actions/requests.js** we will find our magnificent redux-thunk doing the request (copy only the function not all the code):

```javascript
export function fetchCity(cityName) {
    const APIKEY = 'zOEDguz3RM6DRGh1o9UIm7dCyU4qIlKU';
    const apiUrl = `https://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${APIKEY}&q=${cityName}&language=es`;
    return (dispatch) => {
        return doApiCall(apiUrl).then((response) => parseResponseAndExecAction(response, fillCityAutoComplete, dispatch))
        .catch((error) => {
            console.error(error);
        });
    };
}
```
As you will remember, this method asks accuWeather for information, receives it, parse and triggers the action **FILL_CITY_AUTOCOMPLETE** 

**And now, what? Then follow the flow, let's look for which model responds to the action** **FILL_CITY_AUTOCOMPLETE**  and we see that the model **src/models/city.js** responds to it doing the following:

```javascript
case FILL_CITY_AUTOCOMPLETE:
            City.all().toModelArray().forEach(city => city.delete());
            const payload = action.response.map((city) => {
                    City.create({
                        id: city.Key,
                        type: city.Type,
                        name: city.LocalizedName,
                        country: city.Country.ID
                    })
            });
            break;
```

This basically the only thing you will do is to CLEAR all our cities and add based on our response, all the new cities that accuweather has sent us.

**And now... who paints these cities?** So we return to our container **src/containers/searchSceneContainer.js**

```javascript
const mapStateToProps = (state) => {
  return {
    cityList: cityListSelector(state),
    selectCityInputOpened: state.root.selectCityInputOpened,
    selectedCity: state.root.selectedCity,
  };
};
```
And we see that we use a selector to collect the cityList of our model in an optimal way.

**And who uses that cityList?** For this we must go to our component **src/components/searchScene.js**

```javascript
  getCityListElement(){
    if(this.props.cityList.length > 0) {
      return  <ListView style={{ flex: 1, backgroundColor: '#ebebeb' }}
        dataSource={this.ds.cloneWithRows(this.props.cityList)}
        enableEmptySections={true}
        renderRow={rowData => this.getCityElement(rowData)}
      />
    }

    return false;
  }
```

Here we see that using a ListView we show the info, only if we have cities in our list.

With this we have an overview of what is a real case of the flow of APP. We have some other but I leave to you to investigate.

I hope you have been of help and would appreciate all the doubts help errors or improvements of this possible example.

Sources and resources of interest:

- https://egghead.io/courses/getting-started-with-redux

- https://github.com/tommikaikkonen/redux-orm-primer

- https://github.com/tommikaikkonen/redux-orm

- https://medium.com/react-native-training/react-native-navigationexperimental-in-depth-6910b9b0b990#.fmlachgxf

