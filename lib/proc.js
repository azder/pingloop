/** Created by azder on 2017-10-11. */

const {warlog} = require('@azhder/taglog');

const warn = warlog(['PINGLOOP', process.pid]);

process.on(
    'uncaughtException',
    err => warn(`uncaughtException: ${err.stack}`)
);

process.on(
    'unhandledRejection',
    (error, promise) => warn(`unhandledRejection: ${promise} because ${error.stack}`)
);
