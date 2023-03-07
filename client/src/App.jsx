import React from "react";
import Canvas from "./components/Canvas";
import "./style/app.scss"
import Toolbar from "./components/Toolbar";
import SettingBar from "./components/SettingBar";
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path='/:id' element={
                        <div>
                            <Toolbar/>
                            <SettingBar/>
                            <Canvas/>
                        </div>}/>
                    <Route path='*' element={<Navigate to={`f${(+new Date).toString(16)}`}/>}/>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
