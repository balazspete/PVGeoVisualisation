var express = require('express');
var https = require('https');
var app = express();

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
});

app.use(express.static(__dirname + '/'));

app.get("/geocode", function(req, res) {
	
	var options = {
		hostname: "maps.googleapis.com",
		port: 443,
		path: "/maps/api/geocode/json?address=" + req["params"]["address"] + "&sensor=false&API=AIzaSyC3pGhmUR8l1Lxi-QEu8LS_4zXnCW9Tcfo",
		method: 'GET'
	};

	var _req = https.request(options, function(_res) {
		var data = "";
		_res.on('data', function(d) {
			data += d;
		});

		_res.on('end', function(){
			res.set({
			  'Content-Type': 'application/json'
			});
			res.send(data);
		})
	});
	_req.end();
});

app.listen(8080);