// ===========================================================
// = Game Object Manager = Elias Kulmbak = v 3.0.0
// ===========================================================

let initialized = false;

// ========== CLASSES ===========

// Custom error class. Used to make custom errors only used in the renderer.
class GOSError extends Error {
    constructor(msg) {
        super(msg);
        this.name = "GOS-Error";
    }
}

// Varible stores the entire node tree
const rootClass = createClass(class Root { constructor() { } })
export const objectList = new rootClass('ROOT', 'NONE', -Infinity, 0, [])

// ========== Public Methods =========

// Validate a path and return node at end of path
export function get(path) {
    if (path.toUpperCase() !== 'ROOT') {
        const pathArr = path.split('.');
        let currNode = objectList;
        pathArr.forEach(nodeName => {
            try {
                currNode = currNode.children.get(nodeName)
            } catch (error) {
                throw new GOSError('Invalid path: ' + error);
            }
        });
        return currNode
    } else {
        return objectList;
    }
}

// Insert node into node.data, accounting for priority
function insertNode(node) {
    const parent = node.parent == 'NONE' ? objectList : node.parent;
    const oldChildren = [...parent.children];
    const leftSide = oldChildren.filter(entry => { return entry[1].priority <= node.priority ? true : false });
    const rightSide = oldChildren.filter(entry => { return entry[1].priority > node.priority ? true : false });
    parent.children = new Map([].concat(leftSide, [[node.id, node]], rightSide));
}

function createClass(customClass) {
    const newClass = class Node extends customClass {
        constructor(id, parent, priority, level, args) {
            super(...args)
            this.id = id;
            this.parent = parent; // The node's parent. For easier access through the tree
            this.children = new Map(); // Data of the node. Contains other nodes and leafs
            this.priority = priority; // Node priority. Defines which sibling is read first
            this.level = level; // Defines nodes level in tree
            this.freeze = false; // Freeze node affects draw()
            this.localCoordinates = {x:0,y:0}; // Defines coordinates of local object
            this.useLocalCoordinates = false // Defines whether or not to use local or global coordinates

            this.init = () => {
                if (initialized) {
                    if (super.setup) {
                        super.setup();
                    }
                }
                delete (this.init);
            }
            this.init();
        }
    }
    return newClass
}

// Create a node
export function createNode(path, id, priority, args, classBody) {
    const parent = get(path);
    const level = path.toUpperCase() == 'ROOT' ? 1 : 1 + path.split('.').length;
    const customClass = createClass(classBody)
    insertNode(new customClass(id, parent, priority, level, args));
}

// Delete a node
export function deleteNode(path) {
    const node = get(path);
    node.parent.children.delete(node.id);
}

window.draw = (node = objectList) => {
    if (!node.freeze) {
        push();

        const ownMethods = Object.keys(node);
        const parentMethods = Object.getOwnPropertyNames(node.__proto__.__proto__);
        const objectMethods = ownMethods.concat(parentMethods).filter(key => typeof node[key] === 'function')

        if (objectMethods.indexOf('update') != -1) {
            node.update();
        }
        node.children.forEach(child => window.draw(child))
        pop();
    }
}

window.setup = (node = objectList) => {

    const ownMethods = Object.keys(node);
    const parentMethods = Object.getOwnPropertyNames(node.__proto__.__proto__);
    const objectMethods = ownMethods.concat(parentMethods).filter(key => typeof node[key] === 'function')

    if (objectMethods.indexOf('setup') != -1) {
        node.setup();
    }
    node.children.forEach(child => window.setup(child))
    initialized = true
}


// ========= OTHER ESSENSIALS

export function createGameObject(src) {
    const js = document.createElement("script");
    js.type = 'module';
    js.src = src
    document.body.appendChild(js);
}

export function setRefference(path) {
    
}