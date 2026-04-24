const express = require("express");
const cors = require("cors");

const {
    processEdges,
    buildGraph,
    detectCycle,
    buildTree,
    getDepth,
    findAllComponents
} = require("./utils");

const app = express();

app.use(cors());
app.use(express.json());

// Helper to detect cycle in a component
function detectCycleComponent(graph, start) {
    const visited = new Set();
    const recStack = new Set();
    let hasCycle = false;
    function dfs(node) {
        if (recStack.has(node)) {
            hasCycle = true;
            return;
        }
        if (visited.has(node)) return;
        visited.add(node);
        recStack.add(node);
        for (let child of graph[node] || []) {
            dfs(child);
        }
        recStack.delete(node);
    }
    dfs(start);
    return hasCycle;
}

app.post(["/bfhl", "/api/bfhl"], (req, res) => {
    const data = req.body.data || [];

    const { validEdges, invalidEntries, duplicateEdges } = processEdges(data);

    const { graph, childSet } = buildGraph(validEdges);

    const nodes = new Set();

    validEdges.forEach(e => {
        const [p, c] = e.split("->");
        nodes.add(p);
        nodes.add(c);
    });

    // Find all connected components (roots or cycles)
    const components = findAllComponents(graph, nodes);

    const hierarchies = [];
    let totalTrees = 0;
    let totalCycles = 0;
    let maxDepth = 0;
    let largestTreeRoot = "";

    for (const comp of components) {
        // Find root: node in comp not in childSet, else lex smallest
        let root = comp.find(n => !childSet.has(n));
        if (!root) root = [...comp].sort()[0];

        // Detect cycle in this component
        const hasCycle = detectCycleComponent(graph, root);

        if (hasCycle) {
            totalCycles++;
            hierarchies.push({
                root,
                tree: {},
                has_cycle: true
            });
        } else {
            const tree = buildTree(graph, root);
            const depth = getDepth(tree);

            totalTrees++;

            if (
                depth > maxDepth ||
                (depth === maxDepth && (largestTreeRoot === "" || root < largestTreeRoot))
            ) {
                maxDepth = depth;
                largestTreeRoot = root;
            }

            hierarchies.push({
                root,
                tree,
                depth
            });
        }
    }

    res.json({
        user_id: "SumanSaurabh_28072004",
        email_id: "suman_saurabh@srmap.edu.in",
        college_roll_number: "AP23110010191",
        hierarchies,
        invalid_entries: invalidEntries,
        duplicate_edges: duplicateEdges,
        summary: {
            total_trees: totalTrees,
            total_cycles: totalCycles,
            largest_tree_root: largestTreeRoot
        }
    });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});