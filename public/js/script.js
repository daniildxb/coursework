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
                data = data['result'][0];
                let text = '';
                let summ = 0;
                let size = 0;
                for (let i = 0; i < data.length; i++) {
                    text += `{${data[i]['length']}, ${data[i]['fee']}}\n`;
                    summ += +data[i]['fee'];
                    size += +data[i]['length'];
                }
                summs = 'Суммарный размер блока: ' + size + '\n' + 'Суммарная комиссия: ' + summ + '\n\n\n';
                text = summs + text;
                $('textarea#result').html(text);
            },
            error: function(err) {
                console.log(err);
                alert('Ошибка');
            }
        });
    });

    $('.button-download').click(function() {
        if ($('textarea#result').val() != '') {
            download($('textarea#result').val(), 'results', 'txt');
        }
    });

    $('textarea#data').click(function() {
        if ($('textarea#data').val() != '') {
            download($('textarea#data').val(), 'transactions', 'txt');
        }
    });

    function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

});