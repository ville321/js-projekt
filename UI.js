function createText(text, x, y, color) {
    return new Text(text, x, y, color)
}

class Background {
    constructor(x, y, vel, img) {
        this.x = x
        this.y = y
        this.vel = vel
        this.img = img
    }
    
    draw() {
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

// Skapar objekt för texten som visas i spelet
class Text {
    constructor(text, x, y, color) {
        this.x = x
        this.y = y
        this.txt = text
        this.color = color
    }

    draw() {
        c.shadowBlur = 8
        c.shadowColor = this.color
        c.fillStyle = this.color
        c.font = '50px Space Grotesk'
        c.fillText(this.txt, this.x, this.y)
        resetShadow()
    }

    update(newText) {
        this.txt = newText
        this.draw()
    }
}

class ScoreSystem {
    constructor(x, y, color) {
        this.x = x
        this.y = y
        this.color = color
        this.multiplier = 10
        this.score = 0
        this.currentWave = 0
        this.maxWave = 50000
        this.scoreboard = createText(this.score, this.x, this.y, this.color)
    }

    wave() {
        createPlanets(1, planetSpriteArray)
    }

    draw() {
        this.scoreboard.update(this.score)
    }

    update() {
        this.score += 1 * this.multiplier
        if (this.score - this.currentWave > 5000 && this.currentWave < this.maxWave) {
            this.wave()
            this.currentWave = this.score
        }
        this.draw()
    }
}