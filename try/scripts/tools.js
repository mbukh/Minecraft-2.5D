const toolDivs = document.querySelectorAll("#tools > div");

// ===============================================================
// ===============================================================
// Tools
const tools = {
    shovel: {
        name: "shovel",
        canDestroy: [blocks.sand, blocks.grass, blocks.dirt, blocks.snow],
    },
    axe: { name: "axe", canDestroy: [blocks.wood, blocks.leaves] },
    pickaxe: { name: "pickaxe", canDestroy: [blocks.stone] },
    bucket: {
        name: "bucket",
        canDestroy: [blocks.waterDeep, blocks.waterShallow, blocks.water],
    },
    water: { name: blocks.water.name, builds: blocks.water },
    shore: { name: blocks.shore.name, builds: blocks.shore },
    sand: { name: blocks.sand.name, builds: blocks.sand },
    grass: { name: blocks.grass.name, builds: blocks.grass },
    dirt: { name: blocks.dirt.name, builds: blocks.dirt },
    snow: { name: blocks.snow.name, builds: blocks.snow },
    stone: { name: blocks.stone.name, builds: blocks.stone },
};
let currentTool = blocks.shovel;

// Events

toolDivs.forEach((tool) => {
    tool.addEventListener("click", (e) => {
        const image = `./cursors/${tool.id}.png`;
        const toolName = tool.id;
        document.body.style.setProperty("--cursor", `url(${image})`);
        toolDivs.forEach((tool) => tool.classList.remove("active"));
        tool.classList.add("active");
        currentTool = tools[toolName];
    });
});
