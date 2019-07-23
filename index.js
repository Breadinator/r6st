// BUILT USING NODE VERSION 8.2.1

var http = require('http');
var fs = require('fs');

var server = http.createServer((req, res) => {
	var url = req.url;
	var page;
	var get = {};
	if (url.indexOf('?')!=-1) {
		page = url.substr(0, url.indexOf('?'));
		var getRaw = url.substr(url.indexOf('?')+1);
		var getList = getRaw.split(/&/);
		
		for (var i = 0; i < getList.length; i++) {
			var index = getList[i].substr(0, getList[i].indexOf("="));
			var content = getList[i].substr(getList[i].indexOf("=") + 1);
			get[index] = content;
		}
	} else {
		var page = url;
		var getRaw = "";
		get = {};
	}

	if (page=="/") {
		res.writeHead(200, {'Content-Type': 'text/html'});
		var ret = "";
		fs.readFile(__dirname + "/indexSTART.html", (startErr, startData) => {
			if (startErr) throw startErr;
			ret = ret.concat(startData);

			// INDEX ADDITIONS
			if (get['profile'] == undefined) {
				ret = ret.concat("<p>No profile selected</p>");
			} else {
				ret = ret.concat("<p>" + get['profile'] + "</p>");
			}


			fs.readFile(__dirname + "/indexEND.html", (endErr, endData) => {
				if (endErr) throw endErr;
				ret = ret.concat(endData);
				res.end(ret);
			});
		});
	} else if (page=="/submit") {
		res.writeHead(200, {'Content-Type': 'text/html'});
		var ret = "";
		fs.readFile(__dirname + "/submitSTART.html", (startErr, startData) => {
			if (startErr) throw startErr;
			ret = ret.concat(startData);

			// INDEX ADDITIONS
			ret = ret.concat("<p>WIP</p>");


			fs.readFile(__dirname + "/submitEND.html", (endErr, endData) => {
				if (endErr) throw endErr;
				ret = ret.concat(endData);
				res.end(ret);
			});
		});
	} else if (url=="/style.css") {
		res.writeHead(200, {'Content-Type': 'text/css'});
		var pageData = fs.createReadStream(__dirname + "/style.css", 'utf8');
		pageData.pipe(res);
	} else {
		res.writeHead(404, {'Content-Type': 'text/html'});
		var pageData = fs.createReadStream(__dirname + "/404.html", 'utf8');
		pageData.pipe(res);
	}
});

server.listen(12657);
console.log("Listening on port 12657");