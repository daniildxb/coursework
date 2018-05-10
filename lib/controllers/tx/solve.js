function solve(req, res) {
    const blockSize = req.body.blockSize,
        transactions = req.body.transactions,
        result = [];
    Promise.resolve()
        .then(() => solveNumerically(blockSize, transactions))
        .then(data => result.push(data))
        .then(() => solveGenetically(blockSize, transactions))
        .then(data => result.push(data))
        .then(() => res.status(200).send({result}));
}

function solveNumerically(blockSize, transactions) {
    return;
}

function solveGenetically(blockSize, transactions) {
    return;
}

module.exports = solve;
