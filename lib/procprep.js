/** Created by azder on 2017-10-21. */

const {warlog} = require('@azhder/taglog');
const ons = require('./ons');
const warn = warlog(['pingloop', process.pid]);

module.exports = (
    // eslint-disable-next-line no-unused-vars
    conf => ons(
        process,
        {
            uncaughtException:  err => warn(`uncaughtException: ${err.stack}`),
            unhandledRejection: (err, promise) => warn(`unhandledRejection: ${promise} because ${err.stack}`),
        }
    )
);


