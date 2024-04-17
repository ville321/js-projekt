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

let colorArrayRedFire = [
    '#ff0000',
    '#ff5a00',
    '#ff9a00',
    '#ffce00',
    '#ffe808'
]

let colorArrayBlueFire = [
    '#3d88ff',
    '#56b6ff',
    '#50c4ff',
    '#5bcfff',
    '#5ad6ff'
]

function Flame(x, y, radius, velX, velY, color) {
    this.x = x
    this.y = y
    this.r = radius
    this.vx = velX
    this.vy = velY
    this.color = color

    this.draw = function() {
        c.beginPath()
        c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false)
        c.shadowBlur = 15
        c.shadowColor = this.color
        c.fillStyle = this.color
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
    this.color = 'white'
    this.draw = function() {
        c.beginPath()
        c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false)
        c.shadowBlur = 25
        c.shadowColor = this.color
        c.fillStyle = this.color
        c.closePath()
        c.fill()
    }

    this.update = function(asteroids) {
        for(let i = 0; i < asteroids.length; i++) {
            if (asteroids[i].x + asteroids[i].r > this.x &&
                asteroids[i].x - asteroids[i].r < this.x &&
                asteroids[i].y + asteroids[i].r > this.y &&
                asteroids[i].y - asteroids[i].r < this.y)
            {
                asteroids[i].explode()
            }
        }
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
        this.color = '#9171f8'
        this.health = health
        this.healthText = createText(this.health, innerWidth * 0.02, innerHeight * 0.95)
        this.movement = [false, false]
        this.projectileObjects = []
        this.fireObjects = []
    }

    shoot() {
        this.projectileObjects.push(new RocketProjectile(this.x + this.width/2, this.y, 4, -9))
    }

    draw(asteroids) {
        c.beginPath()
        c.roundRect(this.x, this.y, this.width, this.height, 30)
        c.fillStyle = this.color
        c.shadowBlur = 15
        c.shadowColor = this.color
        c.closePath()
        c.fill()
        for(let i = 0; i < this.fireObjects.length; i++) {
            this.fireObjects[i].update()
        }
        for(let i = 0; i < this.projectileObjects.length; i++) {
            this.projectileObjects[i].update(asteroids)
        }
        this.healthText.update(this.health)
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
            if (asteroids[i].x + asteroids[i].r > this.x &&
                asteroids[i].x - asteroids[i].r < this.x &&
                asteroids[i].y + asteroids[i].r > this.y &&
                asteroids[i].y - asteroids[i].r < this.y)
            {
                this.health -= 10
                asteroids[i].explode()
            }
        }

        this.fireObjects.push(
            new Flame(
                this.x + this.width / 2,
                this.y + this.height,
                (Math.random() * 5) + 2,
                (Math.random() - 0.5) * 1,
                (Math.random()) * 5,
                colorArrayRedFire[randomInt(0, 4)]
            ))

        this.draw(asteroids)
    }
}

function Asteroid(x, y, radius, vel) {
    this.x = x
    this.y = y
    this.r = radius
    this.vel = vel
    this.color = '#5bcfff'
    this.shadowColor = '#5ad6ff'
    this.exploded = false
    this.explosionObjects = []

    this.explode = function() {
        this.exploded = true
        if (this.explosionObjects.length === 0) {
            for (let i = 0; i < randomInt(25, 30); i++) {
                this.explosionObjects.push(
                    new Flame(
                        randomInt(this.x-this.r, this.x+this.r),
                        randomInt(this.y-this.r, this.y+this.r),
                        randomInt(4,  7),
                        randomInt(-5, 5),
                        randomInt(-5, 5),
                        colorArrayBlueFire[randomInt(0, 4)]
                    ))
            }
        }
        let finishedExploding = false
        for (let i = 0; i < this.explosionObjects.length; i++) {
            this.explosionObjects[i].update()
            if (this.explosionObjects[i].r < 0.51) {
                 finishedExploding = true
            } else {
                finishedExploding = false
            }
        }
        if (finishedExploding === true) {
            this.reset()
        }
        
    }

    this.reset = function() {
        this.y = -this.r
        this.x = randomInt(0, canvas.width - 100)
        this.r = randomInt(25, 50)
        this.vel = randomInt(2, 12)
    }

    this.draw = function() {
        c.beginPath()
        c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.shadowBlur = 12
        c.shadowColor = this.shadowColor
        c.closePath()
        c.fill()
    }

    this.update = function() {
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
    let x = innerWidth/2
    let y = innerHeight - 175
    let width = 25
    let height = width * 2
    let velocity = 10
    let health = 100
    return new Rocket(x, y, width, height, velocity, health)
}

function createAsteroids(count) {
    let asteroidCount = count
    for (let i = 0; i < asteroidCount; i++) {
        let x = randomInt(0, canvas.width - 100)
        const y = 10
        let radius = randomInt(25, 50)
        let velocity = randomInt(2, 12)
        asteroidArray.push(new Asteroid(x, y, radius, velocity))
    }
}

function createText(text, x, y) {
    return new Text(text, x, y)
}

class Text {
    constructor(text, x, y) {
        this.x = x
        this.y = y
        this.txt = text
        this.color = 'red'
    }

    draw() {
        c.shadowBlur = 5
        c.shadowColor = this.color
        c.fillStyle = this.color
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
    createAsteroids(9)
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