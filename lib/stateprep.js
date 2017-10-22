/** Created by azder on 2017-10-21. */

const {deblog} = require('@azhder/taglog');

const {state, RECON, SHORT, LONG} = require('./state');


const log = deblog('stateprep');

module.exports = (
    conf => {
        /** @type State|EventEmitter */
        const s = state({patience: conf.patience});

        const echo = (
            (begin, end, data) => log(`current state: ${s}, data: ${JSON.stringify(data)}`)
        );

        s.on(SHORT, echo);
        s.on(LONG, echo);
        s.on(RECON, echo);

        return s;

    }
);


