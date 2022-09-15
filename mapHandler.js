GOS.createNode('root', 'Map', -1, [], class Map{
 constructor(){
    this.worldMap;
 }
 setup(){
    this.worldMap = loadImage('./Graphics/World Map/4500px-World map.png');
 }

 update(){
    image(this.worldMap, 0, 0);
 }

})

//=======

