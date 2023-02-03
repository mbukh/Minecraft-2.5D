"use strict";
// based on a JQuery version https://codepen.io/rdfriedl/pen/bdvrjM
// Robert Friedl https://github.com/rdfriedl
// refactored for vanilla js by MBUKH.DEV

const mapsContainer = document.querySelector("#mapsContainer");
const h1 = document.querySelector("h1");
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

const mapData = [
    [
        [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1],
        [1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1],
        [1, 2, 2, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 1, 1, 1],
        [2, 2, 3, 3, 4, 4, 3, 4, 3, 3, 2, 2, 2, 2, 1, 1],
        [2, 2, 3, 4, 8, 8, 4, 4, 3, 4, 4, 3, 2, 2, 1, 1],
        [2, 3, 3, 4, 16, 16, 16, 16, 4, 16, 5, 4, 3, 2, 2, 1],
        [2, 3, 4, 5, 16, 9, 9, 8, 4, 16, 8, 5, 4, 3, 2, 1],
        [2, 3, 4, 5, 5, 8, 8, 16, 9, 8, 8, 5, 4, 3, 2, 1],
        [2, 3, 3, 4, 5, 5, 8, 8, 8, 8, 5, 4, 3, 2, 2, 2],
        [2, 2, 3, 3, 4, 5, 8, 5, 5, 5, 4, 4, 3, 2, 2, 2],
        [1, 2, 2, 3, 3, 4, 5, 5, 5, 5, 4, 3, 2, 2, 2, 2],
        [1, 1, 2, 2, 3, 4, 4, 5, 5, 4, 4, 3, 2, 2, 2, 2],
        [1, 1, 2, 2, 3, 3, 3, 4, 4, 4, 3, 3, 2, 2, 2, 2],
        [1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 1],
        [1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1],
        [1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1],
    ],
    [
        [1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1],
        [1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 1],
        [1, 1, 2, 2, 3, 3, 3, 4, 4, 4, 3, 3, 2, 2, 2, 2],
        [1, 1, 2, 2, 3, 4, 4, 5, 5, 4, 4, 3, 2, 2, 2, 2],
        [1, 2, 2, 3, 3, 4, 5, 5, 5, 5, 4, 3, 2, 2, 2, 2],
        [2, 2, 3, 3, 4, 5, 8, 5, 5, 5, 4, 4, 3, 2, 2, 2],
        [2, 3, 3, 4, 5, 5, 8, 8, 8, 8, 5, 4, 3, 2, 2, 2],
        [2, 3, 4, 5, 5, 8, 8, 16, 9, 8, 8, 5, 4, 3, 2, 1],
        [2, 3, 4, 5, 16, 9, 9, 8, 4, 16, 8, 5, 4, 3, 2, 1],
        [2, 3, 3, 4, 16, 16, 16, 16, 4, 16, 5, 4, 3, 2, 2, 1],
        [2, 2, 3, 4, 8, 8, 4, 4, 3, 4, 4, 3, 2, 2, 1, 1],
        [2, 2, 3, 3, 4, 4, 3, 4, 3, 3, 2, 2, 2, 2, 1, 1],
        [1, 2, 2, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 1, 1, 1],
        [1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1],
    ],
];
const [mapSizeH, mapSizeW] = [mapData.length, mapData[0].length];

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

function init() {
    // create map
    for (let layer = 0; layer < mapData.length; layer++) {
        for (let y = 0; y < mapData[layer].length; y++) {
            for (let x = 0; x < mapData[layer][y].length; x++) {
                setTile(x, y, layer, mapData[layer][y][x] - 1);
            }
        }
    }

    var mousePos = {};
    var mapPos = {};

    document.addEventListener("mousedown", (e) => {
        mousePos.x = e.pageX;
        mousePos.y = e.pageY;
        mapPos.x = mapPosition.x;
        mapPos.y = mapPosition.y;
        screenReadyToDrag = true;
    });

    document.addEventListener("mousemove", (e) => {
        if (screenReadyToDrag) {
            setMapPosition(
                mapPos.x + (e.pageX - mousePos.x),
                mapPos.y + (e.pageY - mousePos.y)
            );
            setTimeout(() => (screenDragging = true), 100);
        }
    });

    document.addEventListener("mouseup", (e) => {
        screenReadyToDrag = false;
        setTimeout(() => (screenDragging = false), 100);
    });

    // scaling from https://codepen.io/iwillwen/pen/PMNjBW?html-preprocessor=none
    let zoom = 1;
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
            zoom -= deltaY / 10000;
            zoom = Math.min(Math.max(MIN_ZOOM, zoom), MAX_ZOOM); // Limit scale
            h1.textContent = "Zoom: " + Math.round(zoom * 100) + "%";
            scaleTimeOut = setTimeout(() => {
                mapsContainer.style.setProperty("scale", zoom);
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

//start
init();
setTimeout(() => setMapPosition(0, 0), 1000);

window.addEventListener("resize", (e) => setMapPosition(0, 0));

document.querySelectorAll(".tile").forEach((el) =>
    el.addEventListener("click", (e) => {
        if (screenDragging) return;
        console.log("clicked");
        /* Act on the event */
        e.currentTarget.classList.add("hide");
        e.currentTarget.style.opacity = "";
    })
);

// MAP GENERATOR

function createArray({ layers, cols, rows }) {
    var array = [];
    for (let layers = 0; layers < layers; layers++) {
        for (var i = 0; i < cols; i++) {
            array.push([]);
            for (var j = 0; j < dimensions; j++) {
                array[i].push(num);
            }
        }
    }
    return array;
}

function generateMap() {
    let map = createArray(0, 10);
}
