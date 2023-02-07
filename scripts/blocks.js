// ===============================================================
// ===============================================================
// Blocks

const blocks = {
    waterDeep: {
        name: "deep water",
        id: 1,
        near: [1, 2, 3],
        over: [1, 9, 7, 5],
        maxHeight: 1 / 10,
    },
    waterShallow: {
        name: "shallow water",
        id: 2,
        near: [1, 2, 3],
        over: [1, 2, 9, 7, 5],
        maxHeight: 1 / 10,
    },
    water: {
        name: "water",
        id: 3,
        near: [0, 3, 4],
        over: [1, 2, 3, 9, 7, 5],
        maxHeight: 1 / 10,
    },
    shore: {
        name: "shore",
        id: 4,
        near: [4, 5, 6],
        over: [5],
        maxHeight: 1 / 10,
    },
    sand: {
        name: "sand",
        id: 5,
        near: [5, 6, 7, 9],
        over: [5, 7, 9],
        maxHeight: 3 / 10,
    },
    grass: {
        name: "grass",
        id: 6,
        near: [4],
        over: [5, 7, 9],
        maxHeight: 8 / 10,
    },
    dirt: { name: "dirt", id: 7, over: [7, 9], maxHeight: 8 / 10 },
    snow: { name: "snow", id: 8, over: [7, 9], maxHeight: 10 / 10 },
    stone: { name: "stone", id: 9, near: [], over: [], maxHeight: 10 / 10 },
    lava: { name: "lava", id: 10, near: [], over: [], maxHeight: 6 / 10 },
    flowerPoppy: {
        name: "Poppy flower",
        id: 11,
        near: [],
        over: [],
        maxHeight: 10 / 10,
    },
};

function findBlockById(tile) {
    return Object.values(blocks).find((block) => block.id === tile);
}

function makeTileActive(el) {
    el.addEventListener("click", (e) => {
        // Disable while move map or if no tool selected
        if (screenDragging || !currentTool) return;

        // el === e.currentTarget
        const blockDiv = el.parentElement;
        const tileInnerDiv = e.target;

        // get block coordinates X, Y, Z
        const regZ = new RegExp("layer-(\\d+)", "i");
        const regY = new RegExp("y-(\\d+)", "i");
        const regX = new RegExp("x-(\\d+)", "i");
        const originZ = Number(regZ.exec(blockDiv.className)[1]);
        const originY = Number(regY.exec(blockDiv.className)[1]);
        const originX = Number(regX.exec(blockDiv.className)[1]);
        let [targetZ, targetY, targetX] = [originZ, originY, originX];

        if (currentTool["builds"]) {
            // Build Action

            // get click position relative to the element center
            // https://stackoverflow.com/questions/3234256/find-mouse-position-relative-to-element/42111623#42111623
            const rect = tileInnerDiv.getBoundingClientRect();
            const clickX = e.clientX - rect.left - rect.width / 2;
            const clickY = e.clientY - rect.top - rect.height / 2;
            console.log([clickX, clickY]);

            if (clickX > 0 && clickY > 0) {
                // Build to the right
                targetX += 1;
            } else if (clickX < 0 && clickY > 0) {
                // Build to the left
                targetY += 1;
            } else {
                // build to the top
                targetZ += 1;
            }
            // Prepare a new block
            if (!tileExistsOnMap(targetX, targetY, targetZ)) {
                const newTile = setTile(
                    targetX,
                    targetY,
                    targetZ,
                    currentTool.builds.id
                );
                makeTileActive(newTile);
                showTile(targetX, targetY, targetZ);
                // Save data to the map
                mapData[targetZ][targetY][targetX] = currentTool.builds.id;
            } else console.log("can't build there");
        } else if (currentTool.canDestroy.length) {
            // Destroy Action

            // if a hidden tile clicked
            if (e.target.style.classList?.contains("hide")) {
                console.log("no block here");
                return;
            }
            // get block by tileId
            const regTile = new RegExp("tile-(\\d+)", "i");
            const targetBlockId = Number(regTile.exec(e.target.className)[1]);
            const targetBlock = findBlockById(targetBlockId);
            // Check if a tool can destroy it
            if (targetBlock && currentTool.canDestroy.includes(targetBlock)) {
                // Remove the block
                el.classList.add("hide");
                // Save data to the map
                mapData[originZ][originY][originX] = null;
                if (
                    targetBlockId === blocks.shore.id &&
                    currentTool === tools.bucket
                ) {
                    // Replace shore to sand with bucket
                    e.target.classList.remove("tile-4");
                    hideTile(originX, originY, originZ);
                    e.target.classList.add("tile-5");
                    setTimeout(() => showTile(originX, originY, originZ), 1000);
                    mapData[originZ][originY][originX] = blocks.sand.id;
                }
            } else
                console.log(
                    `${currentTool.name} cannot destroy ${targetBlock.name}`
                );
        }
    });
}
