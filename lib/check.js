/** Created by azder on 2017-10-10. */

const {map, reduce$, compose, len, curry, zfob$} = require('@azhder/nfun');

const failint = (
    // converts null or array to flipped boolean, then to number
    ([epair]) => !epair - 0
);

const passint = (
    // converts null or array to flipped boolean, then to number
    ([, dpair]) => !dpair - 0
);

const sum = (
    (memo, current) => memo + current
);

const failsum = compose(reduce$(sum, 0), map(failint));

const rate = (
    results => failsum(results) / len(results)
);

const round = curry(
    (decimal, number) => Math.round(10 ** decimal * number) / 10 ** decimal
);

const percent = compose(round(2), rate);

module.exports = zfob$(
    rate,
    {
        failint,
        passint,
        failsum,
        round,
        percent,
        rate,
    }
);

