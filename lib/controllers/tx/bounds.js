module.exports = function solveBounds(transferAmount, txIn) {
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
};
