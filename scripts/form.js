const background = document.querySelector(".landing");
const panel = document.querySelector(".panel");
const form = document.querySelector("form");
const maxRotateX = 15;
const maxRotateY = 15;
const elementsToMove = Array.from(panel.children);

document.body.addEventListener("mousemove", (e) => {
    createParallax(e);
    shiftBackground(e);
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nickName = form.querySelector("#nickname").value;
    // const email = form.querySelector("#email").value;
    if (nickName.length >= 3) {
        window.localStorage.setItem("nickname", nickName);
        // window.localStorage.setItem("email", email);
        window.location.href = "./game.html";
    }
});

function createParallax(e) {
    // Original idea and implementation
    // https://codepen.io/rdfriedl/pen/obNpeV
    var cx = panel.offsetLeft;
    var cy = panel.offsetTop;
    var rotateX =
        ((e.pageY - cy) / Math.max(cy, document.body.offsetHeight - cy)) *
        maxRotateY;
    var rotateY =
        ((e.pageX - cx) / Math.max(cx, document.body.offsetWidth - cx)) *
        maxRotateX;
    panel.style.cssText = `transform:
        translate(-50%,-50%)
        rotateX(${-rotateX}deg)
        rotateY(${rotateY}deg)`;
}

function shiftBackground(e) {
    background.style.setProperty(
        "--offsetX",
        -(e.pageX - window.innerWidth / 2) / 50 + "px"
    );
    background.style.setProperty(
        "--offsetY",
        (e.pageY - window.innerHeight / 2) / 50 + "px"
    );
}
