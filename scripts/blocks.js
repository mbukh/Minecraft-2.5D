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

// const tiles = {};

// Utils

function findBlockById(tile) {
    return Object.values(blocks).find((block) => block.id === tile);
}
