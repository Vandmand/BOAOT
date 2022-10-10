import { cityData } from '../modules/cityData.js'
import * as classes from './city.js';

let difficulty = 3; //increase to make cities spawn further away from each other

GOS.createNode('Game', 'CityManager', 1, [], class CityManager {
    constructor() {
        this.cities = [];
        this.counter = 0;
        this.cityGraphics = []; //it's loaded in the city manager to reduce stress
        this.citySoundEffect;
    }
    createCity(x, y, id, Graphics = this.cityGraphics) {
        GOS.createNode('Game.CityManager', id, 1, [x,y,Graphics], classes.City);


        if (typeof id === 'string') {
            this.cities.push(GOS.get('Game.CityManager.' + id));
        }
    }

    // ======== cityHandler Methods =======
    setup() {
        this.cityGraphics = [
            loadImage('./assets/city icon/City_logo.png'),
            loadImage('./assets/city icon/City_logo_dying.png'),
            loadImage('./assets/city icon/City_logo_extra_dying.png')
        ]
        this.gameStart();
        this.citySoundEffect = loadSound('./assets/sound/Whoosh.mp3');
    }

    gameStart() { //upon game start, 2 cities must be initilized before we assign them trade
        //start city:
        const cityDataIndex = Math.floor(Math.random() * (cityData.length - 1));
        this.createCity(cityData[cityDataIndex].x, cityData[cityDataIndex].y, cityData[cityDataIndex].name);

        let city1 = cityData[cityDataIndex];
        cityData.splice(cityDataIndex, 1);
        //sorts all cities in decending order acording to distance to city1:
        cityData.sort((a, b) => dist(city1.x, city1.y, a.x, a.y) - dist(city1.x, city1.y, b.x, b.y))
        //it then chooses a random of the 3 element and makes a city
        const cityIndex2 = Math.floor(Math.random() * 2);
        this.createCity(cityData[cityIndex2].x, cityData[cityIndex2].y, cityData[cityIndex2].name);
        cityData.splice(cityDataIndex, 1);

        this.assignTrade();

    }

    tryForCity() {
        if (Math.random() * 1000 < this.counter / 1000) {
            let cityDataIndex = Math.floor(Math.random() * difficulty);
            this.createCity(cityData[cityDataIndex].x, cityData[cityDataIndex].y, cityData[cityDataIndex].name);
            cityData.splice(cityDataIndex, 1);
            this.citySoundEffect.play();

            this.assignTrade();
            this.counter = 0;
        } else { this.counter++; }
    }

    update() {
        if (cityData.length != 0) {
            this.tryForCity();
        }

    }

    assignTrade() { //assigns import and export in pairs
        let i = 0;
        while (typeof this.cities[i].tradeExport !== 'undefined' && this.cities.length - 1 > i) { i++; }
        if (this.cities.length - 1 >= i + 1) {
            this.cities[i].tradeExport = this.cities[i + 1];
            this.cities[i + 1].tradeImport = this.cities[i];
        } else { throw RangeError('Not enough unassigned cities to assign trade'); }

    }
})

