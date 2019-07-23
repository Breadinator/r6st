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

				var kostList = {
					'overall': {
						'kosts': [],
						'attkosts': [],
						'defkosts': []
					},
					'bank': {
						'kosts': [],
						'attkosts': [],
						'defkosts': []
					},
					'border': {
						'kosts': [],
						'attkosts': [],
						'defkosts': []
					},
					'chalet': {
						'kosts': [],
						'attkosts': [],
						'defkosts': []
					},
					'club house': {
						'kosts': [],
						'attkosts': [],
						'defkosts': []
					},
					'coastline': {
						'kosts': [],
						'attkosts': [],
						'defkosts': []
					},
					'consulate': {
						'kosts': [],
						'attkosts': [],
						'defkosts': []
					},
					'favela': {
						'kosts': [],
						'attkosts': [],
						'defkosts': []
					},
					'fortress': {
						'kosts': [],
						'attkosts': [],
						'defkosts': []
					},
					'hereford': {
						'kosts': [],
						'attkosts': [],
						'defkosts': []
					},
					'house': {
						'kosts': [],
						'attkosts': [],
						'defkosts': []
					},
					'kafe': {
						'kosts': [],
						'attkosts': [],
						'defkosts': []
					},
					'kanal': {
						'kosts': [],
						'attkosts': [],
						'defkosts': []
					},
					'oregon': {
						'kosts': [],
						'attkosts': [],
						'defkosts': []
					},
					'outback': {
						'kosts': [],
						'attkosts': [],
						'defkosts': []
					},
					'plane': {
						'kosts': [],
						'attkosts': [],
						'defkosts': []
					},
					'skyscraper': {
						'kosts': [],
						'attkosts': [],
						'defkosts': []
					},
					'themepark': {
						'kosts': [],
						'attkosts': [],
						'defkosts': []
					},
					'tower': {
						'kosts': [],
						'attkosts': [],
						'defkosts': []
					},
					'villa': {
						'kosts': [],
						'attkosts': [],
						'defkosts': []
					},
					'yacht': {
						'kosts': [],
						'attkosts': [],
						'defkosts': []
					},
				}

				db.serialize(() => {
					if (get['profile']==undefined) {
						var query = `SELECT * FROM stats`;
					} else {
						var query = `SELECT * FROM stats WHERE profile="`+get['profile']+`"`;
					}
					db.each(query, (err, row) => {
						if (err) console.error(err.message);

						var kost;
						if (row.kills+row.objectives+row.survives+row.trades==0) {
							kost=0;
						} else {
							kost=1;
						}

						kostList['overall']['kosts'].push(kost);
						kostList[row.map]['kosts'].push(kost);
						if (row.side=="attack") {
							kostList['overall']['attkosts'].push(kost);
							if (row.map!="" && row.map!=undefined) kostList[row.map]['attkosts'].push(kost);
						}
						if (row.side=="defence") {
							kostList['overall']['defkosts'].push(kost);
							if (row.map!="" && row.map!=undefined) kostList[row.map]['defkosts'].push(kost);
						}
					});
				});

				db.close(err => {
					if (err) console.error(err.message);

					var avg = arr => {
						var total = 0;
						for (var i = 0; i < arr.length; i++) {
							total+=arr[i];
						}
						return total/arr.length;
					}

					ret = ret.concat(tableData.toString()
						// Overall stats
						.replace("<!KOST>",    avg(kostList['overall'][   'kosts']))
						.replace("<!ATTKOST>", avg(kostList['overall']['attkosts']))
						.replace("<!DEFKOST>", avg(kostList['overall']['defkosts']))

						// Bank stats
						.replace("<!BANKKOST>",    avg(kostList['bank'][   'kosts']))
						.replace("<!BANKATTKOST>", avg(kostList['bank']['attkosts']))
						.replace("<!BANKDEFKOST>", avg(kostList['bank']['defkosts']))

						// Border stats
						.replace("<!BORDERKOST>",    avg(kostList['border'][   'kosts']))
						.replace("<!BORDERATTKOST>", avg(kostList['border']['attkosts']))
						.replace("<!BORDERDEFKOST>", avg(kostList['border']['defkosts']))

						// Chalet stats
						.replace("<!CHALETKOST>",    avg(kostList['chalet'][   'kosts']))
						.replace("<!CHALETATTKOST>", avg(kostList['chalet']['attkosts']))
						.replace("<!CHALETDEFKOST>", avg(kostList['chalet']['defkosts']))

						// Club house stats
						.replace("<!CLUBHOUSEKOST>",    avg(kostList['club house'][   'kosts']))
						.replace("<!CLUBHOUSEATTKOST>", avg(kostList['club house']['attkosts']))
						.replace("<!CLUBHOUSEDEFKOST>", avg(kostList['club house']['defkosts']))

						// Coastline stats
						.replace("<!COASTLINEKOST>",    avg(kostList['coastline'][   'kosts']))
						.replace("<!COASTLINEATTKOST>", avg(kostList['coastline']['attkosts']))
						.replace("<!COASTLINEDEFKOST>", avg(kostList['coastline']['defkosts']))

						// Consulate stats
						.replace("<!CONSULATEKOST>",    avg(kostList['consulate'][   'kosts']))
						.replace("<!CONSULATEATTKOST>", avg(kostList['consulate']['attkosts']))
						.replace("<!CONSULATEDEFKOST>", avg(kostList['consulate']['defkosts']))

						// Favela stats
						.replace("<!FAVELAKOST>",    avg(kostList['favela'][   'kosts']))
						.replace("<!FAVELAATTKOST>", avg(kostList['favela']['attkosts']))
						.replace("<!FAVELADEFKOST>", avg(kostList['favela']['defkosts']))

						// Fortress stats
						.replace("<!FORTRESSKOST>",    avg(kostList['fortress'][   'kosts']))
						.replace("<!FORTRESSATTKOST>", avg(kostList['fortress']['attkosts']))
						.replace("<!FORTRESSDEFKOST>", avg(kostList['fortress']['defkosts']))

						// Hereford base stats
						.replace("<!HEREFORDKOST>",    avg(kostList['hereford'][   'kosts']))
						.replace("<!HEREFORDATTKOST>", avg(kostList['hereford']['attkosts']))
						.replace("<!HEREFORDDEFKOST>", avg(kostList['hereford']['defkosts']))

						// House stats
						.replace("<!HOUSEKOST>",    avg(kostList['house'][   'kosts']))
						.replace("<!HOUSEATTKOST>", avg(kostList['house']['attkosts']))
						.replace("<!HOUSEDEFKOST>", avg(kostList['house']['defkosts']))

						// Kafe Dostoyevsky stats
						.replace("<!KAFEKOST>",    avg(kostList['kafe'][   'kosts']))
						.replace("<!KAFEATTKOST>", avg(kostList['kafe']['attkosts']))
						.replace("<!KAFEDEFKOST>", avg(kostList['kafe']['defkosts']))

						// Kanal stats
						.replace("<!KANALKOST>",    avg(kostList['kanal'][   'kosts']))
						.replace("<!KANALATTKOST>", avg(kostList['kanal']['attkosts']))
						.replace("<!KANALDEFKOST>", avg(kostList['kanal']['defkosts']))

						// Oregon stats
						.replace("<!OREGONKOST>",    avg(kostList['oregon'][   'kosts']))
						.replace("<!OREGONATTKOST>", avg(kostList['oregon']['attkosts']))
						.replace("<!OREGONDEFKOST>", avg(kostList['oregon']['defkosts']))

						// Outback stats
						.replace("<!OUTBACKKOST>",    avg(kostList['outback'][   'kosts']))
						.replace("<!OUTBACKATTKOST>", avg(kostList['outback']['attkosts']))
						.replace("<!OUTBACKDEFKOST>", avg(kostList['outback']['defkosts']))

						// Presidential plane stats
						.replace("<!PLANEKOST>",    avg(kostList['plane'][   'kosts']))
						.replace("<!PLANEATTKOST>", avg(kostList['plane']['attkosts']))
						.replace("<!PLANEDEFKOST>", avg(kostList['plane']['defkosts']))

						// Skyscraper stats
						.replace("<!SKYSCRAPERKOST>",    avg(kostList['skyscraper'][   'kosts']))
						.replace("<!SKYSCRAPERATTKOST>", avg(kostList['skyscraper']['attkosts']))
						.replace("<!SKYSCRAPERDEFKOST>", avg(kostList['skyscraper']['defkosts']))

						// Theme park stats
						.replace("<!THEMEPARKKOST>",    avg(kostList['themepark'][   'kosts']))
						.replace("<!THEMEPARKATTKOST>", avg(kostList['themepark']['attkosts']))
						.replace("<!THEMEPARKDEFKOST>", avg(kostList['themepark']['defkosts']))

						// Tower stats
						.replace("<!TOWERKOST>",    avg(kostList['tower'][   'kosts']))
						.replace("<!TOWERATTKOST>", avg(kostList['tower']['attkosts']))
						.replace("<!TOWERDEFKOST>", avg(kostList['tower']['defkosts']))

						// Villa stats
						.replace("<!VILLAKOST>",    avg(kostList['villa'][   'kosts']))
						.replace("<!VILLAATTKOST>", avg(kostList['villa']['attkosts']))
						.replace("<!VILLADEFKOST>", avg(kostList['villa']['defkosts']))

						// Yatch stats
						.replace("<!YACHTKOST>",    avg(kostList['yacht'][   'kosts']))
						.replace("<!YACHTATTKOST>", avg(kostList['yacht']['attkosts']))
						.replace("<!YACHTDEFKOST>", avg(kostList['yacht']['defkosts']))
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