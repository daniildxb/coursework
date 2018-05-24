module.exports = function solveBounds(blockSize, transactions) {
    let start = new Date();
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
    let finish = new Date();
    let diff = finish - start;
    return { bounds: optimal, time: diff };
};
