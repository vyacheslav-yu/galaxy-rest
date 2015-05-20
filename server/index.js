var http    = require('http'),
	itemOne = new (require('./models/trigger')).Trigger(),
	itemTwo = new (require('./models/trigger')).Trigger();

itemOne.setRandomState();
itemTwo.setRandomState();

http.createServer(function(req, res) {
	req.originUrl = req.url;

	if (req.connection.remoteAddress !== '127.0.0.1') {
		badRequest();
	} else {
		isRest(req, res);
	}
}).listen(3000);

function badRequest(req, res) {
	console.error(req.originUrl);
	res.writeHead(401, {});
	res.write('bad request');
	res.end();
}

function isRest(req, res) {
	if (req.url.substr(0,5) === '/rest') {
		req.url = req.url.length === 5 ? '/' : req.url.substr(5);
		req.params = req.url.split('/').filter(function(value) {
			return value.length > 0;
		});
		rest(req, res);
	} else {
		badRequest(req, res);
	}
}

function rest(req, res) {

	if (req.params[0] === 'triggers') {
		req.params.shift();
		triggers(req, res);
	} else {
		badRequest(req, res);
	}
}

function triggers(req, res) {
	if (req.params[0] === 'one') {
		req.params.shift();
		trigger(req, res, itemOne);
	} else if (req.params[0] === 'two') {
		req.params.shift();
		trigger(req, res, itemTwo);
	} {
		res.write(toJSON([{id: 'one'}, {id: 'two'}]));
		res.end();
	}
}

function trigger(req, res, item) {
	if (req.params.length === 0) {
		res.write(toJSON(item.getState()));
	} else {
		switch (req.params[0]) {
			case 'a':
				res.write(toJSON(item.setState('a')));
				break;
			case 'b':
				res.write(toJSON(item.setState('b')));
				break;
			case 'c':
				res.write(toJSON(item.setState('c')));
				break;
			case 'r':
				res.write(toJSON(item.setRandomState()));
				break;
		}
	}
	res.end();
}

function toJSON(object) {
	var cache = [];
	object = JSON.stringify(object, function(key, value) {
		if (typeof value === 'object' && value !== null) {
			if (cache.indexOf(value) !== -1) {
				return;
			}
			cache.push(value);
		}
		return value;
	});
	return object;
}