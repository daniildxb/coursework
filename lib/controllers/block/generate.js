function generate(req, res) {
    const blockSize = req.body.blockSize,
        txNum = req.body.txNum,
        transactions = [];
    for (let i = 0; i < txNum; i++) {
        let tx = {
            id: i,
            length: Math.ceil(Math.random() * blockSize),
            fee: Math.random()
        };
        transactions.push(tx);
    }
    res.status(200).send({transactions});
}

module.exports = generate;
