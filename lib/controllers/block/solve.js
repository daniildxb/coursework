function solve(req, res) {
    const blockSize = req.body.blockSize,
        transactions = req.body.transactions,
        result = [];
    Promise.resolve()
        .then(() => solveNumerically(blockSize, transactions))
        .then((data) => result.push(data))
        .then(() => solveGenetically(blockSize, transactions))
        .then(data => result.push(data))
        .then(() => res.status(200).send({result}));
}

function solveNumerically(blockSize, transactions) {
    let feesPerByte = [];
    let optimalTransactions = [];
    let currentBlockSize = 0;
    for (let i = 0; i < transactions.length; i++) {
        transactions[i]['fee_per_byte'] = transactions[i]['fee'] / transactions[i]['length'];
    }
    transactions.sort(function(a, b) {
        if (a.fee_per_byte < b.fee_per_byte) {
            return 1;
        }
        if (a.fee_per_byte > b.fee_per_byte) {
            return -1;
        }
      return 0;
    }); 
    
    for (let i = 0; i < transactions.length; i++) {
        if (currentBlockSize + +transactions[i]['length'] < blockSize) {
            currentBlockSize += +transactions[i]['length'];
            optimalTransactions.push(transactions[i]);
        }
    }
    console.log(optimalTransactions);
    return optimalTransactions;

}

function solveGenetically(blockSize, transactions) {
    return;
}

module.exports = solve;
