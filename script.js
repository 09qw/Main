const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: 400, y: 300, size: 20 };

function drawPlayer() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.stroke();
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") player.y -= 10;
    if (event.key === "ArrowDown") player.y += 10;
    if (event.key === "ArrowLeft") player.x -= 10;
    if (event.key === "ArrowRight") player.x += 10;
    drawPlayer();
});

drawPlayer();
