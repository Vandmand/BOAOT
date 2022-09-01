// ===========================================================
// = Renderer Module = Elias Kulmbak = v 3.0.0
// ===========================================================
/*
    This module collects all "rendering functions" from p5.
    All p5 functions like fill(), stroke and other visual 
    only changes in scope of node
*/

// ========== CLASSES ===========

// Custom error class. Used to make custom errors only used in the renderer.
class RenderError extends Error {
    constructor(msg) {
        super(msg);
        this.name = "GOS-Error";
    }
}

// Node class contains all information for node
class Node {
    constructor(name, parent, priority, level) {
        this.name = name;

        this.parent = parent; // The node's parent. For easier access through the tree
        this.children = new Map(); // Data of the node. Contains other nodes and leafs
        this.priority = priority; // Node priority. Defines which sibling is read first
        this.level = level; // Defines nodes level in tree
    }
}
// Varible stores the entire node tree
export const objectList = new Node('ROOT', 'NONE', 0, 0);

// ========== Private Methods =========

// Validate a path and return node at end of path
function valPath(path) {
    if (path.toUpperCase() !== 'ROOT') {
        const pathArr = path.split('.');
        let currNode = objectList;
        pathArr.forEach(nodeName => {
            try {
                currNode = currNode.data.get(nodeName)
            } catch (error) {
                throw new RenderError('Invalid path: ' + path);
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
    const oldData = [...parent.data];
    const leftSide = oldData.filter(entry => { return entry[1].priority <= node.priority ? true : false });
    const rightSide = oldData.filter(entry => { return entry[1].priority > node.priority ? true : false });
    parent.data = new Map([].concat(leftSide, [[node.name, node]], rightSide));

}

// Insert function into node.properties, accounting for priority
function insertFunction(node, func) {
    const properties = node.properties;
    const leftSide = properties.filter(entry => { return entry[1] <= func[1] ? entry : false });
    const rightSide = properties.filter(entry => { return entry[1] > func[1] ? entry : false });
    node.properties = [].concat(leftSide, [func], rightSide);
}

// =========== Public Methods ===========

// Adds a function to a node in the renderer (takes a destination path, and function, to exec)
export function addFunction(path, func, priority) {
    const node = valPath(path);
    insertFunction(node, [func, priority ? priority : 1]);
}
// Clear the functions of a node
export function clearFunction(path) {
    const node = valPath(path);
    node.properties = []
}
// Create a new node
export function createNode(path, name, priority) {
    const parent = valPath(path);
    const level = path.toUpperCase() == 'ROOT' ? 1 : 1 + path.split('.').length;
    insertNode(new Node(name, parent, priority, level));
}
// Delete a node
export function deleteNode(path) {
    const node = valPath(path);
    console.log(node)
    node.parent.data.delete(node.name);
}
// Set the priority of a node 
export function setPriority(path, priority) {
    const node = valPath(path);
    node.priority = priority
    deleteNode(path);
    insertNode(node);
}
// Render everything to canvas (call in draw())
export function render(node = objectList) {
    push();
    node.properties.forEach(func => { func[0](); })
    node.data.forEach(child => { if (child) { render(child) } })
    pop();
}

// =========================================================
//                  Debugging functions
// =========================================================

export const debug = {
    logTree: () => {
        let logStr = " ====== RENDER TREE ====== \n";
        let level = "-"
        function loop(node = rd.objectList) {
            logStr += level + "Name: " + node.name + "\n"
            node.properties.forEach(property => {
                logStr += level + "Func: " + property[0].toString() + " Priority: " + property[1] + "\n"
            })
            logStr += level + "Children:\n"
            level += "-"
            node.data.forEach(child => {
                loop(child);
            })
            level = level.split("")
            level.pop()
            level = level.join("")
        }
        loop();
        console.log(logStr);
    },

}