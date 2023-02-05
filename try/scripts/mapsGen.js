// ===============================================================
// ===============================================================
// Map generator
//
// more about islands, trees, mountains, terraces
// https://www.redblobgames.com/maps/terrain-from-noise/#elevation-redistribution

mapData = generateMap();

[mapSizeZ, mapSizeY, mapSizeX] = [
    mapData.length,
    mapData[0].length,
    mapData[0][0].length,
];

function generateMap(seed = 1) {
    const layers = 3;
    const cols = rand(8, 19);
    const rows = cols;
    const genMap = createArray({ layers, cols, rows });
    const heightMap = genMap[0];
    const tilesCount = Object.keys(blocks).length;
    // Scale region of the map
    const scale = 3;

    // randomize perlin noise function
    perlin.seed(Math.random() * 10000); // (-0.7, 0.7)
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
            res = (res + trigProduct(ny, nx) * 20) / 2 - 2;
            res = Math.max(0, Math.min(res, 10));
            res = Math.floor(mapToRange(0, 10, 1, tilesCount, res));
            heightMap[x][y] = res;
        }
    }

    genMap[layers - 1] = heightMap.map((row) =>
        row.map((height) => (height > 7 ? height : -1))
    );
    genMap[layers - 2] = heightMap.map((row) =>
        row.map((height) => (height <= 7 && height > 4 ? height : -1))
    );
    genMap[layers - 3] = heightMap.map((row) =>
        row.map((height) => (height < 4 ? height : 4))
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
