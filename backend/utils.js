function isValidEdge(str) {
    if (!str || typeof str !== "string") return false;
    str = str.trim();
    const regex = /^[A-Z]->[A-Z]$/;
    if (!regex.test(str)) return false;
    const [parent, child] = str.split("->");
    if (parent === child) return false;
    return true;
}

function processEdges(data) {
    const validEdges = [];
    const invalidEntries = [];
    const duplicateEdges = [];
    const seen = new Set();
    for (let edge of data) {
        edge = edge.trim();
        if (!isValidEdge(edge)) {
            invalidEntries.push(edge);
            continue;
        }
        if (seen.has(edge)) {
            if (!duplicateEdges.includes(edge)) {
                duplicateEdges.push(edge);
            }
            continue;
        }
        seen.add(edge);
        validEdges.push(edge);
    }
    return { validEdges, invalidEntries, duplicateEdges };
}

function buildGraph(edges) {
    const graph = {};
    const childSet = new Set();
    for (let edge of edges) {
        const [parent, child] = edge.split("->");
        if (!graph[parent]) graph[parent] = [];
        graph[parent].push(child);
        childSet.add(child);
    }
    return { graph, childSet };
}

function detectCycle(graph) {
    const visited = new Set();
    const recStack = new Set();
    function dfs(node) {
        if (recStack.has(node)) return true;
        if (visited.has(node)) return false;
        visited.add(node);
        recStack.add(node);
        for (let neighbor of graph[node] || []) {
            if (dfs(neighbor)) return true;
        }
        recStack.delete(node);
        return false;
    }
    for (let node in graph) {
        if (dfs(node)) return true;
    }
    return false;
}

function buildTree(graph, root) {
    function dfs(node) {
        let obj = {};
        for (let child of graph[node] || []) {
            obj[child] = dfs(child);
        }
        return obj;
    }
    return { [root]: dfs(root) };
}

function getDepth(tree) {
    function dfs(node) {
        if (!node || Object.keys(node).length === 0) return 1;
        let max = 0;
        for (let key in node) {
            max = Math.max(max, dfs(node[key]));
        }
        return 1 + max;
    }
    const rootKey = Object.keys(tree)[0];
    return dfs(tree[rootKey]);
}

function findAllComponents(graph, allNodes) {
    const visited = new Set();
    const components = [];
    for (let node of allNodes) {
        if (visited.has(node)) continue;
        const comp = [];
        function dfs(n) {
            if (visited.has(n)) return;
            visited.add(n);
            comp.push(n);
            for (let child of graph[n] || []) {
                dfs(child);
            }
        }
        dfs(node);
        components.push(comp);
    }
    return components;
}

module.exports = {
    processEdges,
    buildGraph,
    detectCycle,
    buildTree,
    getDepth,
    findAllComponents
};