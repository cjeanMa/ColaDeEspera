const express = require('express');
const http = require("http");
const cors = require('cors');
const socket = require("socket.io");
const { socketController } = require('../sockets/controller');
class Server {


    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = socket(this.server);
        
        this.port = process.env.PORT || 80;

        this.middleware();

        this.routes();

        this.sockets();
    }

    middleware() {
        this.app.use( cors() )
        //Parseo del body
        this.app.use(express.json());
        this.app.use(express.static('public'))
    }

    routes() {
        this.app.use("/socket", (req, res)=>res.send("OK"))
    }

    sockets(){
        this.io.on("connection", socketController)
    }

    listen() {

        this.server.listen(this.port, () => {
            console.log(`listening to port ${this.port}`)
        })
    }

}

module.exports = Server;