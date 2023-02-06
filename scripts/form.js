const panel = document.querySelector(".panel");
const form = document.querySelector("form");
const maxRotateX = 30;
const maxRotateY = 30;
const elementsToMove = Array.from(panel.children);

document.body.addEventListener("mousemove", (event) => {
    createParallax(event, panel);
});

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const nickName = form.querySelector("#nickname").value;
    const email = form.querySelector("#email").value;
    if (nickName.length >= 3) {
        window.localStorage.setItem("nickname", nickName);
        window.localStorage.setItem("email", email);
        window.location.href = "./game.html";
    }
});

function createParallax(event, element) {
    // Original idea and implementation
    // https://codepen.io/rdfriedl/pen/obNpeV
    var cx = element.offsetLeft;
    var cy = element.offsetTop;
    var rotateX =
        ((event.pageY - cy) / Math.max(cy, document.body.offsetHeight - cy)) *
        maxRotateY;
    var rotateY =
        ((event.pageX - cx) / Math.max(cx, document.body.offsetWidth - cx)) *
        maxRotateX;
    element.style.cssText = `transform:
        translate(-50%,-50%)
        rotateX(${-rotateX}deg)
        rotateY(${rotateY}deg)`;
}
