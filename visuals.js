let colorArrayRedFire = [
    '#ff0000',
    '#ff5a00',
    '#ff9a00',
    '#ffce00',
    '#ffe808'
]

function resetShadow() {
    c.shadowBlur = 0
    c.shadowColor = null
}

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
        c.shadowBlur = 0
        c.shadowColor = this.color
        c.fillStyle = this.color
        c.closePath()
        c.fill()
        resetShadow()
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