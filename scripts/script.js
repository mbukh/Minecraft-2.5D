"use strict";
// based on a JQuery version https://codepen.io/rdfriedl/pen/bdvrjM
// Robert Friedl https://github.com/rdfriedl
// refactored for vanilla js by MBUKH.DEV

const mapsContainer = document.querySelector("#mapsContainer");
const mapsWrapper = document.querySelector(".mapsWrapper");
const toolDivs = document.querySelectorAll("#tools > div");
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
let currentTool = null;

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

const getTile = (x, y, layer) => {
    const cell = getCell(y, x, layer);
    const tile = cell.querySelector(".tile");
    if (tile) {
        return tile;
    } else {
        return createTile(x, y, layer, -1);
    }
};

const setTile = (x, y, layer, tileId) => {
    const tile = getTile(x, y, layer);
    const div = tile.querySelector("div");
    div.className = `tile-${tileId}`;
    return div.parentElement;
};

// const setTileHeight = (x, y, height) => {
//     const $tile = getTile(x, y);
//     $tile.style.cssText = `
//         transform: translate3d(${height}em, ${height}em, 0)",
//     `;
// };

const hideTile = (x, y, layer) => {
    getTile(x, y, layer).classList.add("hide");
};

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
init();

function init() {
    // create map
    for (let layer = 0; layer < mapSizeZ; layer++) {
        for (let y = 0; y < mapSizeY; y++) {
            for (let x = 0; x < mapSizeX; x++) {
                if (mapData[layer][y][x])
                    setTile(x, y, layer, mapData[layer][y][x]);
            }
        }
    }

    activateDragToMove();

    // Auto tiles-resetter
    let x;
    let y;
    const func = () => {
        for (let layer = 0; layer < mapSizeZ; layer++) {
            for (let i = 0; i < 50; i++) {
                x = Math.floor(Math.random() * mapSizeX);
                y = Math.floor(Math.random() * mapSizeY);
                const tile = getTile(x, y, layer);

                if (tile.classList.contains("hide")) {
                    showTile(x, y, layer);
                }
            }
        }
    };
    // setInterval(func, 5000);
}

// Centralize the map on load
setTimeout(() => setMapPosition(0, 0), 200);

// Activate all tools and tiles
activateTools();
activateTiles();
