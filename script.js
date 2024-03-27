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

class Rocket {
    constructor(x, y, width, height) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.movement = [false, false]
    }


    draw() {
        c.beginPath()
        c.fillStyle = '#9171f8'
        c.roundRect(this.x, this.y, this.width, this.height, 30)
        c.closePath()
        c.fill()
    }

    update() {
        if(this.movement[0] === true) {
            this.x -= 10
        } else if(this.movement[1] === true) {
            this.x += 10
        }

        this.draw()
    }
}

let rocket = new Rocket(innerWidth/2, innerHeight - 175, 25, 50)

function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, innerWidth, innerHeight)
    rocket.update()

}

animate()
