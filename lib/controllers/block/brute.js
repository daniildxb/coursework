module.exports = function solveNumerically(blockSize, transactions) {
    let start = new Date();
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
    let finish = new Date();
    let diff = finish - start;
    return { numerical: optimal, time: diff };
};
