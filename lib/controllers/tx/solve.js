const solveNumerically = require('./brute');
const solveBounds = require('./bounds');
const solveGreedy = require('./greedy');

function solve(req, res) {
    const transferAmount = req.body.transferAmount,
        txIn = req.body.txInputs,
        result = [];
    Promise.resolve()
        .then(() => solveNumerically(transferAmount, txIn))
        .then(data => result.push({data}))
        .then(() => solveBounds(transferAmount, txIn))
        .then(data => result.push({data}))
        .then(() => solveGreedy(transferAmount, txIn))
        .then(data => result.push({data}))
        .then(() => res.status(200).send({result}));
}

module.exports = solve;
