/** Created by azder on 2017-10-11. */

const {objof, df} = require('@azhder/nfun');
const pingman = require('@azhder/pingman');
const {deblog} = require('@azhder/taglog');

const {RECON} = require('./lib/state');
const {percent} = require('./lib/check');
const iso = require('./lib/iso');

const procprep = require('./lib/procprep');
const stateprep = require('./lib/stateprep');
const ipsprep = require('./lib/ipsprep');
const postprep = require('./lib/postprep');

const conf = objof(require('./pingloop.json'));

procprep(conf);

/** @type State|EventEmitter */
const state = stateprep(conf);
const ips = ipsprep(conf);
const post = postprep(conf);

const failed = (
    p => df(0.10, conf.minfail) < p && p < df(0.75, conf.maxfail)
);

const localhost = df(false, conf.localhost);
const delay = df(1000, 1000 * objof(conf.cycle).delay);

state.on(
    RECON,
    // eslint-disable-next-line no-unused-vars
    (begin, end, data) => post(
        `здраво, јас сум компјутерот на @azder 
        и немав интернет од ${iso(begin)} до ${iso(end)}.
        повеќе инфо на: `
    )
);

const pingloop = (async () => {

    const log = deblog(['cycle', (new Date()).toISOString()]);

    const results = await pingman(null, ips);
    const rate = percent(results);
    // const rate = mockpercent.next().value;

    log(`success rate: ${rate * 100}%`);

    if (!rate && localhost) {
        log('ALL pings failed, even localhost. Maybe something else is wrong');
    }

    state[failed(rate) ? 'disconnect' : 'connect'](results);

    // loop again
    setTimeout(pingloop, delay);

});


// noinspection JSIgnoredPromiseFromCall
pingloop();


