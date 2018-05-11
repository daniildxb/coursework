function generate(req, res) {
    const transferAmount = req.body.transferAmount,
        txOutNum = req.body.txOutNum,
        txOut = [];
    for (let i = 0; i < txOutNum - 1; i++) {
        let tx = {
            id: i,
            amount: Math.ceil(Math.random() * transferAmount * 0.5),
            length: Math.ceil(Math.random() * 100)
        };
        txOut.push(tx);
    }
    let txOutSum = txOut.reduce((sum, val) => sum + val);
    if (txOutSum < transferAmount) {
        txOut.push({
            id: txOutNum - 1,
            amount: transferAmount - txOutSum,
            length: Math.ceil(Math.random() * 100)
        });
    } else {
        txOut.push({
            id: txOutNum - 1,
            amount: 0,
            length: Math.ceil(Math.random() * 100)
        });
    }
    res.status(200).send({txOut});
}

module.exports = generate;
