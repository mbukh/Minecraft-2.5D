"use strict";
// based on a JQuery version https://codepen.io/rdfriedl/pen/bdvrjM
// Robert Friedl https://github.com/rdfriedl
// refactored for vanilla js by MBUKH.DEV

const mapsContainer = document.querySelector("#mapsContainer");
const zoom = document.querySelector("h2 > span");
const mapPosition = {};
const tileTemplate = document.querySelector("body>.tile").cloneNode(true);
document.querySelector("body>.tile").remove(); // remove template
const MAX_ZOOM = 4;
const MIN_ZOOM = 0.3;
const GAP_X = 3.5;
const GAP_Y = 3.5;
const LAYERS_GAP = 2.7;
let screenReadyToDrag = false;
let screenDragging = false;

// ===============================================================
// ===============================================================
// Tiles creation
const createTile = (x, y, layer, tileId) => {
    const cell = getCell(y, x, layer);
    let tile = cell.querySelector(".tile");
    if (!tile) {
        tile = tileTemplate.cloneNode(true);
        tile.style.setProperty("z-index", (layer + 1) * 1000 + x + y);
        cell.appendChild(tile);
    }
    const innerDiv = tile.querySelector("div");
    innerDiv.className = `tile-${tileId}`;
    return tile;
};

const getCell = (y, x, layer) => {
    const layerDiv = getLayer(layer);
    let cell = mapsContainer.querySelector(`.y-${y}.x-${x}.layer-${layer}`);
    if (!cell) {
        let transformX, transformY;
        cell = document.createElement("div");
        cell.classList.add(`y-${y}`);
        cell.classList.add(`x-${x}`);
        cell.classList.add(`layer-${layer}`);
        transformX = `translateX(${x * GAP_X}em)`;
        transformY = `translateY(${y * GAP_Y}em)`;
        cell.style.setProperty("transform", `${transformX} ${transformY}`);
        layerDiv.appendChild(cell);
    }
    return cell;
};

const getLayer = (layer) => {
    let layerDiv = mapsContainer.querySelector(`.layerId-${layer}`);
    if (!layerDiv) {
        layerDiv = document.createElement("div");
        layerDiv.classList.add("mapLayer");
        layerDiv.classList.add(`layerId-${layer}`);
        layerDiv.style.setProperty("top", `-${layer * LAYERS_GAP}em`);
        mapsContainer.appendChild(layerDiv);
    }
    return layerDiv;
};

const getTile = (x, y, layer) => {
    const cell = getCell(y, x, layer);
    const tile = cell.querySelector(".tile");
    if (tile) {
        return tile;
    } else {
        return createTile(x, y, layer, 0);
    }
};

const setTile = (x, y, layer, tileId) => {
    const tile = getTile(x, y, layer);
    const div = tile.querySelector("div");
    div.className = `tile-${tileId}`;
};

// const setTileHeight = (x, y, height) => {
//     const $tile = getTile(x, y);
//     $tile.style.cssText = `
//         transform: translate3d(${height}em, ${height}em, 0)",
//     `;
// };

// const hideTile = (x, y) => {
//     getTile(x, y).classList.add("hide");
// };

const showTile = (x, y, layer) => {
    getTile(x, y, layer).classList.remove("hide");
};

// const toggleTile = (x, y) => {
//     getTile(x, y).classList.toggle("hide");
// };

// const setSize = (w, h, tile) => {
//     for (var y = -h / 2; y < h / 2; y++) {
//         for (var x = -w / 2; x < w / 2; x++) {
//             createTile(x, y, tile);
//         }
//     }
// };

// ===============================================================
// ===============================================================
// Map reposition
const setMapPosition = (x, y) => {
    mapPosition.x = x;
    mapPosition.y = y;

    // const maxTilesWidth = Math.max(
    //     ...mapData.map((layer) => Math.max(...layer.map((row) => row.lengths)))
    // );
    const maxTilesHeight = Math.max(...mapData.map((layer) => layer.length));

    const tile = document.querySelector(".tile");
    const tableW = 0; //-(tile.offsetWidth * maxTilesWidth) / 3;
    const tableH = -(tile.offsetHeight * maxTilesHeight) / 3;

    mapsContainer.style.setProperty(
        "top",
        `${window.innerHeight / 2 + tableH + y}px`
    );
    mapsContainer.style.setProperty(
        "left",
        `${window.innerWidth / 2 + tableW + x}px`
    );
};

