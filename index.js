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

			let db = new sqlite3.Database('./db/stats.db', err => {
				if (err) console.error(err.message);
			});

			db.serialize(() => {
				if (get['profile']==undefined) {
					query = `SELECT * FROM stats ORDER BY id ASC, round ASC`;
				} else {
					query = `SELECT * FROM stats WHERE profile="`.concat(get['profile']).concat(`" ORDER BY id ASC, round ASC`);
				}
				db.each(query, (err, row) => {
					if (err) console.error(err.message);
					
					ret+="<tr>";
					ret+="<td>".concat(row.id).concat("</td>");
					ret+="<td>".concat(row.profile).concat("</td>");
					ret+="<td>".concat(row.date).concat("</td>");
					ret+="<td>".concat(row.map).concat("</td>");
					ret+="<td>".concat(row.round).concat("</td>");
					ret+="<td>".concat(row.side).concat("</td>");
					ret+="<td>".concat(row.result).concat("</td>");
					ret+="<td>".concat(row.kills).concat("</td>");
					ret+="<td>".concat(row.objectives).concat("</td>");
					ret+="<td>".concat(row.survives).concat("</td>");
					ret+="<td>".concat(row.trades).concat("</td>");
					ret+="</tr>";
				});
			});

			db.close(err => {
				if (err) console.error(err.message);

				fs.readFile(__dirname + "/gamesEND.html", (endErr, endData) => {
					if (endErr) throw endErr;
					ret = ret.concat(endData);
					res.end(ret);
				});

			});
			
		});
	} else if (page=="/submit") {
		res.writeHead(200, {'Content-Type': 'text/html'});
		var ret = "";
		fs.readFile(__dirname + "/submitSTART.html", (startErr, startData) => {
			if (startErr) throw startErr;
			ret = ret.concat(startData);

			// SUBMIT ADDITIONS
			if (req.method!='POST') {

				// give form
				fs.readFile(__dirname + "/submitFORM.html", (formErr, formData) => {
					if (formErr) throw formErr;

					var d = new Date()
					var fd = d.getFullYear().toString().concat("/");
					if ((d.getMonth()+1).toString().length==1) {
						fd+="0".concat(d.getMonth()+1);
					} else {
						fd+=(d.getMonth()+1).toString();
					}
					fd+="/";
					if (d.getDate().toString().length==1) {
						fd+="0".concat(d.getDate());
					} else {
						fd+=d.getDate().toString();
					}
					ret = ret.concat(formData.toString().replace("<!DATE>", fd));
				
					fs.readFile(__dirname + "/submitEND.html", (endErr, endData) => {
						if (endErr) throw endErr;
						ret = ret.concat(endData);
						res.end(ret);
					});
				});

			} else {
				// process submission
				var body = '';
				req.on('data', data => {
					body+=data;
				});
				req.on('end', () => {
					var postList = body.split(/&/);
					var post = [];
					for (var i = 0; i < postList.length; i++) {
						var index = postList[i].substr(0, postList[i].indexOf("="));
						var content = postList[i].substr(postList[i].indexOf("=") + 1);
						post[index] = content;
					}

					let db = new sqlite3.Database('./db/stats.db', err => {
						if (err) console.error(err.message);
					});

					var id;
					db.serialize(() => {
						db.each(`SELECT * FROM stats WHERE id=(SELECT MAX(id) FROM stats)`, (err, row) => {
							id = row.id+1;
						});
					});

					db.close(err => {
						if (err) console.error(err.message);

						let db2 = new sqlite3.Database('./db/stats.db', err => {
							if (err) console.error(err.message);
						});

						var insertRound = n => {
							if (!(post['r'+n+'side']
								.concat(post['r'+n+'result'])
								.concat(post['r'+n+'kills'])
								.concat(post['r'+n+'objectives'])
								.concat(post['r'+n+'survives'])
								.concat(post['r'+n+'trades'])=="")) {

								db2.run(`
									INSERT INTO stats (
										id,
										profile,
										date,
										map,
										round,
										side,
										result,
										kills,
										objectives,
										survives,
										trades)
									VALUES (?,?,?,?,?,?,?,?,?,?,?)
								`, 	[
										id, 
										post['profile'], 
										post['date'].replace(/%2F/g, "/"), 
										post['map'],
										n,
										post['r'+n+'side'],
										post['r'+n+'result'],
										post['r'+n+'kills'],
										post['r'+n+'objectives'],
										post['r'+n+'survives'],
										post['r'+n+'trades']
							   		]
								), err => {
									if (err) console.error(err.message);
								};
							}
						}

						for (var i = 1; i <10; i++) {
							insertRound(i);
						}

						db2.close(err => {
							ret+="<p>Sucessfully added.</p>";
							fs.readFile(__dirname + "/submitEND.html", (endErr, endData) => {
								if (endErr) throw endErr;
								ret = ret.concat(endData);
								res.end(ret);
							});
						});
					});
				});
			}
			
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