GOS.createNode('root', 'test', 2, class Mono extends GOS.Node {
    constructor(name, parent, priority, level) {
        super(name, parent, priority, level);

        this.x = 2
    }
    testMethod() {
        console.log("Hi I'm a test!")
    }
})