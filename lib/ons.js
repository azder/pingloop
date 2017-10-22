/** Created by azder on 2017-10-11. */

const {curry} = require('@azhder/nfun');

module.exports = curry(
    (emitter, listeners) => {
        Object.keys(listeners).map(key => emitter.on(key, listeners[key]));
        return emitter;
    }
);
