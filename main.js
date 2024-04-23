canvas = document.querySelector('canvas')

c = canvas.getContext('2d')

const rocketPNG = document.getElementById('rocket')
const stars1 = document.getElementById('stars1')
const stars2 = document.getElementById('stars2')
const lavaworld = document.getElementById('lava')

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
    }
    
    if(key.toLowerCase() === 'd' || key === 'ArrowRight') {
        rocket.movement[1] = true
    }

    if(key === ' ') {
        rocket.shoot()
    }

    if(key === 'k') {
        rocket.health = 100
    }
})

document.addEventListener('keyup', function(event) {
    const key = event.key
    if(key.toLowerCase() === 'a' || key === 'ArrowLeft') {
        rocket.movement[0] = false
    } 
    
    if(key.toLowerCase() === 'd' || key === 'ArrowRight') {
        rocket.movement[1] = false
    }
})


function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let colorArrayRedFire = [
    '#ff0000',
    '#ff5a00',
    '#ff9a00',
    '#ffce00',
    '#ffe808'
]

let colorArrayRedGradient = [
    '#ba3030',
    '#c72c2c',
    '#ce2525',
    '#d62121',
    '#df1b1b'
]

let colorArrayBlueFire = [
    '#3d88ff',
    '#56b6ff',
    '#50c4ff',
    '#5bcfff',
    '#5ad6ff'
]

// Skapar objekt för partiklarna/effekterna som används i spelet
class Particle {
    constructor(x, y, radius, velX, velY, color) {
        this.x = x
        this.y = y
        this.r = radius
        this.vx = velX
        this.vy = velY
        this.color = color
    }


    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false)
        c.shadowBlur = 15
        c.shadowColor = this.color
        c.fillStyle = this.color
        c.closePath()
        c.fill()
    }

    update() {
        this.x += this.vx
        this.y += this.vy
        if (this.r > 0.5) {
            this.r -= 0.1
            this.draw()
        } else {
            this.finished = true
        }
    }
}

// Skapar objekt för skotten som skjuts av raketen
class RocketProjectile {
    constructor(x, y, r, vel) {
        this.x = x
        this.y = y
        this.r = r
        this.vel = vel
        this.color = 'white'
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false)
        c.shadowBlur = 4
        c.shadowColor = this.color
        c.fillStyle = this.color
        c.closePath()
        c.fill()
    }

    update(planets) {
        // Kollar om skotten träffar en planet
        for(let i = 0; i < planets.length; i++) {
            if (planets[i].x + planets[i].r > this.x &&
                planets[i].x - planets[i].r < this.x &&
                planets[i].y + planets[i].r > this.y &&
                planets[i].y - planets[i].r < this.y)
            {
                planets[i].explode()
            }
        }
        this.y += this.vel
        this.draw()
    }
}

// Skapar ett objekt för raketen
class Rocket {
    constructor(x, y, width, height, vel, health, rocketImage) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.vel = vel
        this.color = '#9171f8'
        this.health = health
        this.healthText = createText(this.health, innerWidth * 0.02, innerHeight * 0.95, 'red')
        this.movement = [false, false]
        this.projectileObjects = []
        this.fireObjects = []
        this.ammoCount = 10000
        this.rocketImage = rocketImage
    }

    shoot() {
        if (this.ammoCount > 0) {
        this.projectileObjects.push(new RocketProjectile(this.x + this.width/2, this.y, 4, -9))
        this.ammoCount -= 1
        }
    }

    draw(planets) {
        c.shadowColor = 'red'
        c.drawImage(this.rocketImage, this.x, this.y, this.width, this.height)
        for(let i = 0; i < this.fireObjects.length; i++) {
            this.fireObjects[i].update()
        }
        for(let i = 0; i < this.projectileObjects.length; i++) {
            this.projectileObjects[i].update(planets)
        }
        this.healthText.update(this.health, innerWidth * 0.02, innerHeight * 0.95)
    }

    update(planets) {
        // Uppdaterar y positionen ifall man resizar fönstret
        this.y = innerHeight * 0.73

        // Förflyttning av raketen
        if(this.movement[0] === true) {
            this.x -= this.vel
        } else if(this.movement[1] === true) {
            this.x += this.vel
        }

        // Kollision med sidorna av skärmen
        if(this.x >= canvas.width - this.width) {
            this.x = canvas.width - this.width
        } 
        else if (this.x <= 0) {
            this.x = 0
        }
        // Kollision med planeterna
        for(let i = 0; i < planets.length; i++) {
            if (planets[i].x + planets[i].r > this.x + this.width / 2 &&
                planets[i].x - planets[i].r < this.x + this.width / 2 &&
                planets[i].y + planets[i].r > this.y &&
                planets[i].y - planets[i].r < this.y + this.height / 2)
            {

                if (this.health > 0) {
                    this.health -= 10
                }
                planets[i].explode()
            }
        }
        // Skapar objekt för eld partiklarna bakom raketen
        this.fireObjects.push(
            new Particle(
                this.x + this.width / 2,
                this.y + this.height - 10,
                (Math.random() * 5) + 2,
                (Math.random() - 0.5) * 1,
                (Math.random()) * 5,
                colorArrayRedFire[randomInt(0, 4)]
            ))

        this.draw(planets)
    }
}

