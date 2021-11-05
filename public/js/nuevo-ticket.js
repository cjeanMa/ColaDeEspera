
const lblNuevoTicket = document.querySelector("#lblNuevoTicket");
const btnGenerate = document.querySelector("button")

const socket = io();

socket.on("connect", ()=>{
    btnGenerate.disabled = false;
})

socket.on("disconnect", ()=>{
    btnGenerate.disabled = true;
})

socket.on('last-ticket', (lastTicket) =>{
    lblNuevoTicket.innerText = lastTicket
})

btnGenerate.addEventListener("click", ()=>{
    socket.emit("next-ticket",null, (ticket)=>{
        lblNuevoTicket.innerText = ticket
    })
})