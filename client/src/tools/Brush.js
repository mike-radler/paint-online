import Tool from "./Tool";

export default class Brush extends Tool {
    constructor(canvas, socket, id) {
        super(canvas, socket, id);
        this.listen()
    }

    listen() {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
    }

    mouseUpHandler(e) {
        this.mouseDown = false
        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.id,
            figure: {
                type: 'finish'
            }
        }))
    }

    mouseDownHandler(e) {
        this.mouseDown = true
        this.ctx.beginPath()
    }

    mouseMoveHandler(e) {
        if (this.mouseDown) {
            this.socket.send(JSON.stringify({
                method: 'draw',
                id: this.id,
                figure: {
                    type: 'brush',
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop,
                    lineWidth: this.ctx.lineWidth,
                    strokeColor: this.ctx.strokeStyle
                }
            }))
        }
    }

    static draw(ctx, x, y, lineWidth, strokeColor) {
        let strokeColor1 = ctx.strokeStyle
        let lineWidth1 = ctx.lineWidth
        ctx.strokeStyle = strokeColor
        ctx.lineWidth = lineWidth
        ctx.lineTo(x, y)
        ctx.stroke()
        ctx.strokeStyle = strokeColor1
        ctx.lineWidth = lineWidth1
    }
}
