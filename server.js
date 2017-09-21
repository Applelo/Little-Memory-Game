var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var fs = require("fs");


app.get('/score', function (req, res) {
    fs.readFile( __dirname + "/" + "scores.json", 'utf8', function (err, data) {
        console.log( data );
        res.end( data );
    });
})

app.post('/score', function (req, res) {
    console.log(req.body);
    // First read existing users.
    fs.readFile( __dirname + "/" + "scores.json", 'utf8', function (err, data) {
        data = JSON.parse( data );

        data[data.length] = {
            "score" : req.body.score,
            "nbrClick" : req.body.nbrClick,
            "nbrCase" : req.body.nbrCase,
            "nbrColor" : req.body.nbrColor
        };

        fs.writeFile('scores.json', JSON.stringify(data), 'utf8', null);
        res.end();
    });
});




var server = app.listen(8081, function () {
    var port = server.address().port;
    console.log("Example app listening at http://localhost:%s", port);
});