"use strict";
// based on a JQuery version https://codepen.io/rdfriedl/pen/bdvrjM
// refactored for vanilla js by MBUKH.DEV

const mapGrid = document.querySelector("#mapGrid");
const mapPosition = {};
const tileTemplate = document.querySelector("body>.tile").cloneNode(true);
document.querySelector("body>.tile").remove(); // remove template

let screenReadyToDrag = false;
let screenDragging = false;

const mapData = [
    1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2,
    2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2,
    3, 3, 4, 4, 3, 4, 3, 3, 2, 2, 2, 2, 1, 1, 2, 2, 3, 4, 8, 8, 4, 4, 3, 4, 4,
    3, 2, 2, 1, 1, 2, 3, 3, 4, 16, 16, 16, 16, 4, 16, 5, 4, 3, 2, 2, 1, 2, 3, 4,
    5, 16, 9, 9, 8, 4, 16, 8, 5, 4, 3, 2, 1, 2, 3, 4, 5, 5, 8, 8, 16, 9, 8, 8,
    5, 4, 3, 2, 1, 2, 3, 3, 4, 5, 5, 8, 8, 8, 8, 5, 4, 3, 2, 2, 2, 2, 2, 3, 3,
    4, 5, 8, 5, 5, 5, 4, 4, 3, 2, 2, 2, 1, 2, 2, 3, 3, 4, 5, 5, 5, 5, 4, 3, 2,
    2, 2, 2, 1, 1, 2, 2, 3, 4, 4, 5, 5, 4, 4, 3, 2, 2, 2, 2, 1, 1, 2, 2, 3, 3,
    3, 4, 4, 4, 3, 3, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2,
    1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2,
    2, 2, 1, 1, 1, 1, 1, 1,
];

const mapSize = Math.floor(Math.sqrt(mapData.length));

const createTile = (x, y, tileId) => {
    let div = getCell(y, x);
    let tile = div.querySelector(".tile");
    if (!tile) {
        tile = tileTemplate.cloneNode(true);
        tile.style.setProperty("z-index", (1000 + x + y) * 2);
        div.appendChild(tile);
    }
    const innerDiv = tile.querySelector("div");
    innerDiv.className = `tile-${tileId}`;
    return tile;
};

const getCell = (y, x) => {
    let cell = mapGrid.querySelector(`.row-${y}.col-${x}`);
    if (!cell) {
        console.log(cell);
        let transformX, transformY;
        cell = document.createElement("div");
        cell.classList.add("row-" + y);
        cell.classList.add("col-" + x);
        transformY = "translateY(" + y * 5 + "em)";
        transformX = "translateX(" + x * 5 + "em)";
        cell.style.transform = `${transformX} ${transformY}`;
        mapGrid.appendChild(cell);
    }
    return cell;
};

const getTile = (x, y) => {
    const div = getCell(y, x);
    const tile = div.querySelector(".tile");
    if (tile) {
        return tile;
    } else {
        return createTile(x, y, 0);
    }
};

const setTile = (x, y, tileId) => {
    const tile = getTile(x, y);
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

const showTile = (x, y) => {
    getTile(x, y).classList.remove("hide");
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

    const tile = document.querySelector(".tile");
    const tableW = 0;
    const tableH = (tile.offsetHeight * mapSize) / 10;

    mapGrid.style.setProperty(
        "top",
        `${window.innerHeight / 2 + tableH + y}px`
    );
    mapGrid.style.setProperty(
        "left",
        `${window.innerWidth / 2 + tableW + x}px`
    );
};

function init() {
    // create map
    for (let y = 0; y < mapSize; y++) {
        for (let x = 0; x < mapSize; x++) {
            setTile(
                x, // - mapSize / 2,
                y, // - mapSize / 2,
                mapData[y * mapSize + x] - 1
            );
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
    let scale = 1;
    let scaleTimeOut;
    let deltaY = 0;
    window.addEventListener(
        "wheel",
        (e) => {
            e.preventDefault();
            clearTimeout(scaleTimeOut);
            deltaY += e.deltaY;
            scaleTimeOut = setTimeout(() => {
                deltaY = Math.min(Math.max(100, Math.abs(deltaY)), 600); // Restrict deltaY
                deltaY = deltaY * Math.sign(e.deltaY); // Normalize scroll wheel
                scale -= deltaY / 300;
                scale = Math.min(Math.max(0.4, scale), 2.2); // Limit scale
                mapGrid.style.scale = scale;
                deltaY = 0;
            }, 20);
        },
        { passive: false }
    );

    let x = -1 * (mapSize / 2);
    let y = -1 * (mapSize / 2);

    const func = () => {
        for (let i = 0; i < 30; i++) {
            x = Math.floor(Math.random() * mapSize); // - mapSize / 2;
            y = Math.floor(Math.random() * mapSize); // - mapSize / 2;
            const tile = getTile(x, y);

            if (tile.classList.contains("hide")) {
                showTile(x, y);
            }
        }
    };
    setInterval(func, 300);
}

//start
init();
setTimeout(() => setMapPosition(0, 0), 1000);

// window.addEventListener("resize", (e) => setMapPosition(0, 0));

document.querySelectorAll(".tile").forEach((el) =>
    el.addEventListener("click", (e) => {
        if (screenDragging) return;
        /* Act on the event */
        e.currentTarget.classList.add("hide");
        e.currentTarget.style.opacity = "";
    })
);

document.querySelectorAll(".tile").forEach((el) =>
    el.addEventListener("mouseenter", (e) => {
        /* Act on the event */
        // e.currentTarget.classList.add("hide");
        if (!e.currentTarget.classList.contains("hide")) {
            e.currentTarget.style.opacity = "0.5";
        }
    })
);
document.querySelectorAll(".tile").forEach((el) =>
    el.addEventListener("mouseout", (e) => {
        /* Act on the event */
        // e.currentTarget.classList.add("hide");
        if (!e.currentTarget.classList.contains("hide")) {
            e.currentTarget.style.opacity = "1";
        }
    })
);