// ===============================================================
// ===============================================================
// Init
function init() {
    // create map
    for (let layer = 0; layer < mapData.length; layer++) {
        for (let y = 0; y < mapData[layer].length; y++) {
            for (let x = 0; x < mapData[layer][y].length; x++) {
                setTile(x, y, layer, mapData[layer][y][x]);
            }
        }
    }

    var mousePos = {};
    var mapPos = {};

    // Move map by mouse
    document.addEventListener("mousedown", (e) => {
        mousePos.x = e.pageX;
        mousePos.y = e.pageY;
        mapPos.x = mapPosition.x;
        mapPos.y = mapPosition.y;
        screenReadyToDrag = true;
    });

    document.addEventListener("mousemove", (e) => {
        if (screenReadyToDrag) {
            e.preventDefault();
            setMapPosition(
                mapPos.x + (e.pageX - mousePos.x),
                mapPos.y + (e.pageY - mousePos.y)
            );
            setTimeout(() => (screenDragging = true), 100);
        }
    });
    // Cancel map move on mouse up
    document.addEventListener("mouseup", (e) => {
        screenReadyToDrag = false;
        setTimeout(() => (screenDragging = false), 100);
    });

    // scaling from https://codepen.io/iwillwen/pen/PMNjBW?html-preprocessor=none
    let scale = 1;
    let scaleTimeOut;
    let deltaY = 0;
    // A delay is created before changes are made. If user inputs again it cancels previous call.
    window.addEventListener(
        "wheel",
        (e) => {
            e.preventDefault();
            clearTimeout(scaleTimeOut);
            deltaY += e.deltaY;
            deltaY = Math.min(Math.max(50, Math.abs(deltaY)), 400); // Restrict deltaY
            deltaY = deltaY * Math.sign(e.deltaY); // Normalize scroll wheel
            scale -= deltaY / 10000;
            scale = Math.min(Math.max(MIN_ZOOM, scale), MAX_ZOOM); // Limit scale
            zoom.textContent = Math.round(scale * 100);
            scaleTimeOut = setTimeout(() => {
                mapsContainer.style.setProperty("scale", scale);
                deltaY = 0;
            }, 100);
        },
        { passive: false }
    );

    let x = -1 * (mapSizeW / 2);
    let y = -1 * (mapSizeH / 2);

    // Auto tiles-resetter
    const func = () => {
        for (let layer = 0; layer < 1; layer++) {
            for (let i = 0; i < 30; i++) {
                x = Math.floor(Math.random() * mapSizeW);
                y = Math.floor(Math.random() * mapSizeH);
                const tile = getTile(x, y, layer);

                if (tile.classList.contains("hide")) {
                    showTile(x, y, layer);
                }
            }
        }
    };
    setInterval(func, 300);
}
init();
setTimeout(() => setMapPosition(0, 0), 1000);

// ===============================================================
// ===============================================================
// Events
window.addEventListener("resize", (e) => setMapPosition(0, 0));

document.querySelectorAll(".tile").forEach((el) =>
    el.addEventListener("click", (e) => {
        // Disable while move map or if no tool selected
        if (screenDragging || !currentTool) return;
        if (currentTool["builds"]) {
            // Build Action
            return;
        } else if (currentTool.canDestroy.length) {
            // Destroy Action

            if (e.target.style.classList?.includes("hide")) {
                console.log("no block here");
                return;
            }
            // get block by tileId
            const expression = new RegExp("tile-(\\d+)", "i");
            const targetBlockId = expression.exec(e.target.className)[1];
            const targetBlock = Object.entries(blocks).find(
                (block) => block[1].id == Number(targetBlockId)
            )[1];
            // Check if a tool can destroy it
            if (targetBlock && currentTool.canDestroy.includes(targetBlock)) {
                e.currentTarget.classList.add("hide");
                e.currentTarget.style.opacity = "";
            } else
                console.log(
                    `${currentTool.name} cannot destroy ${targetBlock.name}`
                );
        }
    })
);

// ===============================================================
// ===============================================================
// Map generator

function createArray({ layers, cols, rows }) {
    var array = Array(layers).fill(Array(cols).fill(Array(rows).fill(0)));
    return array;
}

function generateMap() {
    const layers = rand(2, 4);
    const cols = rand(12, 16);
    const rows = rand(12, 16);
    const mapData = createArray({ layers, cols, rows });
    const heightMap = mapData[0];

    // perlin noise function

    // let t = 0;
    // for (let y = 0; y < mapData[0].length; y++) {
    //     for (let x = 0; x < mapData[0].length; x++) {
    //         const noiseNumber = noise.simplex3(x+t, y+t, Date.now());
    //         const res = (noiseNumber + 0.5) * Object.keys(tiles).length;
    //         heightMap[y][x] = res;
    //         t++;
    //     }
    // }

    // mapData[0].forEach((col, cId) => {
    //     col.forEach((row, rId) => {});
    // });

    // console.table(heightMap);
}

// ===============================================================
// ===============================================================
// Utils

function rand(min, max = undefined) {
    if (typeof min === "number" && typeof max === "number") {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + 1) + min;
    }
    if (Array.isArray(min) && max === undefined) {
        return min[Math.floor(Math.random() * min.length)];
    }
}

function mapToRange(a1, b1, a2, b2, t) {
    const lerp = (a, b, t) => (b - a) * t + a;
    const unlerp = (a, b, t) => (t - a) / (b - a);
    const map = (a1, b1, a2, b2, t) => lerp(a2, b2, unlerp(a1, b1, t));
    return map(a1, b1, a2, b2, t);
}
