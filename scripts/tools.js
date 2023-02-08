// ===============================================================
// ===============================================================
// Tools

const tools = {
    shovel: {
        name: "shovel",
        canDestroy: [blocks.sand, blocks.grass, blocks.dirt, blocks.snow],
    },
    axe: {
        name: "axe",
        canDestroy: [blocks.wood, blocks.leaves, blocks.flowerPoppy],
    },
    pickaxe: { name: "pickaxe", canDestroy: [blocks.stone] },
    bucket: {
        name: "bucket",
        canDestroy: [
            blocks.waterDeep,
            blocks.waterShallow,
            blocks.water,
            blocks.shore,
            blocks.lava,
        ],
    },
    water: {
        name: blocks.water.name,
        id: blocks.water.id,
        builds: blocks.water,
    },
    shore: {
        name: blocks.shore.name,
        id: blocks.shore.id,
        builds: blocks.shore,
    },
    sand: { name: blocks.sand.name, id: blocks.sand.id, builds: blocks.sand },
    grass: {
        name: blocks.grass.name,
        id: blocks.grass.id,
        builds: blocks.grass,
    },
    dirt: { name: blocks.dirt.name, id: blocks.dirt.id, builds: blocks.dirt },
    snow: { name: blocks.snow.name, id: blocks.snow.id, builds: blocks.snow },
    stone: {
        name: blocks.stone.name,
        id: blocks.stone.id,
        builds: blocks.stone,
    },
    lava: { name: blocks.lava.name, id: blocks.lava.id, builds: blocks.lava },
    flowerPoppy: {
        name: blocks.flowerPoppy.name,
        id: blocks.flowerPoppy.id,
        builds: blocks.flowerPoppy,
    },
};

// functions

function handleToolsClicks(e) {
    const tool = e.target;
    const image = `../assets/cursors/${tool.id}.png`;
    const toolName = tool.id;
    document.body.style.setProperty("--cursor", `url(${image})`);
    Array.from(toolsDiv.children).forEach((tool) =>
        tool.classList.remove("active")
    );
    tool.classList.add("active");
    currentTool = tools[toolName];
}
