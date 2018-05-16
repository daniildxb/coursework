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

function solveNumerically(transferAmount, txIn) {
    let start = new Date();
    function bounds(A, tx, txIn) {
        let origInputs = JSON.parse(JSON.stringify(txIn));
        if (origInputs.length > 0) {
            let transaction = origInputs.pop();
            let tx1 = JSON.parse(JSON.stringify(tx));
            tx1.push(transaction);
            bounds(A + transaction.amount, tx1, origInputs);
            bounds(A, tx, origInputs);
        } else {
            comb.push(tx);
        }
    }

    txIn.forEach(input => {
        input.amount = +input.amount;
        input.length = +input.length;
        input.id = +input.id;
    });
    let maxL = 1000000, minA = +transferAmount, optimal;
    let comb = [];
    bounds(0, [], txIn);
    comb.forEach(combination => {
        let length = combination.reduce((total, el) => total + el.length, 0);
        let amount = combination.reduce((total, el) => total + el.amount, 0);
        if (length < maxL && amount >= minA) {
            maxL = length;
            optimal = combination;
        } 
    });
    let finish = new Date();
    let diff = finish - start;
    return { numerical: optimal, time: diff };
}

function solveBounds(transferAmount, txIn) {
    let start = new Date();
    function bounds(A, tx, txIn) {
        let origInputs = JSON.parse(JSON.stringify(txIn));
        if (origInputs.length > 0 && A < minA) {
            let transaction = origInputs.pop();
            let tx1 = JSON.parse(JSON.stringify(tx));
            tx1.push(transaction);
            bounds(A + transaction.amount, tx1, origInputs);
            bounds(A, tx, origInputs);
        } else {
            comb.push(tx);
        }
    }

    txIn.forEach(input => {
        input.amount = +input.amount;
        input.length = +input.length;
        input.id = +input.id;
    });
    let maxL = 1000000, minA = +transferAmount, optimal;
    let comb = [];
    bounds(0, [], txIn);
    comb.forEach(combination => {
        let length = combination.reduce((total, el) => total + el.length, 0);
        let amount = combination.reduce((total, el) => total + el.amount, 0);
        if (length < maxL && amount >= minA) {
            maxL = length;
            optimal = combination;
        } 
    });
    let finish = new Date;
    let diff = finish - start;
    return { bounds: optimal, time: diff };
}

function solveGreedy(transferAmount, txIn) {
    let start = new Date();
    let origTransactions = JSON.parse(JSON.stringify(txIn));
    let optimalTransactions = [];
    let currentAmount = 0;
    for (let i = 0; i < origTransactions.length; i++) {
        origTransactions[i]['fee_per_byte'] = origTransactions[i]['amount'] / origTransactions[i]['length'];
    }
    origTransactions.sort(function(a, b) {
        if (a.fee_per_byte < b.fee_per_byte) {
            return 1;
        }
        if (a.fee_per_byte > b.fee_per_byte) {
            return -1;
        }
        return 0;
    }); 
    
   for (let i = 0; i < origTransactions.length; i++) {
       if (currentAmount <= transferAmount) {
           currentAmount += +origTransactions[i]['amount'];
            optimalTransactions.push(origTransactions[i]);
        }
    }
    let finish = new Date();
    let diff = finish - start;
    return { greedy: optimalTransactions, time: diff };
}

module.exports = solve;
