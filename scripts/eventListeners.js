// ===============================================================
// ===============================================================
// Events

window.addEventListener("resize", (e) => setMapPosition(0, 0));

function activateTools() {
    toolDivs.forEach((tool) => {
        tool.addEventListener("mousedown", (e) => {
            const image = `./cursors/${tool.id}.png`;
            const toolName = tool.id;
            document.body.style.setProperty("--cursor", `url(${image})`);
            toolDivs.forEach((tool) => tool.classList.remove("active"));
            tool.classList.add("active");
            currentTool = tools[toolName];
        });
    });
}

function activateDragToMove() {
    var mousePos = {};
    var mapPos = {};

    // Move map by mouse
    document.body.addEventListener("mousedown", (e) => {
        mousePos.x = e.pageX;
        mousePos.y = e.pageY;
        mapPos.x = mapPosition.x;
        mapPos.y = mapPosition.y;
        screenReadyToDrag = true;
    });

    document.body.addEventListener("mousemove", (e) => {
        if (screenReadyToDrag) {
            e.preventDefault();
            setMapPosition(
                mapPos.x + (e.pageX - mousePos.x),
                mapPos.y + (e.pageY - mousePos.y)
            );
            setTimeout(() => (screenDragging = true), 100);
        }
    });
    // Cancel map move on mouse up
    document.body.addEventListener("mouseup", (e) => {
        screenReadyToDrag = false;
        setTimeout(() => (screenDragging = false), 100);
    });

    // scaling
    // from https://codepen.io/iwillwen/pen/PMNjBW?html-preprocessor=none
    let scale = 1;
    let scaleTimeOut;
    let deltaY = 0;
    // A delay is created before changes are made
    // If user inputs again it cancels previous call
    window.addEventListener(
        "wheel",
        (e) => {
            e.preventDefault();
            clearTimeout(scaleTimeOut);
            deltaY += e.deltaY;
            deltaY = Math.min(Math.max(50, Math.abs(deltaY)), 400); // Restrict deltaY
            deltaY = deltaY * Math.sign(e.deltaY); // Normalize scroll wheel
            scale -= deltaY / 10000;
            scale = Math.min(Math.max(MIN_ZOOM, scale), MAX_ZOOM); // Limit scale
            zoom.textContent = Math.round(scale * 100);
            scaleTimeOut = setTimeout(() => {
                mapsContainer.style.setProperty("scale", scale);
                deltaY = 0;
            }, 100);
        },
        { passive: false }
    );
}

// Tiles touch
function activateTiles() {
    document.querySelectorAll(".tile").forEach((el) =>
        el.addEventListener("click", (e) => {
            // Disable while move map or if no tool selected
            if (screenDragging || !currentTool) return;

            // Tak action
            const blockDiv = el.parentElement;
            const tileInnerDiv = e.target;

            // get click position relative to the element center
            // https://stackoverflow.com/questions/3234256/find-mouse-position-relative-to-element/42111623#42111623
            const rect = tileInnerDiv.getBoundingClientRect();
            const clickX = e.clientX - rect.left - rect.width / 2;
            const clickY = e.clientY - rect.top - rect.height / 2;
            console.log([clickX, clickY]);

            if (currentTool["builds"]) {
                // Build Action
                // get block by coordinate
                const regLayer = new RegExp("layer-(\\d+)", "i");
                const regY = new RegExp("y-(\\d+)", "i");
                const regX = new RegExp("x-(\\d+)", "i");
                const originLayer = regLayer.exec(blockDiv.className)[1];
                const originY = regY.exec(blockDiv.className)[1];
                const originX = regX.exec(blockDiv.className)[1];

                const regTile = new RegExp("tile-(\\d+)", "i");
                const targetBlockId = expression.exec(e.target.className)[1];

                console.log(originLayer);
                console.log(originY);
                console.log(originX);
                // Prepare a new block
                setTile(originX, originY, originLayer + 1);
                return;
            } else if (currentTool.canDestroy.length) {
                // Destroy Action

                if (e.target.style.classList?.contains("hide")) {
                    console.log("no block here");
                    return;
                }
                // get block by tileId
                const regTile = new RegExp("tile-(\\d+)", "i");
                const targetBlockId = regTile.exec(e.target.className)[1];
                const targetBlock = Object.entries(blocks).find(
                    (block) => block[1].id == Number(targetBlockId)
                )[1];
                // Check if a tool can destroy it
                if (
                    targetBlock &&
                    currentTool.canDestroy.includes(targetBlock)
                ) {
                    el.classList.add("hide");
                    el.style.opacity = "";
                } else
                    console.log(
                        `${currentTool.name} cannot destroy ${targetBlock.name}`
                    );
            }
        })
    );
}
