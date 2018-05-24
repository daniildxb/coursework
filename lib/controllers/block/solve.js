const solveNumerically = require('./brute');
const solveBounds = require('./bounds');
const solveGreedy = require('./greedy');


function solve(req, res) {
    const blockSize = req.body.blockSize,
        transactions = req.body.transactions,
        result = [];
    Promise.resolve()
        .then(() => solveNumerically(blockSize, transactions))
        .then((data) => result.push({data}))
        .then(() => solveBounds(blockSize, transactions))
        .then(data => result.push({data}))
        .then(() => solveGreedy(blockSize, transactions))
        .then(data => result.push({data}))
        .then(() => res.status(200).send({result}));
}

module.exports = solve;
