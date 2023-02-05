// ===============================================================
// ===============================================================
// Map generator
//
// more about islands, trees, mountains, terraces
// https://www.redblobgames.com/maps/terrain-from-noise/#elevation-redistribution

// TODO
// IDEA: don't math floor to int value leave toFixes(1) ~ 0.5
// Make more vivid height and sands with shores at the same level
// Use function sumNeighbors() to detect almost islands

// Seed of randomization or use Math.random() * 10000
const seed = 1;
// How much the island is over the see;
const height = 6;

const mapData = generateMap({ seed, height });
const [mapSizeZ, mapSizeY, mapSizeX] = [
    mapData.length,
    mapData[0].length,
    mapData[0][0].length,
];

function generateMap({ seed = 1, height = 6 }) {
    const layers = 4;
    const cols = 19;
    const rows = cols;
    const genMap = createArray({ layers, cols, rows });
    const heightMap = genMap[0];
    const tilesCount = Object.keys(blocks).length;
    // Scale region of the map
    const scale = 2.5;

    // randomize perlin noise function
    noise.seed(seed); // (-1, 1)

    for (let y = 0; y < cols; y++) {
        for (let x = 0; x < rows; x++) {
            // gen noise map
            const noiseNumber = noise.perlin2(
                (y / 4) * scale + 0.1, //+ Math.random(),
                (x / 4) * scale + 0.1 //+ Math.random()
            );
            // save noise map
            let res = noiseNumber;
            // Create island edges
            // Calculate distance from the center
            const nx = (2 * x) / rows - 1;
            const ny = (2 * y) / cols - 1;
            res = Math.floor((res * 10 + 10) / 2);
            res = (res + trigProduct(ny, nx) * 20) / 2 - 9 + height;
            res = Math.max(0, Math.min(res, 10));
            res = Math.floor(mapToRange(0, 10, 1, tilesCount - 2, res)); // -2 to restrict from lava and flower
            heightMap[x][y] = res;
        }
    }

    genMap[layers - 1] = heightMap.map((row, rowId) =>
        row.map((height, colId) => (height > 7 ? height : -1))
    );
    genMap[layers - 2] = heightMap.map((row, rowId) =>
        row.map((height, colId) =>
            height <= 7 && height > 4
                ? height
                : height === 8
                ? 7
                : height === 9
                ? 9
                : height === 5 && isPeninsula(heightMap, rowId, colId) > 6
                ? 10
                : -1
        )
    );
    genMap[layers - 3] = heightMap.map((row, rowId) =>
        row.map((height, colId) =>
            height < 4
                ? height
                : genMap[layers - 2][rowId][colId] === 5
                ? 5
                : genMap[layers - 2][rowId][colId] === 6 ||
                  genMap[layers - 2][rowId][colId] == 7
                ? 7
                : genMap[layers - 2][rowId][colId] === 9
                ? 9
                : 4
        )
    );
    genMap[layers - 4] = heightMap.map((row, rowId) =>
        row.map((height, colId) =>
            height < 3
                ? height
                : genMap[layers - 3][rowId][colId] === 4
                ? 5
                : genMap[layers - 3][rowId][colId]
        )
    );
    return genMap;
}

// function heightMapToImage(h) {
//     if (h >= 0.85) return blocks.SNOW;
//     else if (h >= 0.75) return blocks.HIGH_MOUNTAIN;
//     else if (h >= 0.65) return blocks.MOUNTAIN;
//     else if (h >= 0.5) return blocks.FOREST;
//     else if (h >= 0.37) return blocks.LAND;
//     else if (h >= 0.35) return blocks.BEACH;
//     else if (h >= 0.2) return blocks.OCEAN;
//     else return blocks.DEEP_OCEAN;
// }

function trigProduct(nx, ny) {
    // like the Square Bump to create an Island View,
    // so good for approaching square map borders. Returns -1 to 1
    return Math.cos(nx * (Math.PI / 2)) * Math.cos(ny * (Math.PI / 2));
}

function isPeninsula(array, i, j) {
    // prettier-ignore
    const neighborsNum = (
        array(i - 1)(j - 1) > array(i)(j) ? 1 : 0 +
        array(i)(j - 1)     > array(i)(j) ? 1 : 0 +
        array(i - 1)(j)     > array(i)(j) ? 1 : 0 +
        array(i + 1)(j + 1) > array(i)(j) ? 1 : 0 +
        array(i)(j + 1)     > array(i)(j) ? 1 : 0 +
        array(i + 1)(j)     > array(i)(j) ? 1 : 0
    );
    console.log(neighborsNum);
    return neighborsNum;
}
