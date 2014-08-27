//
// The MIT License (MIT)
//
// Copyright (c) 2014 Balázs Pete
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

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
