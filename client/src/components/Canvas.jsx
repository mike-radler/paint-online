import React, {useEffect, useRef, useState} from 'react';
import "../style/canvas.scss"
import {observer} from "mobx-react-lite";
import canvasState from "../store/canvasState";
import {Button, Modal, Toast, ToastContainer} from "react-bootstrap";
import {useParams} from "react-router-dom";
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import Rect from "../tools/Rect";
import axios from "axios";
import Circle from "../tools/Circle";
import Line from "../tools/Line";

const Canvas = observer(() => {
    const canvasRef = useRef()
    const usernameRef = useRef()
    const [modal, setModal] = useState(true)
    const messages = []
    const [toast, setToast] = useState(false)
    const [color, setColorToast] = useState(false)
    const [name, setNameToast] = useState('')
    const [method, setMethodToast] = useState('')
    const params = useParams()
    const server = new WebSocket('ws://localhost:5000/')

    const connectionHandler = () => {
        canvasState.setUsername(usernameRef.current.value)
        if (canvasState.username) {
            setModal(false)
            canvasState.setSocket(server)
            canvasState.setSessionId(params.id)
            canvasState.setCanvas(canvasRef.current)
            toolState.setTool(new Brush(canvasState.canvas, canvasState.socket, canvasState.sessionId))

            canvasState.socket.send(JSON.stringify({
                id: canvasState.sessionId,
                username: canvasState.username,
                method: 'connection'
            }))

            try {
                axios.get(`http://localhost:5000/image?id=${canvasState.sessionId}`)
                    .then(response => {
                        const img = new Image()
                        const ctx = canvasState.canvas.getContext('2d')
                        img.src = response.data
                        img.onload = () => {
                            ctx.clearRect(0, 0, canvasState.canvas.width, canvasState.canvas.height)
                            ctx.drawImage(img, 0, 0, canvasState.canvas.width, canvasState.canvas.height)
                            ctx.stroke()
                        }
                    })
            } catch (e) {
                console.log(e)
            }
            controlHandler(canvasState.socket)
        }
    }

    const controlHandler = (socket) => {
        socket.onmessage = (event) => {
            let msg = JSON.parse(event.data)
            switch (msg.method) {
                case "connection":
                    messages.push(msg.username)
                    setColorToast(true)
                    setNameToast(msg.username)
                    setMethodToast('подключился')
                    setToast(true)
                    canvasState.setUsers(msg.users)
                    break
                case "draw":
                    drawHandler(msg)
                    break
                case "frame":
                    canvasState.pushToUndo(canvasState.canvas.toDataURL())
                    break
                case "undo":
                    canvasState.undo()
                    break
                case "redo":
                    canvasState.redo()
                    break
                case "disconnect":
                    setColorToast(false)
                    setNameToast(msg.username)
                    setMethodToast('отключился')
                    setToast(true)
                    canvasState.setUsers(msg.users)
                    break
            }
        }
    }

    const drawHandler = (msg) => {
        const ctx = canvasState.canvas.getContext('2d')
        switch (msg.figure.type) {
            case "brush":
                Brush.draw(ctx, msg.figure.x, msg.figure.y, msg.figure.lineWidth, msg.figure.strokeColor)
                break
            case "rect":
                Rect.staticDraw(ctx, msg.figure.x, msg.figure.y, msg.figure.width, msg.figure.height, msg.figure.lineWidth, msg.figure.strokeColor, msg.figure.color)
                ctx.beginPath()
                break
            case "circle":
                Circle.staticDraw(ctx, msg.figure.x, msg.figure.y, msg.figure.r, msg.figure.lineWidth, msg.figure.strokeColor, msg.figure.color)
                ctx.beginPath()
                break
            case "line":
                Line.staticDraw(ctx, msg.figure.startX, msg.figure.startY, msg.figure.x, msg.figure.y, msg.figure.lineWidth, msg.figure.strokeColor, msg.figure.color)
                ctx.beginPath()
                break
            case  "finish":
                ctx.beginPath()
                break
        }
    }

    const mouseDownHandler = () => {
        canvasState.socket.send(JSON.stringify({
            id: canvasState.sessionId,
            //username: canvasState.username,
            method: 'frame'
        }))
    }

    const mouseUpHandler = () => {
        if (canvasState.socket) {
            axios.post(`http://localhost:5000/image?id=${params.id}`, {img: canvasState.canvas.toDataURL()})
                .then(response => console.log(response.data))
        }
    }

    return (<div className="canvas">
        <Modal show={modal}>
            <Modal.Header closeButton>
                <Modal.Title>Как Вас зовут?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <input type="text" ref={usernameRef}></input>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={connectionHandler}>
                    Продолжить
                </Button>
            </Modal.Footer>
        </Modal>
        <ToastContainer position='bottom-end' className='p-4'>
            <Toast onClose={() => setToast(false)} show={toast} bg={color ? 'success' : 'danger'} delay={5000} autohide>
                <Toast.Header>
                    <strong className="me-auto">Новое сообщение!</strong>
                    {/*<small>только что!</small>*/}
                </Toast.Header>
                <Toast.Body>Пользователь <strong>{name}</strong> {method}.</Toast.Body>
            </Toast>
        </ToastContainer>
        <canvas onMouseDown={() => mouseDownHandler()}
                onMouseUp={() => mouseUpHandler()}
                style={{background: '#white'}}
                ref={canvasRef}
                style={{marginTop: 60}}
                width={1000}
                height={600}/>
    </div>);
});

export default Canvas;