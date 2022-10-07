// ===========================================================
// = Game Object Manager = Elias Kulmbak = v 3.3.0
// ===========================================================
/**
 * TODO: optimize and don't use get everywhere
 */

class GOSError extends Error {
    constructor(msg) {
        super(msg)
        this.name = 'GOS-Error'
    }
}

class Emitter {
    /**
     * Custom Event listener
     * @param  {String} id - Id of the Emitter
     * @param  {Function} resolve - Function triggering Emit event;
     */

    constructor(id, resolve) {
        this.id = id;
        this.resolve = resolve;
        this.listeners = [];
        this.toggle = false;
    }

    /**
     * Trigger event
     */

    emit() {
        console.log(`Emitted: ${this.id}`)
        this.listeners.forEach(callback => {
            callback();
        });
    }

    /**
     * Add Listener to event trigger
     * @param  {Function} callback - Callback function
     */


    addListener(callback) {
        if(this.toggle){
            callback();
        } else {
            this.listeners.push(callback);
        }
    }
    set(state){
        this.toggle = state;
    }
}

export const initialized = new Emitter('initialized');

class Node {
    /**
     * Base Object for any GameObject
     * @param  {String} id - Unique Identification of node
     * @param  {Node} parent - Parent node
     * @param  {Number} priority - Draw order of node (Higher is on top)
     * @param  {Number} level - Level in tree
     */

    constructor(id, parent, priority, level) {
        this.id = id;
        this.parent = parent;
        this.children = new Map();
        this.priority = priority;
        this.level = level;
        this.freeze = false;

        this.init = () => {
            if (initialized && super.setup !== undefined) super.setup();

            delete this.init;
        }
        this.init();
    }
}

const builtInModules = {
    Position: class Position {
        constructor() {
            this.x;
            this.y;
        }

    }
}

/**
 * Root reference for tree
 * @const {Object}
 */
export const objectList = new Node('Root', null, -Infinity, 0);


/**
 * Validate path
 * @param  {String} path - Path to node
 * @return {Node} - Node 
 */

export function get(path) {
    if (path == 'Root') return objectList;

    const pathArr = path.split('.')
    let currNode = objectList
    pathArr.forEach((nodeName) => {

        if (currNode.children.get(nodeName) == undefined) {
            throw new GOSError(`Invalid path: ${path}. ${nodeName} does not exist`);
        }

        currNode = currNode.children.get(nodeName);
    })
    return currNode;
}

/**
 * Inserts node into the tree accounting for priority
 * @param  {Object} node - Node object to insert
 */

function insertNode(node) {
    const parent = node.parent == null ? objectList : node.parent;

    // Sort children
    const oldChildren = [...parent.children]; // Get array of all children

    // Filter both for the priority of the new node:
    const leftSide = oldChildren.filter((entry) => {
        // If same priority new node wins
        return entry[1].priority <= node.priority ? true : false
    })
    const rightSide = oldChildren.filter((entry) => {
        return entry[1].priority > node.priority ? true : false
    })

    // Set result as new Map
    parent.children = new Map([].concat(leftSide, [[node.id, node]], rightSide))
}

/**
 * Adds a module to node
 * @param  {Node} node - Node
 * @param  {Array} args - Arguments for module
 * @param  {String|class} module - Can either be default module or a custom class
 */

export function addModule(node, args, module) {
    const allModules = Object.keys(builtInModules);
    let Module;

    if (allModules.indexOf(module) != -1) {
        Module = builtInModules[module];
    } else {
        Module = module;
    }

    node[Module.name] = new Module(...args)

    if (node[Module.name].setup) initialized.addListener(() => node[Module.name].setup());
}

/**
 * Create a new node
 * @param  {String} path - path to insert node
 * @param  {String} id - id of new node
 * @param  {Number} priority - draworder
 * @param  {Array} args - arguments for defaultModule 
 * @param  {Class} defaultModule - default class for code in node
 */

export function createNode(path, id, priority, args, defaultModule) {
    // Check if node already exists
    // get(`${path}.${id}`);
    // throw new GOSError(`A node with id: ${id} already exists in ${path}`);
    const parent = get(path);
    const level = path == 'Root' ? 1 : 1 + path.split('.').length;

    const Base = new Node(id, parent, priority, level);
    addModule(Base, [], 'Position');

    const Default = new defaultModule(...args);
    const DefaultExtendBase = Object.assign(Base, Default);

    if (DefaultExtendBase.setup) initialized.addListener(() => { DefaultExtendBase.setup(); })

    insertNode(DefaultExtendBase);
}

/**
 * Delete a node from tree
 * @param  {String} path
 */

export function deleteNode(path) {
    const node = get(path)
    node.parent.children.delete(node.id);
}

/**
 * @param  {} node=objectList
 */

window.draw = (node = objectList) => {
    if (!node.freeze) {
        // Make all p5 rendering functions temporary: See p5js.org/reference for reference
        push();

        // Get all the methods of object
        const ownMethods = Object.keys(node);
        const objectMethods = ownMethods.filter((key) => typeof node[key] === 'function');

        // If update exist
        if (objectMethods.indexOf('update') !== -1) node.update();

        // Repeat for all children
        node.children.forEach((child) => window.draw(child));

        // Revert to before push
        pop();
    }
}


window.setup = () => {
    initialized.emit();
    initialized.set(true);
}

// ========= OTHER ESSENSIALS

export function createGameObject(src) {
    const js = document.createElement('script')
    js.type = 'module'
    js.src = src
    document.body.appendChild(js)
}

let indexedNames = {}

export function getIndex(name) {
    if (indexedNames[name] != undefined) {
        return name + indexedNames[name]++;
    } else {
        indexedNames[name] = 0
        return name + indexedNames[name];
    }
}

// debug

class Debugger {
    constructor() { }
    createSimple(path) {
        createNode(path, getIndex('debugSimple'), 4, [], class debugSimple {
            constructor() { }
            update() {
                circle(this.position.x, this.position.y, 100)
            }
        });
    }
    createCircle(path, x, y) {
        createNode(path, getIndex('debugCircle'), 4, [x, y], class debugCircle {
            constructor(x, y) {
                this.x = x
                this.y = y
            }
            update() {
                circle(this.x, this.y, 100)
            }
        });
    }
}

export const debug = new Debugger()
