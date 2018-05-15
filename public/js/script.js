$(document).ready(function() {
    let transactions;
    let txInputs;
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
        let inputs = data[1];

        $.ajax({
            method: 'post',
            url: 'http://localhost:3000/tx/generate',
            dataType: 'json',
            data: {
                transferAmount: amount,
                txInNum: inputs
            },
            success: function(data) {
                txInputs = data.txIn;
                let text = '';
                for (let i = 0; i < data.txIn.length; i++) {
                    text += `{${data.txIn[i]['amount']}, ${data.txIn[i]['length']}}\n`;
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
                let bounds = data['result'][1]['bounds'];
                let numeric = data['result'][0]['numeric'];
                let text = 'Результат методу гілок та границь:\n';
                let summ = 0;
                let summ2 = 0;
                let size = 0;
                for (let i = 0; i < bounds.length; i++) {
                    text += `{${bounds[i]['length']}, ${bounds[i]['fee']}}\n`;
                    summ += +bounds[i]['fee'];
                    size += +bounds[i]['length'];
                }
                for (let i = 0; i < numeric.length; i++) {
                    summ2 += +numeric[i]['fee'];
                }
                text += '\nРезультат методу повного перебору:\n';
                
                if (summ == summ2) {
                    for (let i = 0; i < numeric.length; i++) {
                        text += `{${numeric[i]['length']}, ${numeric[i]['fee']}}\n`;
                    }
                } else {
                    for (let i = 0; i < bounds.length; i++) {
                        text += `{${bounds[i]['length']}, ${bounds[i]['fee']}}\n`;
                    }
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

    $('.solve-tx').click(function() {
        let data = $('input[name="size"]').val();
        data = data.split(',');
        if (data.length != 2) {
            alert('Некорректные входные данные');
            return;
        }

        let transferAmount = data[0];
        $.ajax({
            method: 'post',
            url: 'http://localhost:3000/tx',
            dataType: 'json',
            data: {
                txInputs,
                transferAmount
            },
            success: function(data) {
                console.log(data);
                let bounds = data['result'][1]['bounds'];
                let text = 'Результат методу гілок та границь:\n';
                let summ = 0;
                let size = 0;
                for (let i = 0; i < bounds.length; i++) {
                    text += `{${bounds[i]['length']}, ${bounds[i]['amount']}}\n`;
                    summ += +bounds[i]['amount'];
                    size += +bounds[i]['length'];
                }
                let numeric = data['result'][0]['numeric'];
                let summ1 = 0;
                for (let i = 0; i < numeric.length; i++) {
                    summ1 += numeric[i]['amount'];
                }

                if (summ1 == summ) {    
                    text += '\nРезультат методу повного перебору:\n';
                    for (let i = 0; i < numeric.length; i++) {
                        text += `{${numeric[i]['length']}, ${numeric[i]['amount']}}\n`;
                    }
                } else {
                    text += '\nРезультат методу повного перебору:\n';
                    for (let i = 0; i < bounds.length; i++) {
                        text += `{${bounds[i]['length']}, ${bounds[i]['amount']}}\n`;
                    }
                }
                
                summs = 'Суммарный размер транзакции: ' + size + '\n' + 'Суммарная размер платежа: ' + summ + '\n\n\n';
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
            var a = document.createElement('a'),
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