import React, {useState} from 'react';
import toolState from "../store/toolState";
import canvasState from "../store/canvasState";
import {observer} from "mobx-react-lite";

const SettingBar = observer(() => {
    const close = () => {
        canvasState.socket.send(JSON.stringify({
            id: canvasState.sessionId,
            username: canvasState.username,
            method: 'disconnect'
        }))
        canvasState.socket.close(1000, 'отключен')
        canvasState.setUsername(null)
        canvasState.setSocket(null)
        canvasState.setSessionId(null)
        canvasState.setCanvas(null)
        canvasState.setUsers([])
    }
    return (
        <div className="setting-bar">
            <label style={{marginLeft: 10}} htmlFor="line-width">Толщина линии:</label>
            <input
                onChange={e => toolState.setLineWidth(e.target.value)}
                style={{margin: '0 5px'}}
                id="line-width"
                type="number" defaultValue={1} min={1} max={50}/>
            <label htmlFor="stroke-color">Цвет обводки:</label>
            <input onChange={e => toolState.setStrokeColor(e.target.value)}
                   style={{margin: '0 5px'}}
                   type="color"/>
            <label htmlFor="fill-color">Цвет заливки:</label>
            <input onChange={e => toolState.setFillColor(e.target.value)}
                   style={{margin: '0 5px'}}
                   type="color"/>
            {canvasState.username ?
                <div style={{marginLeft: 'auto'}}>
                    <label style={{marginRight: '5px'}} htmlFor="username">
                        Вы подключены как:
                        <strong> {canvasState.username}</strong>
                    </label>
                    <button style={{marginRight: '5px', padding: '2px'}} onClick={close}>Отключиться</button>
                </div>
            :
                ''
            }
        </div>
    );
});

export default SettingBar;