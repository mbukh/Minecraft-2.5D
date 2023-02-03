const grid = document.querySelector("#gameGrid");

generateGrid({ columns: 24, rows: 16 });

function generateGrid({ columns = 30, rows = 20 }) {
    grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    // Build rows and columns of cells and add to DOM
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            const cell = newElement({
                tag: "div",
                classList: [i % 2 === 0 ? "even" : "odd"],
                style: {},
                dataset: {},
            });
            // Cell mouse events
            // cell.addEventListener("mouseenter", handleMouseOver);
            // cell.addEventListener("mouseover", handleMouseOver);
            // cell.addEventListener("mouseleave", handleMouseOut);
            // cell.addEventListener("mouseout", handleMouseOut);
            // Add cell to DOM / mainGrid
            grid.appendChild(cell);
        }
    }
}

// Helper Function to create a new html Element
function newElement({ tag = "div", classList = [], style = {}, dataset = {} }) {
    const element = document.createElement(tag);
    for (const prop in style) {
        element.style[prop] = style[prop];
    }
    for (const data in dataset) {
        element.dataset[data] = dataset[data];
    }
    element.classList.add(...classList);
    return element;
}

// Helper function from stackoverflow to recursively clear a node
function clear(node) {
    while (node.hasChildNodes()) {
        clear(node.firstChild);
    }
    node.parentNode.removeChild(node);
}
