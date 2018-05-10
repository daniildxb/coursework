$(document).ready(function() {
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
            },
            error: function(err) {
                console.log(err);
                alert('Ошибка');
            }
        });
    });
});