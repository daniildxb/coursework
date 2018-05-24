module.exports = function solveGreedy(blockSize, transactions) {
    let start = new Date();
    let origTransactions = JSON.parse(JSON.stringify(transactions));
    let optimalTransactions = [];
    let currentBlockSize = 0;
    for (let i = 0; i < origTransactions.length; i++) {
        origTransactions[i]['fee_per_byte'] = origTransactions[i]['fee'] / origTransactions[i]['length'];
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
        if (currentBlockSize + +origTransactions[i]['length'] <= blockSize) {
            currentBlockSize += +origTransactions[i]['length'];
            optimalTransactions.push(origTransactions[i]);
        }
    }
    let finish = new Date();
    let diff = finish - start;
    return { greedy: optimalTransactions, time: diff };
};
