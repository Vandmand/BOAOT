// ===========================================================
// = Game Object Manager = Elias Kulmbak = v 3.3.0
// ===========================================================
/**
 * TODO: optimize and don't use get everywhere
 */
'use strict';

import * as Modules from './defaultModules.js'

class GOSError extends Error {
    constructor(msg) {
        super(msg)
        this.name = 'GOS-Error'
    }
}

class EventEmitter {
    /**
     * Custom Event listener
     */

    constructor() {
        this.listeners = [];
        this.toggle = false;
    }

    /**
     * Trigger event
     */

    emit() {
        this.listeners.forEach(callback => {
            callback();
        });
    }

    /**
     * Add Listener to event trigger
     * @param  {Function} callback - Callback function
     */

    onEmit(callback) {
        if (this.toggle) {
            callback();
        } else {
            this.listeners.push(callback);
        }
    }

    /**
     * @param  {Boolean} state - Toggle emitters state
     */

    set(state = !this.toggle) {
        this.toggle = state;
        if(this.toggle){
            this.listeners.forEach(callback => {
                callback();
            })
        }
    }
}

export const initialized = new EventEmitter();

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
    }
}

/**
 * Root reference for tree
 * @const {Object}
 */
export const objectList = new Node('Root', null, -Infinity, 0);

objectList.freeze = true;
objectList.Position = { x: 0, y: 0 }
initialized.onEmit(() => { objectList.freeze = false; })


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
 * @param  {Node} node - Node object to insert
 */

function insertNode(node) {
    const parent = node.parent == null ? objectList : node.parent;

    const oldChildren = [...parent.children];

    const leftSide = oldChildren.filter((entry) => {
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
 * @param  {class} module - Can either be default module or a custom class
 */

export function addModule(node, args, module) {
    node[module.name] = new module(...args);
    node[module.name].node = node;
    if (node[module.name].setup) initialized.onEmit(() => node[module.name].setup());
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
    addModule(Base, [], Modules.Position);

    const DefaultModule = new defaultModule(...args);
    const DefaultExtendBase = Object.assign(DefaultModule, Base);

    if (DefaultExtendBase.setup) { initialized.onEmit(() => { DefaultExtendBase.setup(); }) }

    insertNode(DefaultExtendBase);

    return DefaultExtendBase;
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
 * @param  {} node
 */

window.draw = (node = objectList) => {
    if (node.freeze) { return; }

    push();

    // If update exist
    if (node.update) { node.update() };

    // Repeat for all children
    node.children.forEach((child) => window.draw(child));

    // Revert to before push
    pop();

}


window.setup = () => {
    initialized.set(true);
}

// ========= OTHER ESSENSIALS

export function createGameObject(src) {
    const js = document.createElement('script')
    js.type = 'module'
    js.src = src
    document.body.appendChild(js)
}

const indexedNames = {};
/**
 * Use a string to get indexed version back
 * For spawning GameObjects with same name
 * @param {String} name 
 * @returns Numbered String
 */
export function getIndex(name) {
    if (indexedNames[name] != undefined) {
        return name + indexedNames[name]++;
    } else {
        indexedNames[name] = 0
        return name + indexedNames[name];
    }
}
/**
 * Linear Interpolation of two values
 * @param  {Number} t - Value between 0 and 1
 * @param  {Number} a - Starting point for lerp
 * @param  {Number} b - End point for lerp
 * @return {Number} Value between a and b
 */
export function lerp(t,a = 0,b = 1){
    return a+t*(b-a);
}

export function smoothStep(t,a,b){

}

// debug

class Debugger {
    constructor() {
        this.drawValues = [];
    }
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
    addDrawValue(val) {
        this.drawValues.unshift(val);
        if (this.drawValues.length > 20) {
            this.drawValues.pop();
        }
    }
}

export const debug = new Debugger()
