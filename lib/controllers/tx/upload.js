fs = require('fs');

function uploadFile(req, res) {
	let file = req.files.file;
	let txIn = [];
	let path = '/Users/volshebniqq/Work/coursework/coursework/file.txt';

	file.mv(path, function(err) {
	    if (err)
	      console.log(err);
	});

	fs.readFile(path, 'utf8', function (err,data) {
	  if (err) {
	    return console.log(err);
	  }
	  let arr = data.split('\n');
	  for (let i = 0; i < arr.length; i++) {
	  	arr[i] = arr[i].slice(0, -1);
	  	arr[i] = arr[i].slice(1);
	  	arr[i] = arr[i].split(', ');
	  	let tx = {
            id: i,
            amount: arr[i][0],
            length: arr[i][1]
        };
        txIn.push(tx);
       }
       res.status(200).send({txIn});
	});
	
}

module.exports = uploadFile;