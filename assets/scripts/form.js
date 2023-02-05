const maxRotateX = 25;
const maxRotateY = 25;

const lobby = document.querySelector(".landing");

lobby.addEventListener("mousemove", handleMouseMoveForm);

// document.querySelector("form").submit((event) => {
//     event.preventDefault();
//     init();
//     lobby.style.display = "none";
//     // removeEventListener();
// });

function handleMouseMoveForm(event) {
    lobby.querySelector(".panel")((i, el) => {
        console.log(el);
        return;
        const cx = el.offsetLeft;
        const cy = el.offsetTop;
        const rotateX =
            ((event.pageY - cy) /
                Math.max(cy, document.body.offsetHeight - cy)) *
            maxRotateY;
        const rotateY =
            ((event.pageX - cx) /
                Math.max(cx, document.body.offsetWidth - cx)) *
            maxRotateX;
        el.style.cssText = `transform:
                translate(-50%,-50%) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
    });
}
