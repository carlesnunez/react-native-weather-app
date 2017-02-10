
# EN CONSTRUCCION

# React native + redux-ORM + redux-thunk APP
Este articulo pretende mostrar como crear, testear e interactuar con una API mediante una aplicacion de consulta del tiempo por ciudad.

*Esta aplicación no pretende enseñarte como funciona react-native o redux a fondo pues se presupone que es algo que previamente se conoce. Tampoco es una explicacion paso a paso, solo pretende explicar en caracter general como se integra redux-orm y redux-thunk con todo el ecosistema*


### Nivel: Medio

![Imgur](http://i.imgur.com/muCu3zo.gif)

##Explicacion del proyecto

El siguiente proyecto pretende ser una aplicacion con react-native, redux-orm y redux-thunk que pida los datos del tiempo a una api de AccuWeather parsee la respuesta, la incluya en el exosistema de redux-orm y nos permita usarla. Para ello usaremos un seguido de librerias y metodos que nos ayudaran con nuestra tarea. Es muy importante que sepamos los pasos previos y sobretodo que es redux, react-native y como funcionan estos para poder llegar a entender la embergadura de este proyecto, aun asi, intentaré ser lo mas explicito posible con cada paso para que no perdais detalle.

En cualquier caso, podeis abrir un issue con las cosas que no entendais o creais que estan mal y se puedan mejorar, asi aprenderemos todos!

El proyecto constara de dos vistas:
  - Busqueda de ciudades.
  - Detalle de la seleccionada
  
**¿Todo claro? Pues empezamos!**

## Definiendo nuestro modelo de datos:
Para gestionar relaciones entre identificadores y nuestros datos vamos a usar una potente libreria llamada [Redux-ORM](https://github.com/tommikaikkonen/redux-orm) creada por [tommikaikkonen](https://github.com/tommikaikkonen). 

**¿Que es redux-rom?**

Tal y como ellos se definen redux orm es una libreria  ORM "pequeña" "simple" e "inmutable" que nos permite gestionar datos relacionales en nuestra store de redux.

**¿Que modelos va a tener nuestra aplicacion?**

Nuestra aplicacion va a tener dos modelos de redux-orm **city** y **weatherInfo**

**Definiendo city**
Si vais al fichero **src/models/city.js** podreis ver lo siguiente:
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
¿Mucha informacion de golpe no? No os preocupeis, ahora lo desglosamos:

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
En este metodo estatico estamos unicamente definiendo una propiedad, llamada **fields** que nos sirve para definir las propiedades de nuestro modelo City. En nuestro caso definiremos nuestros atributos de la siguiente manera:
  - id: Un simple atributo de tipo ID que nos servira tambien como primaryKey de nuestro modelo
  - type: Tipo de city, en nuestro caso siempre sera CITY pero accuweather envia datos de countries e incluso paises.
  - country: El pais en el cual se encuentra la ciudad, por ejemplo [ES] para españa o [IT] para italia
  - weatherInfo: Esta propiedad tiene una peculiaridad ya que es del tipo FK y esto significa que tiene relacion directa de muchos a uno con un weatherInfo. Redux ORM dispone de varios tipos de relaciones many, attr, fk o one to one.
  
```javascript
  static get modelName() {
        return 'City';
    }
 ```
  
  Este metodo estatico tambien esta definiendo una propiedad, en este caso **modelName**. Esta propiedad determina que nombre tiene este modelo dentro del ecosistema de redux-orm. **Es importante.**
  
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

Llegamos al metodo **reducer**.

A estas alturas ya os habreis dado cuenta que toda logica aparente relacionada con un modelo esta situada dentro de el metodo reducer de nuestro modelo. Esto que aparentemente puede resultar lioso es muy util ya que (siempre manteniendo la filosofia de la programacion funcional) nuestro reducer va a realizar los cambios pertinentes UNICAMENTE a su modelo y va a devolver un estado nuevo implicitamente aunque nosotros no veamos ningun return en la funcion 'reducer'.
