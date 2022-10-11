GOS.createNode('Game', 'Map', -1, [], class Map {
   constructor() {
      this.worldMap;
   }
   setup() {
      this.worldMap = loadImage('./assets/world map/4500px-World map.png');
   }
   update() {
      image(this.worldMap, this.Position.x, this.Position.y);
   }
});

