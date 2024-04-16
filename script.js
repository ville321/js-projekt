canvas = document.querySelector('canvas')

c = canvas.getContext('2d')

canvas.height = window.innerHeight
canvas.width = window.innerWidth

window.addEventListener('resize', function() {
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
})

document.addEventListener('keydown', function(event) {
    const key = event.key
    if(key === 'a' || key === 'ArrowLeft') {
        rocket.movement[0] = true
    } else if(key === 'd' || key === 'ArrowRight') {
        rocket.movement[1] = true
    } else if(key === ' ') {
        rocket.shoot()
    }
})

document.addEventListener('keyup', function(event) {
    const key = event.key
    if(key === 'a' || key === 'ArrowLeft') {
        rocket.movement[0] = false
    } else if(key === 'd' || key === 'ArrowRight') {
        rocket.movement[1] = false
    }
})


function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let colorArrayFire = [
    '#ff0000',
    '#ff5a00',
    '#ff9a00',
    '#ffce00',
    '#ffe808'
]

function Flame(x, y, r, velX, velY, color) {
    this.x = x
    this.y = y
    this.r = r
    this.vx = velX
    this.vy = velY
    this.c = color

    this.draw = function() {
        c.beginPath()
        c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false)
        c.shadowBlur = 5
        c.shadowColor = this.c
        c.fillStyle = this.c
        c.closePath()
        c.fill()
    }

    this.update = function() {
        this.x += this.vx
        this.y += this.vy
        if (this.r > 0.5) {
            this.r -= 0.1
            this.draw()
        }
    }
}

function RocketProjectile(x, y, r, vel) {
    this.x = x
    this.y = y
    this.r = r
    this.vel = vel
    this.c = 'white'
    this.draw = function() {
        c.beginPath()
        c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false)
        c.shadowBlur = 5
        c.shadowColor = this.c
        c.fillStyle = this.c
        c.closePath()
        c.fill()
    }

    this.update = function() {
        this.y += this.vel
        this.draw()
    }
}

class Rocket {
    constructor(x, y, width, height, vel, health) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.vel = vel
        this.health = health
        this.healthText = createText(10, 80, "hello")
        this.movement = [false, false]
        this.projectileObjects = []
        this.fireObjects = []
    }

    shoot() {
        this.projectileObjects.push(new RocketProjectile(this.x + this.width/2, this.y, 4, -9))
    }

    draw() {
        c.beginPath()
        c.roundRect(this.x, this.y, this.width, this.height, 30)
        c.fillStyle = '#9171f8'
        c.shadowBlur = '5'
        c.shadowColor = '#9171f8'
        c.closePath()
        c.fill()
        for(let i = 0; i < this.fireObjects.length; i++) {
            this.fireObjects[i].update()
        }
        for(let i = 0; i < this.projectileObjects.length; i++) {
            this.projectileObjects[i].update()
        }
        this.healthText.update()
    }

    update(asteroids) {
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

        for(let i = 0; i < asteroids.length; i++) {
            if(this.x && this.y == asteroids[i].x && asteroids[i].y) {
                this.health -= 10
            }
        }

        this.fireObjects.push(
            new Flame(
                this.x + this.width / 2,
                this.y + this.height,
                (Math.random() * 5) + 2,
                (Math.random() - 0.5) * 1,
                (Math.random()) * 5,
                colorArrayFire[randomInt(0, 5)]
            ))

        this.draw()
    }
}

function Asteroid(x, y, radius, vel) {
    this.x = x
    this.y = y
    this.r = radius
    this.vel = vel

    this.draw = function() {
        c.beginPath()
        c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false)
        c.fillStyle = '#808080'
        c.shadowBlur = 5
        c.shadowColor = '#808080'
        c.closePath()
        c.fill()
    }

    this.update = function() {
        this.y += this.vel
        if(this.y >= canvas.height) {
            this.y = -this.r
            this.x = randomInt(0, canvas.width - 100)
            this.r = randomInt(25, 50)
            this.vel = randomInt(2, 12)
        }
        this.draw()
    }
}

function createRocket() {
    let x = innerWidth/2
    let y = innerHeight - 175
    let width = 25
    let height = width * 2
    let velocity = 10
    let health = 3
    return new Rocket(x, y, width, height, velocity, health)
}

function createAsteroids() {
    let asteroidCount = 9
    for (let i = 0; i < asteroidCount; i++) {
        let x = randomInt(0, canvas.width - 100)
        let y = 10
        let radius = randomInt(25, 50)
        let velocity = randomInt(2, 12)
        asteroidArray.push(new Asteroid(x, y, radius, velocity))
    }
}

function createText(x, y, text) {
    return new Text(x, y, text)
}

class Text {
    constructor(x, y, text) {
        this.x = x
        this.y = y
        this.txt = text
    }

    draw() {
        c.font = '50px Arial'
        c.fillText(this.txt, this.x, this.y)
    }

    update(newText) {
        this.txt = newText
        this.draw()
    }
}

function initialize() {
    rocket = createRocket()
    createAsteroids()
    createText(10, 80, 100)
    animate()
}

function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, innerWidth, innerHeight)
    rocket.update(asteroidArray)
    for (let i = 0; i < asteroidArray.length; i++) {
        asteroidArray[i].update()
    }
}

let rocket
let asteroidArray = []

initialize()