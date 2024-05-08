canvas = document.querySelector('canvas')
c = canvas.getContext('2d')

canvas.height = window.innerHeight
if (window.innerWidth < 700) {
    canvas.width = window.innerWidth
} else {
    canvas.width = 700
}

window.addEventListener('resize', function() {
    canvas.height = window.innerHeight
    if (window.innerWidth < 700) {
        canvas.width = window.innerWidth
    } else {
        canvas.width = 700
    }
})

document.addEventListener('keydown', function(event) {
    const key = event.key
    if(key.toLowerCase() === 'a' || key === 'ArrowLeft') {
        rocket.movement[0] = true
    } else if(key.toLowerCase() === 'd' || key === 'ArrowRight') {
        rocket.movement[1] = true
    } else if(key === ' ') {
        rocket.shoot()
    } else if(key === 'k') {
        rocket.health = 0
    } else if(key === 'Enter' && gameRunning === false) {
        resumeGame()
    } else if(key == 'Escape' && gameRunning === true) {
        pauseGame()
    }
})

document.addEventListener('keyup', function(event) {
    const key = event.key
    if(key.toLowerCase() === 'a' || key === 'ArrowLeft') {
        rocket.movement[0] = false
    } else if(key.toLowerCase() === 'd' || key === 'ArrowRight') {
        rocket.movement[1] = false
    }
})

class Gamestate {
    constructor(gamestate) {
        this.gamestate = gamestate
    }

    runGame() {
        if (planetArray.length === 0) {
            initialize()
        }
        background1.update()
        background2.update()
        for (let i = 0; i < planetArray.length; i++) {
            planetArray[i].update(rocket)
        }
        rocket.update(planetArray)
        scoreSystem.update()
    }
    gamestateHandler() {
        switch (this.gamestate) {
            case 0:
                this.runGame()
        }
    }
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Initialiserar spelet genom att skapa de objekt som behövs
function initialize() {
    background1 = new Background(0, 0, 0.8, stars1)
    background2 = new Background(0, -stars2.height, 0.8, stars2)
    rocket = createRocket()
    createPlanets(5, planetSpriteArray)
    scoreSystem = new ScoreSystem(canvas.width * 0.02, canvas.height * 0.075, "red")
}

// Main loopen för spelet
function animate() {
    if (!gameRunning) return;

    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    gamestateObject.gamestateHandler()
}

// Background + rocket images
const rocketPNG = document.getElementById('rocket')
const stars1 = document.getElementById('stars1')
const stars2 = document.getElementById('stars2')

// Powerup images
const ammoPowerupPNG = document.getElementById('ammoPowerUp')

// Rocket projectile + Planet images
const RocketProjectilePNG = document.getElementById('projectile')
const planetClassArray = document.getElementsByClassName('planet')
const planetSpriteArray = []
for (let i = 0; i < planetClassArray.length; i++) {
    planetSpriteArray.push([planetClassArray[i]])
}

let gamestateObject = new Gamestate(0)
let scoreSystem
let rocketPicture
let background1
let background2
let rocket
let planetArray = []
let gameRunning = true

function pauseGame() {
    let pauseText = createText('PAUSED', canvas.width * 0.36, canvas.height * 0.5, 'red')
    let continueText = createText('Press "ENTER" to Continue', canvas.width * 0.36, canvas.height * 0.6, 'blue')
    pauseText.update('PAUSED', canvas.width * 0.36, canvas.height * 0.5)
    continueText.update('Press "ENTER" to Continue', canvas.width* 0.05, canvas.height * 0.6)
    gameRunning = false
}

function deathMenu() {
    let deathText = createText('Du dog lol!', canvas.width * 0.5, canvas.height * 0.5, 'red')
    deathText.update('Du dog lol', canvas.width * 0.3, canvas.height * 0.5)
    gameRunning = false;
}

function resumeGame() {
    gameRunning = true
    // rocket.health = 100
    animate();
}

window.onload = function () {
animate()
}