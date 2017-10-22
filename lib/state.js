/** Created by azder on 2017-10-11. */

const EventEmitter = require('events');
const {fob$} = require('@azhder/nfun');
const iso = require('./iso');

const CONN = 'connected';
const RECON = 'reconnect';
const SHORT = 'short';
const LONG = 'long';

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

    connect(data) {

        const prev = this.status;
        this.status = CONN;
        this.connected = moment();

        if (LONG === prev) {
            // must use this.first and this.last before they reset
            this.emit(RECON, this.first, this.last, data);
        }

        this.first = null;
        this.last = null;
        this.seconds = 0;

        this.emit(CONN, this.connected, null, data);

    }

    disconnect(data) {

        const now = moment();

        this.first = this.first || now;
        this.last = now;
        this.seconds = (now - this.first) / 1000;

        if (SHORT === this.status && this.seconds > this.patience) {
            this.status = LONG;
            this.emit(LONG, this.first, this.last, data);
        } else if (!this.status || CONN === this.status) {
            this.status = SHORT;
            this.emit(SHORT, this.first, this.last, data);
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



