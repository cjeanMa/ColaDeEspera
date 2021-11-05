const Control = require("../models/control");

const ticketControl = new Control();

const socketController = socket =>{
    console.log("Client Conectado", socket.id)
    socket.emit("estado-actual",ticketControl.last4);
    socket.emit("last-ticket", ticketControl.last);
    socket.emit("tickets-pendientes", ticketControl.seeTail());

    socket.on("next-ticket", (message, callback)=>{
        const next = ticketControl.next();
        socket.broadcast.emit("tickets-pendientes", ticketControl.seeTail());
        callback(next);
        // TODO: notificar que hay un nuevo ticket pendiente para asignar
    })

    socket.on('atender-ticket', (payload, callback)=>{
        if(!payload.escritorio){
            callback({
                state: false,
                msg: "El parametro escritorio es necesario"
            })
        }
        const ticket = ticketControl.serverTickets(payload.escritorio);
        
        socket.broadcast.emit("estado-actual",ticketControl.last4);
        socket.broadcast.emit("tickets-pendientes", ticketControl.seeTail());
        
        if(!ticket){
            callback({
                state: false,
                msg: "No hay tickets por atender"
            })
        }

        callback({
            state: true,
            ticket,
            total: ticketControl.seeTail()
        })

    }) 

    

}

module.exports ={
    socketController
}