
![rn](https://img.shields.io/badge/React%20Native--blue.svg)
![ios](https://img.shields.io/badge/IOS--blue.svg)
![android](https://img.shields.io/badge/Android--blue.svg)
![redux](https://img.shields.io/badge/Redux--yellowgreen.svg)
![redux-orm](https://img.shields.io/badge/redux%20thunk--yellowgreen.svg)
![redux-thun](https://img.shields.io/badge/redux%20ORM--yellowgreen.svg)
![jest](https://img.shields.io/badge/Jest%20--green.svg)

# React native + redux-ORM + redux-thunk APP
Este articulo pretende mostrar como crear, testear e interactuar con una API mediante una aplicación de consulta del tiempo por ciudad.

*Esta aplicación no pretende enseñarte como funciona react-native o redux a fondo pues se presupone que es algo que previamente se conoce. Tampoco es una explicación paso a paso, solo pretende explicar en caracter general como se integra redux-orm y redux-thunk con todo el ecosistema*


### Nivel: Medio

![Imgur](http://i.imgur.com/muCu3zo.gif)

##Explicación del proyecto

El siguiente proyecto pretende ser una aplicación con react-native, redux-orm y redux-thunk que pida los datos del tiempo a una api de AccuWeather parsee la respuesta, la incluya en el ecosistema de redux-orm y nos permita usarla. Para ello usaremos un seguido de librerías y métodos que nos ayudaran con nuestra tarea. Es muy importante que sepamos los pasos previos y sobretodo que es redux, react-native y como funcionan estos para poder llegar a entender la envergadura de este proyecto, aun así, intentaré ser lo mas explícito posible con cada paso para que no perdáis detalle.

En cualquier caso, podéis abrir un issue con las cosas que no entendáis o creáis que están mal y se puedan mejorar, así aprenderemos todos!

El proyecto constara de dos vistas:
  - Busqueda de ciudades.
  - Detalle de la seleccionada
  
**¿Todo claro? Pues empezamos!**

## Definiendo nuestro modelo de datos:
Para gestionar relaciones entre identificadores y nuestros datos vamos a usar una potente librería llamada [Redux-ORM](https://github.com/tommikaikkonen/redux-orm) creada por [tommikaikkonen](https://github.com/tommikaikkonen). 

**¿Que es redux-rom?**

Tal y como ellos se definen redux orm es una libreria  ORM "pequeña" "simple" e "inmutable" que nos permite gestionar datos relacionales en nuestra store de redux.

**¿Que modelos va a tener nuestra aplicación?**

Nuestra aplicacion va a tener dos modelos de redux-orm **city** y **weather**
 - **City** tendrá:
    - id
    - type
    - name
    - country
    - weatherInfo
 - **weather** tendrá
    - id
    - previsionText
    - iconId
    - temperature
      
**Definiendo uno de nuestros modelos**
Si vais al fichero **src/models/city.js** podréis ver lo siguiente:
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
¿Mucha informacion de golpe no? No os preocupéis, ahora lo desglosamos:

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
En este método estático estamos únicamente definiendo una propiedad, llamada **fields** que nos sirve para definir las propiedades de nuestro modelo City. En nuestro caso definiremos nuestros atributos de la siguiente manera:
  - id: Un simple atributo de tipo ID que nos servirá también como primaryKey de nuestro modelo
  - type: Tipo de city, en nuestro caso siempre sera CITY pero accuweather envía datos de countries e incluso países.
  - country: El pais en el cual se encuentra la ciudad, por ejemplo [ES] para España o [IT] para Italia
  - weatherInfo: Esta propiedad tiene una peculiaridad ya que es del tipo FK y esto significa que tiene relación directa de muchos a uno con un weatherInfo. Redux ORM dispone de varios tipos de relaciones many, attr, fk o one to one.

```javascript
  static get modelName() {
        return 'City';
    }
 ```
  
  Este método estático también esta definiendo una propiedad, en este caso **modelName**. Esta propiedad determina que nombre tiene este modelo dentro del ecosistema de redux-orm. **Es importante.**
  
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

Llegamos al método **reducer**.

A estas alturas ya os habréis dado cuenta que toda lógica aparente relacionada con un modelo esta situada dentro de el método reducer de nuestro modelo. Esto que aparentemente puede resultar lioso es muy útil ya que (siempre manteniendo la filosofía de la programación funcional) nuestro reducer va a realizar los cambios pertinentesÚNICAMENTE a su modelo y va a devolver un estado nuevo implícitamente aunque nosotros no veamos ningún return en la función 'reducer'.

Mas adelante explicaremos como se gestiona todo esto con un caso de uso de la app.

**¿Como se crea un 'record' en algún modelo de reduxORM?**

Fijandonos en el ejemplo anterior podemos ver la siguiente linea.

```javascript
 City.create({
                        id: city.Key,
                        type: city.Type,
                        name: city.LocalizedName,
                        country: city.Country.ID
                    })
```

Es asi de simple. Y estareis pensando... **¿pero si tengo una relación cómo hago para añadirla?**

```javascript
City.withId(weatherInfoID).set('weatherInfo', weatherInfoID);
```
Igual de simple que el ejemplo anterior. Simplemente coged el record donde queráis añadir la relación y decirle a la ID de que record queréis relacionarla. Redux-ORM sera suficientemente inteligente de hacer la relación y solucionar todos los problemas por nosotros para que luego podamos hacer algo tan sencillo como 'miCiudad.weatherInfo' para obtener su objeto relacionado.

**¿Cómo se inicializa redux orm y sus modelos?**

```javascript
  import City from './city';
  import WeatherInfo from './weatherInfo';

  import { ORM } from 'redux-orm';

  const orm = new ORM();
  orm.register(City, WeatherInfo);

  export default orm;
```

En este fichero podemos ver que importamos nuestros modelos, importamos ORM de la libreria redux-orm y lo instanciamos.
Una vez hecho esto, registramos nuestros modelos. Esto le dice a nuestra instancia de ORM que tiene estos dos modelos de datos. Hay que registrar TODOS nuestros modelos.

Los reducers también deben ser inicializados en el combineReducers correspondiente, pero eso lo explicaremos mas adelante.

## Definiendo nuestros Reducers:

Llegamos a la parte de los reducers, para hacer memoria... ¿Qué es un reducer?

Siguiendo la idea de redux base un reducer debe ser una FUNCIÓN PURA que reciba un input, realice una acción y devuelva un output nuevo, con output nuevo quiero decir un nuevo objeto, array o lo que sea. Una función pura siempre deberá devolver lo mismo dado un mismo input y nunca hará acciones colaterales como por ejemplo... una API request.

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

Como podeis observar, el uso de un reducer en react-native no dista en NADA a el uso de un reducer en react web ya que se usa redux y nada más.

Pero direis... oye, estas importando orm y combiandolo como un reducer normal....Pues sí, concretamente aquí:

```javascript
const rootReducerCombined = combineReducers({ root, navReducer, orm: createReducer(orm) }); 
```


Como dije antes, redux-orm nos da la opción de definir los reducers que tienen relación con el modelo en el mismo pero luego hay que combinarlos igual. Al pasarle la instancia de orm y llamar a la función **createReducer** que redux-orm nos proporciona estamos creando reducers en si mismos y añadiendolos a nuestro ecosistema de redux.

Como veis, es totalmente plausible tener reducers puros de redux y reducers de redux-orm a la vez.

##Haciendo una api call para recibir datos. Llego el momento de usar REDUX-THUNK:

¿Primero de todo... que es [REDUX-THUNK](https://github.com/gaearon/redux-thunk)?

Acorde con su propia documentación redux-thunk es un [middleware](http://redux.js.org/docs/advanced/Middleware.html) que nos permite a un action creator devolver una función. Puede ser usado para retrasar el dispatch de una acción así como someter el dispatch de esta a una condición y evitar que la misma se dispare.
¿Suena bien no? Veamos un ejemplo de su propia documentación muy simple:


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
Mediante este ejemplo retrasamos la llamada a la accion increment en 1000 segundos aun si nuestro componente ya ha llamado a la accion.

**Vamos a por un ejemplo más realista**

Si abris el fichero **src/actions/requests.js** vereis lo siguiente:

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

Vale, esto es grande asi que intentare desglosarlo al maximo.

Cuando un componente realiza una action call usando dispatch(fetchCity(cityName)) llamaremos a la siguiente funcion:

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

Esta función realizara una llamada a nuestra api mediante doApiCall que es un método que únicamente realiza un fetch(). Una vez recibida la response devolverá una función que sera llamada siguiendo el flujo normal y parseara la response(transformara a un formato JSON valido) y llamara a la acción fillCityAutoComplete.

**¿Porque debo parsear el JSON si realmente la respuesta de mi backend ya viene en formato JSON?**

Esta pregunta es totalmente lógica pero su respuesta lo es aun más. El fetch que usamos, realmente no hace una request mediante la api de HTML. Es react native quien la intercepta y envia al codigo nativo del dispositivo para que sea este quien realice la petición. Por lo tanto, nuestra respuesta no sera únicamente la que venga por parte de nuestro backend si no que sera parseada también por el dispositivo, añadiendo información que pueda ser de interés. Mediante el método '.json()'  obtendremos ASINCRONAMENTE los datos absolutos de nuestra respuesta.

**Lo mismo con el método checkCityWeather.** 

**NOTA: EL METODO parseResponseAndExecAction ES UN METODO PROPIO MIO, USADO PARA ABSTRAERNOS UN POCO DE LA LOGICA QUE REQUIERE PARSEAR LA RESPONSE, ESPERAR A QUE RESUELVA LA PROMISE Y LLAMAR A LA ACCION. NO ES NECESARIO USARLO**


##Integrando REDUX con REACT-NATIVE

 Todo el ecosistema de **redux** se integra a la perfección con **react-native**. Si habeis trabajado previamente con react+redux sabreis que los componentes se conectan a redux mediante el método **connect** de la librería 'react-redux'. En el caso de react-native es exactamente lo mismo. Separamos los componentes que tienen relación con redux de los que no y los llamamos **CONTAINERS** un container es: Un componente que incluye la lógica necesaria para pasar a nuestro componente sus props y sus acciones mediante el método **connect(mapStateToProps, mapDispatchToProps)(NuestroComponente)**
 
 
 Un ejemplo es el del fichero **src/components/searchScene.js**
 
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
Veamos, primero de todo importamos:
```javascript
import React from 'react';
import { connect } from 'react-redux';
import * as requestsActions from '../actions/requests';
import * as cityListActions from '../actions/cityList';
import SearchScene from '../components/searchScene';
import cityListSelector from '../selectors/citySelector';
```
- Importamos connect de react-redux.
- Importaremos TODOS nuestros exports de requests y los guardaremos bajo el alias requestsActions. 
- Lo mismo con cityListActions

Recogemos nuestro componente, este componente sera INYECTADO con las propiedades y las acciones que nosotros decidamos en los métodos mapStateToProps y matchDispatchToProps. 

**IMPORTANTE** - Importamos cityListSelector. Un selector no es mas que una función que computa datos y los devuelve formateados. Y diréis... y esto para que sirve? Bien, esto sirve para por ejemplo filtrar una lista de elementos de manera optima. Imaginaos que queréis ver solo elementos con la propiedad VISIBLE a true, pues gracias a el selector podríamos acceder a la lista del estado, filtrarla y devolver el estado visible a true. Un selector también es **memoized** eso quiere decir que nuestra función solo se computara si uno de los elementos usados ha cambiado y eso en si ya es super optimo.

Mas info sobre selectores y memoization aquí:
http://redux.js.org/docs/recipes/ComputingDerivedData.html
https://en.wikipedia.org/wiki/Memoization

##Que aspecto tiene un selector?

```javascript
import { createSelector } from 'redux-orm';
import orm from '../models';

const currentCitySelector = createSelector(orm, state => state.orm, (state, props) => props, (session, props) => {
    return session.City.withId(props.selectedCityId);
}
);

export default currentCitySelector;
```

Los selectores, a simple vista, pueden parecer complicados intentar explicarlo un poco. En concreto este selector lo que hace es recibir unas props y devolver la City que hace match con la selectedCity. Para ello accede a nuestro redux-orm y busca por ID en el modelo CITY la city con el ID correspondiente. Si esa propiedad cambiase, currentCitySelector recomputaria de nuevo mi ciudad devolvíendome otra.


Con esto queda explicada a mi modo de ver todas las cosas 'liosas' de redux + redux-thunk + redux-orm y ahora... vamos con un caso practico.

#CASO DE USO PRÁCTICO

**Supongamos que quiero buscar una ciudad**

![Imgur](http://i.imgur.com/fiytEtK.gif)

En el momento en el que yo escribo en el input estoy disparando el metodo onChange del textInput de **src/components/searchScene.js**
```javascript
onChange={(e)=> e.nativeEvent.text && this.onKeyPress(e.nativeEvent.text)}
```
Esto llama al metodo ONKEYPRESS situado en este mismo fichero, que a su vez llamara a **this.props.onDummyButtonClick(text);**

**onDummyButtonClick** esta situado en nuestro container y se lo hemos inyectado mediante mapDispatchToProps, ¿recordais?

Fichero: **src/containers/searchSceneContainer.js**

Concretamente aquí:
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

Esto solo llamará a fetchCity, pasandole el nombre de la ciudad que acabais de escribir. Sigamos el flujo.... si nos vamos a fetchCity, fichero **src/actions/requests.js** nos encontraremos nuestro magnifico redux-thunk haciendo la peticion (copio solo la funcion no todo el codigo): 

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

Como recordareis, este metodo pide a accuWeather la informacion, la recibe, parsea y dispara la accion **FILL_CITY_AUTOCOMPLETE**... **Y ahora, que? Pues seguimos el flujo, vamos a buscar que modelo responde a la accion** **FILL_CITY_AUTOCOMPLETE**... y vemos que el modelo **src/models/city.js** responde a ella realizando la siguiente logica:
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

Esto basicamente lo unico que va a hacer es BORRAR todas nuestras ciudades y añadir en base a nuestra response, todas las nuevas ciudades que accuweather nos ha enviado.

**Y ahora... quien pinta estas ciudades?** Pues volvemos a nuestro container **src/containers/searchSceneContainer.js**

```javascript
const mapStateToProps = (state) => {
  return {
    cityList: cityListSelector(state),
    selectCityInputOpened: state.root.selectCityInputOpened,
    selectedCity: state.root.selectedCity,
  };
};
```
Y vemos que usamos un selector para recoger la cityList de nuestro modelo de manera optima.

**¿Y quien usa esa cityList?** Para ello debemos ir a nuestro componente **src/components/searchScene.js**
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
Aqui vemos que mediante una ListView mostramos la info, solo si tenemos ciudades en nuestra lista.


Con esto tenemos una vision general de lo que es un caso real del flujo de la APP. Tenemos algun otro pero os dejo a vosotros investigar.

Espero que os haya sido de ayuda y agradeceria todas las dudas ayudas errores o mejoras de este ejemplo posibles.

Fuentes y recursos de interes:

- https://egghead.io/courses/getting-started-with-redux

- https://github.com/tommikaikkonen/redux-orm-primer

- https://github.com/tommikaikkonen/redux-orm

- https://medium.com/react-native-training/react-native-navigationexperimental-in-depth-6910b9b0b990#.fmlachgxf

