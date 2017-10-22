/** Created by azder on 2017-10-21. */

const {objof, df} = require('@azhder/nfun');

const LOCALHOST = '127.0.0.1';

module.exports = (
    conf => {

        const c = objof(conf);

        /** @type [] */
        const ips = df([], c.ips);

        if (df(false, c.localhost)) {
            ips.unshift(LOCALHOST);
        }

        return ips;

    }
);

