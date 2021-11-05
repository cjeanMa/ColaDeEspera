
const lblEscritorio = document.querySelector("h1");
const btnAtender = document.querySelector("button");
const lblAtendiendo = document.querySelector("small");
const lblMensaje = document.querySelector("#lblMensaje");
const lblPendientes = document.querySelector("#lblPendientes");

const searchParams = new URLSearchParams(window.location.search);
if (!searchParams.has("escritorio")) {
    window.location = "index.html";
    throw new Error("El escritorio es obligatorio")
}

const escritorio = searchParams.get("escritorio");
lblEscritorio.innerText = escritorio;

const socket = io();

socket.on("connect", () => {
    btnAtender.disabled = false;
})

socket.on("disconnect", () => {
    btnAtender.disabled = true;
})

socket.on('tickets-pendientes', (tickets) => {
    if (!tickets) {
        lblMensaje.style.display = "";
        lblPendientes.innerText = 0;
    }
    else {
        lblMensaje.style.display = "none";
        lblPendientes.innerText = tickets;
    }

})

btnAtender.addEventListener("click", () => {
    const payload = {
        escritorio,
    }
    socket.emit("atender-ticket", payload, (callback) => {
        if (!callback.state) {
            lblAtendiendo.innerText = callback.msg;
            lblPendientes.innerText = "0";
        }
        else {
            const { number, desktop } = callback.ticket;
            const total = callback.total;
            lblAtendiendo.innerText = number;
            console.log(total);
            if (total) {
                lblMensaje.style.display = "none";
                lblPendientes.innerText = total;
            }
            else {
                lblMensaje.style.display = "";
                lblPendientes.innerText = "0";
            }
        }
    })
})