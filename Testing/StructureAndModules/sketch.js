class Base {
  constructor(a, b){
    this.x = 2;
    this.a = a;
    this.b = b;
  }
  baseMethod(){

  }
  get someGetter(){
    return 2;
  }
}

class ExtentionClass {
  constructor(y){
    this.y = y;
    this.x = 3;
  }
  extentionMethod(){
    return 4;
  }
}

function createNode(){
  const sBase = new Base(2,4);
  const Extention = new ExtentionClass(3);
  return Object.assign(sBase, Extention)

}