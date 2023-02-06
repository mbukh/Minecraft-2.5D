// ===============================================================
// ===============================================================
// Utils

function rand(min, max = undefined) {
    if (typeof min === "number" && typeof max === "number") {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
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

function createArray({ layers, cols, rows }) {
    return [...new Array(layers)].map((l) =>
        [...new Array(cols)].map((c) => new Array(rows).fill(0))
    );
}
