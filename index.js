// BUILT USING NODE VERSION 8.2.1
// REQUIRE NPM MODULE sqlite3

var http = require('http');
var fs = require('fs');
var sqlite3 = require('sqlite3');

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
				ret = ret.concat("<p>Filter: none</p>");
			} else {
				ret = ret.concat("<p>Filter: " + get['profile'] + "</p>");
			}

			fs.readFile(__dirname + "/indexTABLE.html", (tableErr, tableData) => {
				if (tableErr) throw tableErr;

				let db = new sqlite3.Database('./db/stats.db', err => {
					if (err) console.error(err.message);
				});

				var kost;
				var kosts = [];
				var attkost;
				var attkosts = [];
				var defkost;
				var defkosts = [];

				db.serialize(() => {
					db.each(`SELECT * FROM stats`, (err, row) => {
						if (err) console.error(err.message);

						if (row.kills+row.objectives+row.survives+row.trades==0) {
							if (row.side=="attack") attkosts.push(0);
							if (row.side=="defence") defkosts.push(0);
							kosts.push(0);
						} else {
							if (row.side=="attack") attkosts.push(1);
							if (row.side=="defence") defkosts.push(1);
							kosts.push(1);
						}
					});
				});

				db.close(err => {
					if (err) console.error(err.message);
				
					var total = 0;
					for (var i = 0; i < kosts.length; i++) {
						total+=kosts[i];
					}
					kost = total/kosts.length;

					total = 0;
					for (var i = 0; i < attkosts.length; i++) {
						total+=attkosts[i];
					}
					attkost = total/attkosts.length;

					total = 0;
					for (var i = 0; i < defkosts.length; i++) {
						total+=defkosts[i];
					}
					defkost = total/defkosts.length;

					ret = ret.concat(tableData.toString()
						// Overall stats
						.replace("<!KOST>", kost)
						.replace("<!ATTKOST>", attkost)
						.replace("<!DEFKOST>", defkost)

						// Bank stats
						.replace("<!BANKKOST>", "0.65")
						.replace("<!BANKATTKOST>", "0.65")
						.replace("<!BANKDEFKOST>", "0.65")

						// Border stats
						.replace("<!BORDERKOST>", "0.65")
						.replace("<!BORDERATTKOST>", "0.65")
						.replace("<!BORDERDEFKOST>", "0.65")

						// Chalet stats
						.replace("<!CHALETKOST>", "0.65")
						.replace("<!CHALETATTKOST>", "0.65")
						.replace("<!CHALETDEFKOST>", "0.65")

						// Club house stats
						.replace("<!CLUBHOUSEKOST>", "0.65")
						.replace("<!CLUBHOUSEATTKOST>", "0.65")
						.replace("<!CLUBHOUSEDEFKOST>", "0.65")

						// Coastline stats
						.replace("<!COASTLINEKOST>", "0.65")
						.replace("<!COASTLINEATTKOST>", "0.65")
						.replace("<!COASTLINEDEFKOST>", "0.65")

						// Consulate stats
						.replace("<!CONSULATEKOST>", "0.65")
						.replace("<!CONSULATEATTKOST>", "0.65")
						.replace("<!CONSULATEDEFKOST>", "0.65")

						// Favela stats
						.replace("<!FAVELAKOST>", "0.65")
						.replace("<!FAVELAATTKOST>", "0.65")
						.replace("<!FAVELADEFKOST>", "0.65")

						// Fortress stats
						.replace("<!FORTRESSKOST>", "0.65")
						.replace("<!FORTRESSATTKOST>", "0.65")
						.replace("<!FORTRESSDEFKOST>", "0.65")

						// Hereford base stats
						.replace("<!HEREFORDKOST>", "0.65")
						.replace("<!HEREFORDATTKOST>", "0.65")
						.replace("<!HEREFORDDEFKOST>", "0.65")

						// House stats
						.replace("<!HOUSEKOST>", "0.65")
						.replace("<!HOUSEATTKOST>", "0.65")
						.replace("<!HOUSEDEFKOST>", "0.65")

						// Kafe Dostoyevsky stats
						.replace("<!KAFEKOST>", "0.65")
						.replace("<!KAFEATTKOST>", "0.65")
						.replace("<!KAFEDEFKOST>", "0.65")

						// Kanal stats
						.replace("<!KANALKOST>", "0.65")
						.replace("<!KANALATTKOST>", "0.65")
						.replace("<!KANALDEFKOST>", "0.65")

						// Oregon stats
						.replace("<!OREGONKOST>", "0.65")
						.replace("<!OREGONATTKOST>", "0.65")
						.replace("<!OREGONDEFKOST>", "0.65")

						// Outback stats
						.replace("<!OUTBACKKOST>", "0.65")
						.replace("<!OUTBACKATTKOST>", "0.65")
						.replace("<!OUTBACKDEFKOST>", "0.65")

						// Presidential plane stats
						.replace("<!PLANEKOST>", "0.65")
						.replace("<!PLANEATTKOST>", "0.65")
						.replace("<!PLANEDEFKOST>", "0.65")

						// Skyscraper stats
						.replace("<!SKYSCRAPERKOST>", "0.65")
						.replace("<!SKYSCRAPERATTKOST>", "0.65")
						.replace("<!SKYSCRAPERDEFKOST>", "0.65")

						// Theme park stats
						.replace("<!THEMEPARKKOST>", "0.65")
						.replace("<!THEMEPARKATTKOST>", "0.65")
						.replace("<!THEMEPARKDEFKOST>", "0.65")

						// Tower stats
						.replace("<!TOWERKOST>", "0.65")
						.replace("<!TOWERATTKOST>", "0.65")
						.replace("<!TOWERDEFKOST>", "0.65")

						// Villa stats
						.replace("<!VILLAKOST>", "0.65")
						.replace("<!VILLAATTKOST>", "0.65")
						.replace("<!VILLADEFKOST>", "0.65")

						// Yatch stats
						.replace("<!YACHTKOST>", "0.65")
						.replace("<!YACHTATTKOST>", "0.65")
						.replace("<!YACHTDEFKOST>", "0.65")
					);

					fs.readFile(__dirname + "/indexEND.html", (endErr, endData) => {
						if (endErr) throw endErr;
						ret = ret.concat(endData);
						res.end(ret);
					});
				});
			});

		});
	} else if (page=="/games") {
		res.writeHead(200, {'Content-Type': 'text/html'});
		var ret = "";
		fs.readFile(__dirname + "/gamesSTART.html", (startErr, startData) => {
			if (startErr) throw startErr;
			ret = ret.concat(startData);

			// GAMES ADDITIONS
			if (get['profile'] == undefined) {
				ret = ret.concat("<p>Filter: none</p>");
			} else {
				ret = ret.concat("<p>Filter: " + get['profile'] + "</p>");
			}

			fs.readFile(__dirname + "/gamesEND.html", (endErr, endData) => {
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

			// SUBMIT ADDITIONS
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