canvas = document.querySelector('canvas')
c = canvas.getContext('2d')

// Background + rocket images
const rocketPNG = document.getElementById('rocket')
const stars1 = document.getElementById('stars1')
const stars2 = document.getElementById('stars2')
const earth = document.getElementById('earth')

// Rocket projectile + Planet images
const RocketProjectilePNG = document.getElementById('projectile')
const planetClassArray = document.getElementsByClassName('planet')
const planetSpriteArray = []
for (let i = 0; i < planetClassArray.length; i++) {
    planetSpriteArray.push([planetClassArray[i]])
}


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
    } else if(key === 'k') { //För att kunna testa dödsmenyn osv utan att behöva vänta på att dö<
        rocket.health = 0
    } else if(key === 'Enter' && gameRunning === false  && rocket.health > 0) {
        resumeGame()
    } else if(key.toLowerCase() == 'r' && gameRunning === false && rocket.health <= 0) {
        resetGame()
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

function runGame() {
    if (planetArray.length === 0) {
        initialize()
    }
    background1.update()
    background2.update()
    c.drawImage(earth, -150, canvas.height * 0.9, 1000, 700)
    for (let i = 0; i < planetArray.length; i++) {
        planetArray[i].update(rocket)
    }
    rocket.update(planetArray)
    scoreSystem.update()
}

// Main loopen för spelet
function animate() {
    if (!gameRunning) return;
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    runGame()
}

function pauseGame() {
    let pauseTextWidth = c.measureText('PAUSED').width
    let pauseText = createText('PAUSED', (canvas.width - pauseTextWidth) / 2, canvas.height * 0.5, 'white')
    let continueTextWidth = c.measureText('Press "ENTER" to Continue').width
    let continueText = createText('Press "ENTER" to Continue', (canvas.width - continueTextWidth) / 2, canvas.height * 0.6, 'white')
    pauseText.update('PAUSED')
    continueText.update('Press "ENTER" to Continue')
    gameRunning = false
}

function deathMenu() {
    let deathTextWidth = c.measureText('You died!').width
    let deathText = createText('You died!', (canvas.width - deathTextWidth) / 2, canvas.height * 0.5, 'red')
    let restartTextWidth = c.measureText('Press "R" to Restart').width
    let restartText = createText('Press "R" to Restart', (canvas.width - restartTextWidth) / 2, canvas.height * 0.6, 'red')
    deathText.update('You died!')
    restartText.update('Press "R" to Restart')
    gameRunning = false;
}

function resumeGame() {
    gameRunning = true
    animate();
}

function resetGame() {
    rocket.health = 100
    scoreSystem.score = 0
    planetArray = []
    resumeGame()
}


let scoreSystem
let rocketPicture
let background1
let background2
let rocket
let planetArray = []
let gameRunning = true

window.onload = function () {
animate()
}