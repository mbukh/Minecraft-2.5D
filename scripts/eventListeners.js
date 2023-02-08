// ===============================================================
// ===============================================================
// Events

// update zoom status from css
window.addEventListener(
    "load",
    () =>
        (zoom.textContent = Number(getComputedStyle(mapsContainer).scale) * 100)
);

// reset map position to center
window.addEventListener("resize", (e) => setMapPosition(0, 0));

// activate tools panel clicks
function activateTools() {
    toolsDiv.addEventListener("mousedown", handleToolsClicks);
}

// Tiles touch
function activateTiles() {
    mapsContainer.addEventListener("click", handleTilesClicks);
}

function handleTilesClicks(e) {
    // filter unwanted events
    if (!e.target.parentElement.matches(".tile")) return;
    // Disable while moving map or if no tool selected
    if (screenDragging || !currentTool) return;
    // if a hidden tile clicked
    if (e.target.style.classList?.contains("hide")) return;

    const blockDiv = e.target.parentElement.parentElement;
    const tile = e.target.parentElement;
    const innerTile = e.target;

    console.log(blockDiv);

    // get block coordinates X, Y, Z
    const regZ = new RegExp("layer-(\\d+)", "i");
    const regY = new RegExp("y-(\\d+)", "i");
    const regX = new RegExp("x-(\\d+)", "i");
    const originZ = Number(regZ.exec(blockDiv.className)[1]);
    const originY = Number(regY.exec(blockDiv.className)[1]);
    const originX = Number(regX.exec(blockDiv.className)[1]);
    let [targetZ, targetY, targetX] = [originZ, originY, originX];

    if (currentTool["builds"]) {
        // Build Action

        // get click position relative to the element center
        // https://stackoverflow.com/questions/3234256/find-mouse-position-relative-to-element/42111623#42111623
        const rect = innerTile.getBoundingClientRect();
        const clickX = e.clientX - rect.left - rect.width / 2;
        const clickY = e.clientY - rect.top - rect.height / 2;
        console.log([clickX, clickY]);

        if (clickX > 0 && clickY > 0) {
            // Build to the right
            targetX += 1;
        } else if (clickX < 0 && clickY > 0) {
            // Build to the left
            targetY += 1;
        } else {
            // build to the top
            targetZ += 1;
        }
        // Prepare a new block
        if (!tileExistsOnMap(targetX, targetY, targetZ)) {
            const newTile = setTile(
                targetX,
                targetY,
                targetZ,
                currentTool.builds.id
            );
            showTile(targetX, targetY, targetZ);
            // Save data to the map
            mapData[targetZ][targetY][targetX] = currentTool.builds.id;
        } else console.log("can't build there");
    } else if (currentTool.canDestroy.length) {
        // Destroy Action

        // get block by tileId
        const regTile = new RegExp("tile-(\\d+)", "i");
        const targetBlockId = Number(regTile.exec(innerTile.className)[1]);
        const targetBlock = findBlockById(targetBlockId);
        // Check if a tool can destroy it
        if (targetBlock && currentTool.canDestroy.includes(targetBlock)) {
            // Remove the block
            tile.classList.add("hide");
            // Save data to the map
            mapData[originZ][originY][originX] = null;

            // Replace shore to sand with bucket
            if (
                targetBlockId === blocks.shore.id &&
                currentTool === tools.bucket
            ) {
                innerTile.classList.remove("tile-4");
                hideTile(originX, originY, originZ);
                innerTile.classList.add("tile-5");
                setTimeout(() => showTile(originX, originY, originZ), 1000);
                mapData[originZ][originY][originX] = blocks.sand.id;
            }
        } else
            console.log(
                `${currentTool.name} cannot destroy ${targetBlock.name}`
            );
    }
}