// Skapar objekt för planeterna
class Planet {
    constructor(x, y, radius, vel, img) {
        this.x = x
        this.y = y
        this.xMargin = 5
        this.r = radius
        this.vel = vel
        this.color = '#5bcfff'
        this.shadowColor = '#5ad6ff'
        this.exploded = false
        this.finishedExploding = true
        this.explosionObjects = []
        this.img = img
        this.frameIndex = 0; // Flytta frameIndex utanför draw()
        this.totalFrames = 10; // Anpassa totala antalet frames här
        this.spriteWidth = 100;
        this.spriteHeight = 100;
    }


    explode() {
        this.exploded = true
        if (this.explosionObjects.length === 0) {
            for (let i = 0; i < randomInt(25, 30); i++) {
                this.explosionObjects.push(
                    new Particle(
                        randomInt(this.x-this.r, this.x+this.r),
                        randomInt(this.y-this.r, this.y+this.r),
                        randomInt(4, 7),
                        randomInt(-5, 5),
                        randomInt(-5, 5),
                        colorArrayBlueFire[randomInt(0, 4)]
                    ))
            }
        }
        this.reset()
        // Loopar igenom alla explosions partiklar och uppdaterar + kollar om alla är färdigt exploderade
        this.finishedExploding = true
        for (let i = 0; i < this.explosionObjects.length; i++) {
            this.explosionObjects[i].update()
            if (this.explosionObjects[i].r > 0.5) {
                this.finishedExploding = false;
            }
        }
        // Om planeten är färdig med explosionen så töms listan med objekten
        if (this.finishedExploding === true) {
            this.explosionObjects.splice(0, this.explosionObjects.length)
            this.exploded = false
        }
        
    }

    reset() {
        this.r = randomInt(25, 50)
        this.y = -this.r
        this.x = randomInt(this.r + this.xMargin, canvas.width - this.r - this.xMargin)
        this.vel = randomInt(2, 12)
    }

    draw() {
        c.drawImage(
            this.img, 
            this.spriteWidth * this.frameIndex, 0, this.spriteWidth, this.spriteHeight, 
            this.x, this.y, 100, 100
        )

        this.frameIndex = (this.frameIndex + 1) % this.totalFrames; // Uppdatera frameIndex
    }

    update() {
        if (this.exploded === false) {
            this.y += this.vel
            if(this.y >= canvas.height + this.r) {
                this.reset()
            }
            this.draw()
        } else {
            this.explode()
        }
    }
}

function createRocket() {
    let width = 60
    let height = width * 1.3
    let x = canvas.width / 2 - width / 2
    let y = innerHeight * 0.73
    let velocity = 10
    let health = 100
    let rocketImage = rocketPNG
    return new Rocket(x, y, width, height, velocity, health, rocketImage)
}

function createPlanets(count, img) {
    let planetCount = count
    for (let i = 0; i < planetCount; i++) {
        let radius = randomInt(25, 50)
        let x = randomInt(radius, canvas.width - radius)
        const y = 10
        let velocity = randomInt(5, 15)
        planetArray.push(new Planet(x, y, radius, velocity, img))
    }
}

function createText(text, x, y, color) {
    return new Text(text, x, y, color)
}

// Skapar objekt för texten som visas i spelet
class Text {
    constructor(text, x, y, color) {
        this.x = x
        this.y = y
        this.txt = text
        this.color = color
    }

    draw() {
        c.shadowBlur = 10
        c.shadowColor = this.color
        c.fillStyle = this.color
        c.font = '50px Arial'
        c.fillText(this.txt, this.x, this.y)
    }

    update(newText, x, y, color) {
        this.x = x
        this.y = y
        this.txt = newText
        this.color = color
        this.draw()
    }
}

class Background {
    constructor(x, y, vel, img) {
        this.x = x
        this.y = y
        this.vel = vel
        this.img = img
    }
    
    draw() {
        c.shadowBlur = 0
        c.drawImage(this.img, this.x, this.y)
    }

    update() {
        this.y += this.vel
        if(this.y >= canvas.height) {
            this.y = -this.img.height
        }
        this.draw()
    }
}

class Scoreboard {
    constructor(x, y, color) {
        this.x = x
        this.y = y
        this.color = color
        this.multiplier = 10
        this.score = 0
        this.text = createText(this.score, this.x, this.y, this.color)
    }

    draw() {
        this.text.update(this.score, this.x, this.y, this.color)
    }

    update() {
        this.score += 1 * this.multiplier
        if (this.score < 1000) {
            this.color = colorArrayRedGradient[0]
        } else if (this.score >= 1000 && this.score < 2000) {
            this.color = colorArrayRedGradient[1]
        } else if (this.score >= 2000 && this.score < 3000) {
            this.color = colorArrayRedGradient[2]
        } else if (this.score >= 3000 && this.score < 4000) {
            this.color = colorArrayRedGradient[3]
        } else if (this.score >= 4000 && this.score < 5000) {
            this.color = colorArrayRedGradient[4]
        } 
        this.draw()
    }

}

// Initialiserar spelet genom att skapa de objekt som behövs
function initialize() {
    background = new Background(0, 0, 0.8, stars1)
    background1 = new Background(0, -stars2.height, 0.8, stars2)
    rocket = createRocket()
    createPlanets(6, lavaworld)
    scoreboard = new Scoreboard(innerWidth * 0.02, innerHeight * 0.075, "red")
    animate()
}

// Main loopen för spelet
function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, innerWidth, innerHeight)
    background.update()
    background1.update()
    for (let i = 0; i < planetArray.length; i++) {
        planetArray[i].update()
    }
    rocket.update(planetArray)
    scoreboard.update()
}

let scoreboard
let rocketPicture
let background
let background1
let rocket
let planetArray = []

initialize()