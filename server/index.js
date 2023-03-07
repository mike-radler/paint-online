const express = require('express')
const app = express()
const WSServer = require('express-ws')(app)
const aWss = WSServer.getWss()
const cors = require('cors')
const PORT = process.env.PORT || 5000
const fs = require('fs')
const path = require('path')
const users = []

app.use(cors())
app.use(express.json())

app.ws('/', (ws, req) => {
    ws.on('message', (msg) => {
        msg = JSON.parse(msg)
        switch (msg.method) {
            case "connection":
                users.push(msg.username)
                msg.users = users
                connectionHandler(ws, msg)
                break
            case "draw":
                connectionHandler(ws, msg)
                break
            case "frame":
                connectionHandler(ws, msg)
                break
            case "undo":
                connectionHandler(ws, msg)
                break
            case "redo":
                connectionHandler(ws, msg)
                break
            case "disconnect":
                users.splice(users.indexOf(msg.username), 1)
                msg.users = users
                connectionHandler(ws, msg)
        }
    })
    ws.on('close', () => {

    })
})

app.post('/image', (req, res) => {
    try {
        const data = req.body.img.replace('data:image/png;base64,', '')
        fs.writeFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`), data, 'base64')
        return res.status(200).json({message: 'загружено'})
    } catch (e) {
        console.log(e)
        return res.status(500).json('error')
    }
})
app.get('/image', (req, res) => {
    try {
        const file = fs.readFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`))
        const data = 'data:image/png;base64,' + file.toString('base64')
        res.json(data)
    } catch (e) {
        return res.status(201).json({message: 'нет картинки'})
    }
})

app.listen(PORT, () => console.log(`Server started on PORT:${PORT}`))

const connectionHandler = (ws, msg) => {
    ws.id = msg.id
    msg.users = users
    broadcastConnection(ws, msg)
}

const broadcastConnection = (ws, msg) => {
    aWss.clients.forEach(client => {
        if (client.id === msg.id) {
            client.send(JSON.stringify(msg))
        }
    })
}
