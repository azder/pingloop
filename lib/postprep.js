/** Created by azder on 2017-10-22. */

const twit = require('twit');
const {objof, then, unary, nav, compose} = require('@azhder/nfun');
const {deblog, warlog} = require('@azhder/taglog');
const nodeback = require('./nodeback');

const TAG = 'post';

const log = unary(deblog(TAG));
const warn = unary(warlog(TAG));

const echo = compose(
    nodeback(warn, log),
    result => [
        nav('data.errors', result),
        'https://twitter.com/i/web/status/' + nav('data.id_str', result),
    ]
);

module.exports = (
    conf => {
        /** @type Twitter */
        const tw = twit(objof(conf).twitter);
        return (
            status => then(echo, tw.post(
                'statuses/update',
                {
                    status, // REQUIRED
                    enable_dm_commands: false, // eslint-disable-line camelcase
                    fail_dm_commands:   true, // eslint-disable-line camelcase
                }
            ))
        );
    }
);


