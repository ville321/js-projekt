function createRocket() {
    let width = 60
    let height = width * 1.3
    let x = canvas.width / 2 - width / 2
    let y = innerHeight * 0.73
    let velocity = 12.5
    let health = 100
    let rocketImage = rocketPNG
    return new Rocket(x, y, width, height, velocity, health, rocketImage)
}

// Skapar objekt för raketen
class Rocket {
    constructor(x, y, width, height, vel, health, rocketImage) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.vel = vel
        this.health = health
        this.healthText = createText(this.health, canvas.width * 0.02, canvas.height * 0.95, 'red')
        this.movement = [false, false]
        this.projectileObjects = []
        this.fireObjects = []
        this.rocketImage = rocketImage
    }

    shoot() {
        this.projectileObjects.push(new RocketProjectile(this.x + this.width/2, this.y, 4, -9))
    }

    draw(planets) {
        for(let i = 0; i < this.projectileObjects.length; i++) {
            this.projectileObjects[i].update(planets)

            if (this.projectileObjects[i].collided == this.projectileObjects[i].maxCollisions) {
                this.projectileObjects.splice(i, 1)
            }
        }
        c.shadowBlur = 15
        c.shadowColor = 'red'
        c.drawImage(this.rocketImage, this.x, this.y, this.width, this.height)
        for(let i = 0; i < this.fireObjects.length; i++) {
            this.fireObjects[i].update()
        }
        this.healthText.update(this.health + "%")

        resetShadow()
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
            if (planets[i].x <= this.x &&
                planets[i].x + planets[i].spriteWidth >= this.x + this.width &&
                planets[i].y <= this.y &&
                planets[i].y + planets[i].spriteHeight >= this.y) 
            {
                if (this.health > 0) {
                    this.health -= 10
                }
                planets[i].explode()
            }
        }

        if (this.health <= 0) {
            deathMenu()
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

// Skapar objekt för skotten som skjuts av raketen
class RocketProjectile {
    constructor(x, y, r, vel) {
        this.x = x
        this.y = y
        this.vel = vel
        this.collided = 0
        this.maxCollisions = 1
        this.projectilePNG = RocketProjectilePNG
        this.projectileDimensions = [10, 50]
    }

    draw() {
        c.shadowBlur = 1
        c.shadowColor = 'blue'
        c.drawImage(this.projectilePNG, this.x - 5, this.y, this.projectileDimensions[0], this.projectileDimensions[1])
        resetShadow()
    }

    update(planets) {
        // Kollar om skotten träffar en planet
        for(let i = 0; i < planets.length; i++) {
            if (planets[i].x < this.x &&
            planets[i].x + planets[i].spriteWidth > this.x &&
            planets[i].y < this.y &&
            planets[i].y + planets[i].spriteHeight > this.y)
            {
                planets[i].explode()
                this.collided += 1
            }
        }
        this.y += this.vel
        this.draw()
    }
}