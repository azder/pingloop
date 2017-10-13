/** Created by azder on 2017-10-11. */

const {objof, df} = require('@azhder/nfun');
const pingman = require('@azhder/pingman');
const {deblog} = require('@azhder/taglog');

const {percent} = require('./lib/check');
const {state, RECON, SHORT, LONG} = require('./lib/State');

require('./lib/proc'); // setup process listeners


const conf = objof(require('./pingloop.json'));

/** @type [] */
const ips = df([], conf.ips);
const localhost = df(false, conf.localhost);

if (localhost) {
    ips.unshift('127.0.0.1');
}

const failed = (
    p => df(0.10, conf.minfail) < p && p < df(0.75, conf.maxfail)
);


const log = deblog('cycle');

/** @type State|EventEmitter */
const s = state({patience: conf.patience});

const echo = (
    (begin, end) => log(`current state: ${s}`)
);

s.on(SHORT, echo);
s.on(LONG, echo);
s.on(RECON, echo);

const pingloop = (async () => {

    const results = await pingman(null, ips);
    const rate = percent(results);

    log(`at: ${(new Date()).toISOString()}, success rate: ${rate * 100}%`);

    if (!rate && localhost) {
        log('ALL pings failed, even localhost. Maybe something else is wrong');
    }

    s[failed(rate) ? 'disconnect' : 'connect']();

    setTimeout(pingloop, 5000);

});


// noinspection JSIgnoredPromiseFromCall
pingloop();


