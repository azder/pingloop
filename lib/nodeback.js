/** Created by azder on 2017-10-22. */

const {curry} = require('@azhder/nfun');

module.exports = curry(
    (nay, yay, [error, value]) => error ? nay(error) : yay(value)
);


