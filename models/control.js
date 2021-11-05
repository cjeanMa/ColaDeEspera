const path = require("path");
const fs = require("fs");

class Ticket {
    constructor(number, desktop){
        this.number = number,
        this.desktop = desktop
    }
}

class Control {
    constructor() {
        this.last = 0;
        this.today = new Date().getDate();
        this.tickets = [];
        this.last4 = [];

        this.init();
    }

    get toJson() {
        return {
            last: this.last,
            today: this.today,
            tickets: this.tickets,
            last4: this.last4
        }
    }

    init() {

        const { last, today, tickets, last4 } = require("../database/data.json");
        if (today === this.today) {
            this.last = last,
            this.tickets = tickets,
            this.last4 = last4
        }
        else{
            this.saveDB();
        }
    }

    saveDB() {
        const dirPath = path.join(__dirname, "../database/data.json");
        fs.writeFileSync(dirPath, JSON.stringify(this.toJson))
    }

    next(){
        this.last += 1;
        const ticket = new Ticket( this.last, null);
        this.tickets.push(ticket);

        this.saveDB();
        return ticket.number;
    }

    serverTickets( desktop ){
        if(this.tickets.length == 0){
            return null;
        }
        //const ticket = this.tickets[0];
        const ticket = this.tickets.shift();
        ticket.desktop = desktop;
        this.last4.unshift(ticket)
        if( this.last4.length > 4){
            this.last4.splice(-1,1);
        }
        this.saveDB();
        return ticket;

    }   

    seeTail(){
        return this.tickets.length ? this.tickets.length : false; 
    }
}

module.exports = Control;