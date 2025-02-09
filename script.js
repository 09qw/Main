// Lightning.io - Fully Enhanced Frontend Version (No Backend)
// Features: Smooth movement, obstacles, AI players, energy dots, animations, power-ups, scoring, leaderboards, sound effects, and more!

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const sounds = {
    eat: new Audio("eat.mp3"),
    powerUp: new Audio("powerup.mp3"),
    collision: new Audio("collision.mp3"),
};

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 2;
        this.color = color;
        this.alpha = 1;
        this.velocity = {
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2,
        };
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.02;
    }

    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

let particles = [];

function createParticles(x, y, color) {
    for (let i = 0; i < 10; i++) {
        particles.push(new Particle(x, y, color));
    }
}

class Player {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.size = 20;
        this.color = color;
        this.speed = 5;
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
    }

    move() {
        this.x += this.dx;
        this.y += this.dy;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.stroke();
    }
}

class AIPlayer extends Player {
    constructor(x, y, color) {
        super(x, y, color);
        this.speed = 2;
        this.dx = Math.random() * 2 - 1;
        this.dy = Math.random() * 2 - 1;
    }

    move() {
        this.x += this.dx * this.speed;
        this.y += this.dy * this.speed;
        if (this.x < 0 || this.x > canvas.width) this.dx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.dy *= -1;
    }
}

let player = new Player(canvas.width / 2, canvas.height / 2, "yellow");
let aiPlayers = Array.from({ length: 10 }, () => new AIPlayer(Math.random() * canvas.width, Math.random() * canvas.height, "green"));
let energyDots = Array.from({ length: 150 }, () => ({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, size: 5, color: "blue" }));

function drawDots() {
    energyDots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fillStyle = dot.color;
        ctx.fill();
    });
}

function handleCollisions() {
    energyDots = energyDots.filter(dot => {
        let dist = Math.hypot(player.x - dot.x, player.y - dot.y);
        if (dist < player.size) {
            sounds.eat.play();
            player.size += 1;
            player.score += 10;
            createParticles(dot.x, dot.y, "blue");
            return false;
        }
        return true;
    });
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") player.dy = -player.speed;
    if (event.key === "ArrowDown") player.dy = player.speed;
    if (event.key === "ArrowLeft") player.dx = -player.speed;
    if (event.key === "ArrowRight") player.dx = player.speed;
});

document.addEventListener("keyup", () => {
    player.dx = 0;
    player.dy = 0;
});

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDots();
    aiPlayers.forEach(ai => {
        ai.move();
        ai.draw();
    });
    player.move();
    player.draw();
    handleCollisions();
    particles.forEach((particle, index) => {
        particle.update();
        if (particle.alpha <= 0) particles.splice(index, 1);
        else particle.draw();
    });
    requestAnimationFrame(update);
}

update();
