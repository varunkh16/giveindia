var express = require('express');
var app = express();
const bodyParser = require('body-parser');

var session = new Array();
var activeReq = new Array();

var Utility = require("./utility.js").Utility;
var util = new Utility();

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json())

// respond with the metadata for the request
app.all('/process/*', function(req, res) {

    var randSec = randomIntFromInterval(15, 20);

    var timeStamp = new Date();

    var resJSON = {
        "time": timeStamp,
        "method": req.method,
        "headers": req.headers,
        "path": req._parsedUrl.path,
        "query": req.query,
        "duration": randSec
    };

    if (req.body != undefined) {
        resJSON["body"] = req.body;
    }

    activeReq.push(resJSON);

    var id = timeStamp + "|" + req.method;
    setTimeout(function() {
        var val = id.split("|");
        for (var a = 0; a < activeReq.length; a++) {

            if (activeReq[a].time == val[0]) {
                if (activeReq[a].method == val[1]) {
                    activeReq.splice(a, 1);
                }
            }
        }
        session.push(resJSON);
        res.send(JSON.stringify(resJSON));
    }, randSec * 1000, id);

});

//provides the status of the current session
app.all('/stats', function(req, res) {

    var resJSON = {};

    resJSON["overall"] = util.overallAPICompute(session);
    resJSON["active requests"] = util.overallAPICompute(activeReq);
    resJSON["one hour"] = util.lastHourMinuteAPIData(session,3600);
    resJSON["one minute"] = util.lastHourMinuteAPIData(session,60);

    res.send(JSON.stringify(resJSON));
});

//function to get the random number for timeout
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

app.listen(3000, function() {
    console.log("Listening on port 3000");
});