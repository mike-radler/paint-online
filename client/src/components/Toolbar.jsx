import React from 'react';
import "../style/toolbar.scss"
import canvasState from "../store/canvasState";
import Brush from "../tools/Brush";
import toolState from "../store/toolState";
import Rect from "../tools/Rect";
import Circle from "../tools/Circle";
import Line from "../tools/Line";
import CanvasState from "../store/canvasState";
import {Dropdown} from "react-bootstrap";
import {observer} from "mobx-react-lite";

const Toolbar = observer(() => {
    const download = () => {
        const dataURL = canvasState.canvas.toDataURL()
        const a = document.createElement('a')
        a.href = dataURL
        a.download = canvasState.sessionId + '.jpg'
        console.log(dataURL
        )
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    const undo = () => {
        CanvasState.socket.send(JSON.stringify({
            id: canvasState.sessionId,
            method: 'undo'
        }))
    }
    const redo = () => {
        CanvasState.socket.send(JSON.stringify({
            id: canvasState.sessionId,
            method: 'redo'
        }))
    }

    return (
        <div className="toolbar">
            <button className="toolbar__btn brush"
                    onClick={() => toolState.setTool(new Brush(canvasState.canvas, canvasState.socket, canvasState.sessionId))}/>
            <button className="toolbar__btn rect"
                    onClick={() => toolState.setTool(new Rect(canvasState.canvas, canvasState.socket, canvasState.sessionId))}/>
            <button className="toolbar__btn circle"
                    onClick={() => toolState.setTool(new Circle(canvasState.canvas, canvasState.socket, canvasState.sessionId))}/>
            <button className="toolbar__btn line"
                    onClick={() => toolState.setTool(new Line(canvasState.canvas, canvasState.socket, canvasState.sessionId))}/>
            <button className="toolbar__btn undo" onClick={() => undo()}/>
            <button className="toolbar__btn redo" onClick={() => redo()}/>
            <button className="toolbar__btn save" onClick={() => download()}/>
            <label className="toolbar__lbl" htmlFor="fill-color">Подключено пользователей:</label>

            <Dropdown className="toolbar__drd">
                <Dropdown.Toggle style={{borderColor: 'white'}} variant="outline-dark" id="dropdown-basic">
                    {canvasState.usersList.length}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {canvasState.usersList.map((user, idx) => (
                        <Dropdown.Item key={idx} href="#/action-1">{user}</Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>


        </div>
    );
});

export default Toolbar;