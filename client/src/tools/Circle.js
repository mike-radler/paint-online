import Tool from "./Tool";

export default class Circle extends Tool {
    constructor(canvas, socket, id) {
        super(canvas, socket, id);
        this.listen()
    }

    listen() {
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
    }

    mouseUpHandler(e) {
        this.mouseDown = false
        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.id,
            figure: {
                type: 'circle',
                x: this.centerX,
                y: this.centerY,
                r: this.radius,
                lineWidth: this.ctx.lineWidth,
                strokeColor: this.ctx.strokeStyle,
                color: this.ctx.fillStyle
            }
        }))
    }

    mouseDownHandler(e) {
        this.mouseDown = true
        this.ctx.beginPath()
        this.centerX = e.pageX - e.target.offsetLeft
        this.centerY = e.pageY - e.target.offsetTop
        this.saved = this.canvas.toDataURL()
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            let curX = e.pageX - e.target.offsetLeft
            let curY = e.pageY - e.target.offsetTop
            this.radius = Math.pow(Math.pow(curX - this.centerX, 2) + Math.pow(curY - this.centerY, 2), 1 / 2)
            this.draw(this.centerX, this.centerY, this.radius)
        }
    }

    draw(x, y, r) {
        const img = new Image()
        img.src = this.saved
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            this.ctx.arc(x, y, r, 0, 2 * Math.PI)
            this.ctx.fill()
            this.ctx.stroke()
        }
    }

    static staticDraw(ctx, x, y, r, lineWidth, strokeColor, color) {
        let strokeColor1 = ctx.strokeStyle
        let lineWidth1 = ctx.lineWidth
        let color1 = ctx.fillStyle
        ctx.strokeStyle = strokeColor
        ctx.lineWidth = lineWidth
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(x, y, r, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
        ctx.strokeStyle = strokeColor1
        ctx.lineWidth = lineWidth1
        ctx.fillStyle = color1
    }
}