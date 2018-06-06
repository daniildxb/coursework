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

        if (data[1] > 250 || !Number.isInteger(+data[1])) {
            alert('Amount of transactions is invalid. Max allowed transactions - 250');
            return;
        } else {

            let blockSize = +data[0];
            if (blockSize <= 0 || !Number.isInteger(blockSize)) {
                alert('Некорректний розмір блоку');
                return;
            }
            $.ajax({
                method: 'post',
                url: 'http://localhost:3000/block',
                dataType: 'json',
                data: {
                    transactions: transactions,
                    blockSize: blockSize
                },
                success: function(data) {
                    let bounds = data['result'][1]['data']['bounds'];
                    let numeric = data['result'][0]['data']['numerical'];
                    let greedy = data['result'][2]['data']['greedy'];
                    let boundsTime = data['result'][1]['data']['time'];
                    let numericTime = data['result'][0]['data']['time'];
                    let greedyTime = data['result'][2]['data']['time'];
                    let text = 'Результат методу гілок та границь:\n';
                    let summ = 0;
                    let size = 0;
                    for (let i = 0; i < bounds.length; i++) {
                        text += `{${bounds[i]['length']}, ${bounds[i]['fee']}}\n`;
                        summ += +bounds[i]['fee'];
                        size += +bounds[i]['length'];
                    }
                    text += 'Время работы алгоритма: ' + boundsTime + 'ms\n\n';

                    text += '\nРезультат методу повного перебору:\n';
                    
                    for (let i = 0; i < numeric.length; i++) {
                        text += `{${numeric[i]['length']}, ${numeric[i]['fee']}}\n`;
                    }
                    text += 'Время работы алгоритма: ' + numericTime + 'ms\n\n';

                    text += '\nРезультат жадного алгоритма:\n';
                    for (let i = 0; i < greedy.length; i++) {
                        text += `{${greedy[i]['length']}, ${greedy[i]['fee']}}\n`;
                    }
                    text += 'Время работы алгоритма: ' + greedyTime + 'ms\n\n';

                    summs = 'Суммарный размер блока: ' + size + '\n' + 'Суммарная комиссия: ' + summ + '\n\n\n';
                    text = summs + text;
                    $('textarea#result').html(text);

                    var data = {
                        labels: [numericTime + 'ms', boundsTime + 'ms', greedyTime + 'ms'],
                        series: [numericTime, boundsTime, greedyTime]
                    };

                    new Chartist.Pie('.ct-chart', data);
                    $('.legend').css({'display':'block'});
                },
                error: function(err) {
                    console.log(err);
                    alert('Ошибка');
                }
            });
        }
    });

    $('.solve-tx').click(function() {
        let data = $('input[name="size"]').val();
        data = data.split(',');
        if (data.length != 2) {
            alert('Некорректные входные данные');
            return;
        }

        if (data[1] > 250 || !Number.isInteger(+data[1])) {
            alert('Amount of transaction inputs is invalid. Max allowed inputs - 250');
            return;
        } else {


            let transferAmount = data[0];
            if (transferAmount < 0) {
                alert('Invalid transfer amount');
                return;
            }
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
                    let bounds = data['result'][1]['data']['bounds'];
                    let boundsTime = data['result'][1]['data']['time'];
                    let text = 'Результат методу гілок та границь:\n';
                    let summ = 0;
                    let size = 0;
                    for (let i = 0; i < bounds.length; i++) {
                        text += `{${bounds[i]['amount']}, ${bounds[i]['length']}}\n`;
                        summ += +bounds[i]['amount'];
                        size += +bounds[i]['length'];
                    }
                    text += 'Время работы алгоритма: ' + boundsTime + 'ms\n\n';

                    let numeric = data['result'][0]['data']['numerical'];
                    let numericTime = data['result'][0]['data']['time'];
                    text += '\nРезультат методу повного перебору:\n';
                    for (let i = 0; i < numeric.length; i++) {
                        text += `{${numeric[i]['amount']}, ${numeric[i]['length']}}\n`;
                    }
                    text += 'Время работы алгоритма: ' + numericTime + 'ms\n\n';

                    let greedy = data['result'][2]['data']['greedy'];
                    let greedyTime = data['result'][2]['data']['time'];  
                    text += '\nРезультат жадного алгоритма:\n';
                    for (let i = 0; i < greedy.length; i++) {
                        text += `{${greedy[i]['amount']}, ${greedy[i]['length']}}\n`;
                    }
                    text += 'Время работы алгоритма: ' + greedyTime + 'ms\n\n';

                    summs = 'Суммарный размер транзакции: ' + size + '\n' + 'Суммарная размер платежа: ' + summ + '\n\n\n';
                    text = summs + text;
                    $('textarea#result').html(text);

                    var data = {
                    labels: [numericTime + 'ms', boundsTime + 'ms', greedyTime + 'ms'],
                    series: [numericTime, boundsTime, greedyTime]
                    };

                    new Chartist.Pie('.ct-chart', data);
                    $('.legend').css({'display':'block'});
                },
                error: function(err) {
                    console.log(err);
                    alert('Ошибка');
                }
            });
        }
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

    $('#fileblock').on('change', function() {
        let data = new FormData();
        data.append('file', $('#fileblock')[0].files[0]);
        console.log(data.get('file'));
        $.ajax({
            method: 'post',
            url: 'http://localhost:3000/uploadBlock',
            data: data,
            processData: false,
            contentType: false,
            success: function(data) {
                transactions = data.transactions;
                let text = '';
                for (let i = 0; i < data.transactions.length; i++) {
                    text += `{${data.transactions[i]['length']}, ${data.transactions[i]['fee']}}\n`;
                }
                $('textarea#data').html(text);
            },
            error: function(error) {
                alert(`Error: ${error.responseJSON.message}`);
            }
        });
    });

    $('#filetx').on('change', function() {
        let data = new FormData();
        data.append('file', $('#filetx')[0].files[0]);
        console.log(data.get('file'));
        $.ajax({
            method: 'post',
            url: 'http://localhost:3000/uploadTx',
            data: data,
            processData: false,
            contentType: false,
            success: function(data) {
                txInputs = data.txIn;
                console.log(txInputs);
                let text = '';
                for (let i = 0; i < data.txIn.length; i++) {
                    text += `{${data.txIn[i]['amount']}, ${data.txIn[i]['length']}}\n`;
                }
                $('textarea#data').html(text);  
            },
            error: function(error) {
                alert(`Error: ${error.responseJSON.message}`);
            }
        });
    });


});