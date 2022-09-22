GOS.createNode('root', 'Map', -1, [], class Map{
 constructor(){
    this.worldMap;
 }
 setup(){
    this.worldMap = loadImage('./assets/World Map/4500px-World map.png');
 }

 update(){
    image(this.worldMap, GXY.transform(0,"x"), GXY.transform(0,"y"));
 }



})

