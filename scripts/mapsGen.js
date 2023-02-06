// ===============================================================
// ===============================================================
// Map generator
//
// more about islands, trees, mountains, terraces
// https://www.redblobgames.com/maps/terrain-from-noise/#elevation-redistribution

// TODO
// IDEA: don't math floor to int value leave toFixes(1) ~ 0.5
// sometimes there are uncontrolled empty places inside the island

// Seed of randomization or use Math.random() * 10000
const seed = Math.random() * 10000;
// How much the island is over the see;
const groundLevel = 6;
const mapLayers = 5;
const mapSize = [14, 14];

const mapData = generateMap({ seed, groundLevel, mapLayers, mapSize });
const [mapSizeZ, mapSizeY, mapSizeX] = [
    mapData.length,
    mapData[0].length,
    mapData[0][0].length,
];

function generateMap({ seed, groundLevel, mapLayers, mapSize }) {
    const layers = mapLayers;
    const cols = mapSize[0];
    const rows = mapSize[1];
    const genMap = createArray({ layers, cols, rows });
    const heightsMap = generateHeights(genMap, { seed, groundLevel });
    return heightsTo3dMap(heightsMap, genMap);
}

function generateHeights(targetMap, { seed = 1, groundLevel = 6 }) {
    const heightsMap = targetMap[0];
    const [cols, rows] = [targetMap[0].length, targetMap[0][0].length];
    const tilesCount = Object.keys(blocks).length;
    // Scale region of the map
    const scale = 2.5;
    // randomize perlin noise function
    noise.seed(seed); // (-1, 1)
    // Create height array
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
            let nx = (2 * x) / rows - 1;
            let ny = (2 * y) / cols - 1;
            res = Math.floor((res * 10 + 10) / 2);
            res = (res + trigProduct(ny, nx) * 20) / 2 - 9 + groundLevel;
            res = Math.max(0, Math.min(res, 10));
            res = Math.floor(mapToRange(0, 10, 1, tilesCount - 2, res)); // -2 to restrict from lava and flower
            heightsMap[x][y] = res;
        }
    }
    // console.table(heightsMap);
    return heightsMap;
}

function trigProduct(nx, ny) {
    // like the Square Bump to create an Island View,
    // so good for approaching square map borders. Returns -1 to 1
    return Math.cos(nx * (Math.PI / 2)) * Math.cos(ny * (Math.PI / 2));
}

function heightsTo3dMap(heightsMap, genMap) {
    const topLayer = genMap.length - 1;
    // Top to bottom Z each X and Y;
    for (let y = heightsMap.length - 1; y >= 0; y--)
        for (let x = heightsMap[y].length - 1; x >= 0; x--)
            for (let z = topLayer; z >= 0; z--) {
                let tile = heightsMap[y][x];
                let tileMaxHeight = findBlockById(tile).maxHeight;
                // Create change to lower a block (except shore and waters)
                let chance = +(tile >= blocks.sand.id) * (rand(1, 4) === 1);
                let heightChange = rand(2, 4) / 10;
                let destHeight = tileMaxHeight - heightChange * chance;
                let newHeight = Math.max(0, destHeight);
                if (z / topLayer > newHeight) {
                    // Remove tiles from height about their limit
                    // Lowers some blocks to create more dynamic map
                    tile = null;
                } else if (
                    z < topLayer &&
                    (genMap[z + 1][y][x] === blocks.grass.id ||
                        genMap[z + 1][y][x] === blocks.snow.id ||
                        genMap[z + 1][y][x] === blocks.dirt.id)
                ) {
                    // Make snow and grass top layers only
                    tile = blocks.dirt.id;
                } else if (
                    z < topLayer &&
                    !genMap[z + 1][y][x] &&
                    isPeninsula(heightsMap, y, x) &&
                    rand(1, 2) === 1
                ) {
                    // add flower to peninsulas
                    genMap[z + 1][y][x] = blocks.flowerPoppy.id;
                }

                genMap[z][y][x] = tile;
            }
    return genMap;
}

function isPeninsula(map, y, x) {
    if (map[y][x] < blocks.sand.id) return false;
    // prettier-ignore
    const neighborsNum = 0 +
        +(map[y - 1][x - 1] < map[y][x]) +
        +(map[y - 1][x]     < map[y][x]) +
        +(map[y][x - 1]     < map[y][x]) +
        +(map[y][x + 1]     < map[y][x]) +
        +(map[y + 1][x]     < map[y][x]) +
        +(map[y + 1][x + 1] < map[y][x]) +
        0
    return neighborsNum >= 4;
}

function tileExistsOnMap(x, y, z) {
    if (
        x < 0 ||
        y < 0 ||
        z < 0 ||
        x >= mapSizeX ||
        y >= mapSizeY ||
        z >= mapSizeZ
    ) {
        console.log("out of bounds");
        return true;
    }
    return mapData[z][y][x] > 0;
}
