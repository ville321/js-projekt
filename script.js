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

class Rocket {
    constructor(x, y, width, height, vel, health) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.vel = vel
        this.health = health
        this.movement = [false, false]
    }


    draw() {
        c.beginPath()
        c.fillStyle = '#9171f8'
        c.roundRect(this.x, this.y, this.width, this.height, 30)
        c.closePath()
        c.fill()
    }

    update(collisionObject) {
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

        // Kollision med asteroider
        if(this.x && this.y == collisionObject.x && collisionObject.y) {
            this.health--
        }

        this.draw()
    }
}

class Asteroid {
    constructor(x, y, width, height, vel) {  
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.vel = vel
    }

    draw() {
        c.beginPath()
        c.fillStyle = '#9999f9'
        c.roundRect(this.x, this.y, this.width, this.height, 30)
        c.closePath()
        c.fill()
    }

    update() {
        this.draw()
        this.y += this.vel
        if(this.y >= canvas.height) {
            this.y = -this.height
            this.x = randomInt(0, canvas.width - 100)
            this.width, this.height = randomInt(10, 100), randomInt(0, 100)

    }
}
}

let rocket = new Rocket(innerWidth/2, innerHeight - 175, 25, 50, 10, 3)
let asteroid = new Asteroid(randomInt(0, canvas.width - 100), 10, randomInt(10,100), randomInt(10,100), 7)

function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, innerWidth, innerHeight)
    rocket.update(asteroid)
    asteroid.update()

}

animate()