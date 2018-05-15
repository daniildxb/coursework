function solve(req, res) {
    const blockSize = req.body.blockSize,
        transactions = req.body.transactions,
        result = [];
    Promise.resolve()
        .then(() => solveNumerically(blockSize, transactions))
        .then((data) => result.push({numeric: data}))
        .then(() => solveBounds(blockSize, transactions))
        .then(data => result.push({bounds: data}))
        .then(() => res.status(200).send({result}));
}

function solveNumerically(blockSize, transactions) {
    function checkTx(L, tx, transactions) {
        let origTransactions = JSON.parse(JSON.stringify(transactions));
        if (origTransactions.length > 0) {
            let transaction = origTransactions.pop();
            let tx1 = JSON.parse(JSON.stringify(tx));
            tx1.push(transaction);
            checkTx(L + transaction.length, tx1, origTransactions);
            checkTx(L, tx, origTransactions);
        } else {
            comb.push(tx);
        }
    }

    let comb = [], maxF = 0, optimal, maxL = +blockSize;
    checkTx(0, [], transactions);
    comb.forEach(combination => {
        let fee = combination.reduce((total, el) => total + +el.fee, 0);
        let length = combination.reduce((total, el) => total + +el.length, 0);
        if (fee > maxF && length <= maxL) {
            maxF = fee;
            optimal = combination;
        } 
    });
    return optimal;
}

function solveBounds(blockSize, transactions) {
    function bounds(L, tx, transactions) {
        let origTransactions = JSON.parse(JSON.stringify(transactions));
        if (origTransactions.length > 0 && L <= maxL) {
            let transaction = origTransactions.pop();
            if (L + transaction.length <= maxL) {
                let tx1 = JSON.parse(JSON.stringify(tx));
                tx1.push(transaction);
                bounds(L + transaction.length, tx1, origTransactions);
                bounds(L, tx, origTransactions);
            } else {
                bounds(L, tx, origTransactions);
            }
        } else {
            comb.push(tx);
        }
    }

    transactions.forEach(transaction => {
        transaction.fee = +transaction.fee;
        transaction.length = +transaction.length;
        transaction.id = +transaction.id;
    });
    let maxF = 0, maxL = +blockSize, optimal;
    let comb = [];
    bounds(0, [], transactions);
    comb.forEach(combination => {
        let fee = combination.reduce((total, el) => total + el.fee, 0);
        if (fee > maxF) {
            maxF = fee;
            optimal = combination;
        } 
    });
    return optimal;
}

module.exports = solve;


