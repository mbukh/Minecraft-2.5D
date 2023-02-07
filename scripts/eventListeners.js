// ===============================================================
// ===============================================================
// Events

window.addEventListener("resize", (e) => setMapPosition(0, 0));

function activateTools() {
    toolDivs.forEach((tool) => {
        tool.addEventListener("mousedown", (e) => {
            const image = `../assets/cursors/${tool.id}.png`;
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
    document.querySelectorAll(".tile").forEach((el) => makeTileActive(el));
}
