/** Created by azder on 2017-10-22. */

const {objof} = require('@azhder/nfun');
const twit = require('twit');

module.exports = (
    conf => {
        /** @type Twitter */
        const tw = twit(objof(conf).twitter);
        return status => (
            tw.post(
                'statuses/update',
                {
                    status, // REQUIRED
                    enable_dm_commands: false, // eslint-disable-line camelcase
                    fail_dm_commands:   true, // eslint-disable-line camelcase
                }
            )
        );
    }
);


