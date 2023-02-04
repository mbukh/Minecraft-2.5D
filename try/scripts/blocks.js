// ===============================================================
// ===============================================================
// Blocks
const blocks = {
    waterDeep: {
        name: "deep water",
        id: 1,
        near: [1, 2, 3],
        over: [1, 9, 7, 5],
    },
    waterShallow: {
        name: "shallow water",
        id: 2,
        near: [1, 2, 3],
        over: [1, 2, 9, 7, 5],
    },
    water: {
        name: "water",
        id: 3,
        near: [0, 3, 4],
        over: [1, 2, 3, 9, 7, 5],
    },
    shore: { name: "shore", id: 4, near: [4, 5, 6], over: [5] },
    sand: { name: "sand", id: 5, near: [5, 6, 7, 9], over: [5, 7, 9] },
    grass: { name: "grass", id: 6, near: [4], over: [5, 7, 9] },
    dirt: { name: "dirt", id: 7, over: [7, 9] },
    snow: { name: "snow", id: 8, over: [7, 9] },
    stone: { name: "stone", id: 9, near: [], over: [] },
};