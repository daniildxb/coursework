function generate(req, res) {
    const transferAmount = req.body.transferAmount,
        txInNum = req.body.txInNum,
        txIn = [];
    for (let i = 0; i < txInNum; i++) {
        let tx = {
            id: i,
            amount: Math.ceil(Math.random() * transferAmount * 0.5),
            length: Math.ceil(Math.random() * 100)
        };
        txIn.push(tx);
    }
    let txInSum = txIn.reduce((sum, val) => sum + val.amount, 0);
    if (txInSum < transferAmount) {
        txIn[txIn.length - 1].amount = (transferAmount - txInSum) * 1.5;
    }
    res.status(200).send({txIn});
}

module.exports = generate;
