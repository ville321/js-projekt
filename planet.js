function createPlanets(count, spriteArray) {
    for (let i = 0; i < count; i++) {
        let spriteWidth = 100
        let sprite = spriteArray[randomInt(0, spriteArray.length - 1)][0]
        let x = randomInt(0, canvas.width - spriteWidth)
        const y = 10
        let velocity = randomInt(2, 4)
        planetArray.push(new Planet(x, y, velocity, sprite))
    }
}

// Skapar objekt för planeterna
class Planet {
    constructor(x, y, vel, img) {
        this.x = x
        this.y = y
        this.xMargin = 5
        this.vel = vel
        this.color = '#5bcfff'
        this.shadowColor = 'orange'
        this.exploded = false
        this.finishedExploding = true
        this.explosionObjects = []
        this.img = img
        this.frameIndex = 0 // Flytta frameIndex utanför draw()
        this.totalFrames = 10 // Anpassa totala antalet frames här
        this.spriteWidth = 100
        this.spriteHeight = 100
        this.spriteVel = randomInt(15, 25)
        this.runCounter = 0
    }


    explode() {
        this.exploded = true
        // Skapar explosions partiklar
        if (this.explosionObjects.length === 0) {
            for (let i = 0; i < randomInt(40, 45); i++) {
                this.explosionObjects.push(
                    new Particle(
                        randomInt(this.x, this.x + this.spriteWidth),
                        randomInt(this.y, this.y + this.spriteHeight),
                        randomInt(4, 7),
                        randomInt(-5, 5),
                        randomInt(-5, 5),
                        colorArrayRedFire[randomInt(0, 4)]
                    ))
            }
        }
        this.reset()
        // Loopar igenom alla explosions partiklar och uppdaterar + kollar om alla är färdigt exploderade
        this.finishedExploding = true
        for (let i = 0; i < this.explosionObjects.length; i++) {
            this.explosionObjects[i].update()
            if (this.explosionObjects[i].r > 0.5) {
                this.finishedExploding = false
            }
        }
        // Om planeten är färdig med explosionen så töms listan med objekten
        if (this.finishedExploding === true) {
            this.explosionObjects.splice(0, this.explosionObjects.length)
            this.exploded = false
        }
        
    }

    reset() {
        this.y = -this.spriteHeight
        this.x = randomInt(this.xMargin, canvas.width - this.spriteWidth - this.xMargin)
        this.vel = randomInt(2, 8)
    }

    draw() {
        c.shadowBlur = 10
        c.shadowColor = this.shadowColor
        c.drawImage(
            this.img, 
            this.spriteWidth * this.frameIndex,
            0,
            this.spriteWidth, this.spriteHeight, 
            this.x, this.y, 100, 100
        )
        resetShadow()
        if (this.runCounter === this.spriteVel) {
            this.frameIndex = (this.frameIndex + 1) % this.totalFrames; // Uppdatera frameIndex
            this.runCounter = 0
        }
        this.runCounter++
    }

    update(rocket) {
        if (this.exploded === false) {
            this.y += this.vel
            if(this.y + this.spriteHeight / 2 > canvas.height) {
                
                if(rocket.health > 0){
                rocket.health -= 10
                }
                this.explode()
                this.reset()
            }
            this.draw()
        } else {
            this.explode()
        }
    }
}