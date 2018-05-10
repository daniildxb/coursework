$(document).ready(function() {
    let transactions;
    $('.generate-transactions').click(function() {

        let data = $('input[name="size"]').val();
        data = data.split(',');
        if (data.length != 2) {
            alert('Некорректные входные данные');
            return;
        }

        let blockSize = data[0];
        let txNum = data[1];

        $.ajax({
            method: 'post',
            url: 'http://localhost:3000/block/generate',
            dataType: 'json',
            data: {
                blockSize: blockSize,
                txNum: txNum
            },
            success: function(data) {
                console.log(data);
                transactions = data.transactions;
                let text = '';
                for (let i = 0; i < data.transactions.length; i++) {
                    text += `{${data.transactions[i]['length']}, ${data.transactions[i]['fee']}}\n`;
                }
                $('textarea#data').html(text);

            },
            error: function(err) {
                console.log(err);
                alert('Ошибка');
            }
        });
    });

    $('.generate-inputs').click(function() {

        let data = $('input[name="size"]').val();
        data = data.split(',');
        if (data.length != 2) {
            alert('Некорректные входные данные');
            return;
        }

        let amount = data[0];
        let outputs = data[1];

        $.ajax({
            method: 'post',
            url: 'http://localhost:3000/tx/generate',
            dataType: 'json',
            data: {
                transferAmount: amount,
                txOutNum: outputs
            },
            success: function(data) {
                console.log(data);
                let text = '';
                for (let i = 0; i < data.txOut.length; i++) {
                    text += `{${data.txOut[i]['amount']}, ${data.txOut[i]['length']}}\n`;
                }
                $('textarea#data').html(text);
            },
            error: function(err) {
                console.log(err);
                alert('Ошибка');
            }
        });
    });

    $('.solve-block').click(function() {
        console.log(transactions);
        let data = $('input[name="size"]').val();
        data = data.split(',');
        if (data.length != 2) {
            alert('Некорректные входные данные');
            return;
        }

        let blockSize = data[0];
        $.ajax({
            method: 'post',
            url: 'http://localhost:3000/block',
            dataType: 'json',
            data: {
                transactions: transactions,
                blockSize: blockSize
            },
            success: function(data) {
                console.log(data);
            },
            error: function(err) {
                console.log(err);
                alert('Ошибка');
            }
        });
    });

});