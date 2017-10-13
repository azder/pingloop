/** Created by azder on 2017-10-11. */

const {fob$} = require('@azhder/nfun');

const EventEmitter = require('events');

const CONN = 'connected';
const RECON = 'reconnect';
const SHORT = 'short';
const LONG = 'long';

const iso = Function.prototype.call.bind(Date.prototype.toISOString);

const moment = (
    (...args) => new Date(...args)
);

class State extends EventEmitter {

    constructor({patience = 60}) {
        super();
        this.patience = patience;
    }

    // noinspection JSUnusedGlobalSymbols
    static state(...args) {
        return new State(...args);
    }

    connect() {

        if (LONG === this.status) {
            this.emit(RECON, this.first, this.last);
        }

        this.first = null;
        this.last = null;
        this.seconds = 0;
        this.status = CONN;

        this.connected = moment();
        this.emit(CONN, this.connected, null);

    }

    disconnect() {

        const now = moment();

        this.first = this.first || now;
        this.last = now;
        this.seconds = (now - this.first) / 1000;

        if (CONN === this.status) {
            this.status = SHORT;
            this.emit(SHORT, this.first, this.last);
        }

        if (SHORT === this.status && this.seconds > this.patience) {
            this.status = LONG;
            this.emit(LONG, this.first, this.last);
        }
    }

    toString() {

        const status = this.status;

        if (CONN === status) {
            return `${status} (at ${iso(this.connected)})`;
        }

        return `${status} disconnect ` +
            `(${this.seconds} seconds from ${iso(this.first)} to ${iso(this.last)})`;

    }

}


module.exports = fob$(
    State,
    {
        CONN,
        RECON,
        SHORT,
        LONG,
    }
);



