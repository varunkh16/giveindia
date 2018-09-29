var express = require('express');
var app = express();
const bodyParser = require('body-parser');

var session = new Array();

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json())

// respond with "hello world" when a GET request is made to the homepage
app.all('/process/*', function(req, res) {

    var randSec = randomIntFromInterval(15, 20);

    var resJSON = {
        "time": new Date(),
        "method": req.method,
        "headers": req.headers,
        "path": req._parsedUrl.path,
        "query": req.query,
        "duration": randSec
    };

    if (req.body != undefined) {
        resJSON["body"] = req.body;
    }

    setTimeout(function() {
        session.push(resJSON);
        res.send(JSON.stringify(resJSON));
    }, randSec * 1000);

});

app.all('/stats', function(req, res) {

    var resJSON = {};

    resJSON["overall"] = overallAPICompute();
    resJSON["one hour"] = lastHourAPIData();
    resJSON["one minute"] = lastMinuteAPIData();

    res.send(JSON.stringify(resJSON));
});

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function overallAPICompute() {
    var resStat = {
        "total": session.length
    }
    if (session.length > 0) {
        var getTotalTime = 0;
        var postTotalTime = 0;
        var getCount = 0;
        var postCount = 0;
        for (var i = 0; i < session.length; i++) {
            if (session[i].method == "GET") {
                getTotalTime += session[i].duration;
                getCount++;
            }
            if (session[i].method == "POST") {
                postTotalTime += session[i].duration;
                postCount++
            }
        }
        if (getCount > 0) {
            resStat["GET"] = getTotalTime / getCount;
        }
        if (postCount > 0) {
            resStat["POST"] = postTotalTime / postCount;
        }
    }
    return resStat;
}

function lastHourAPIData() {
    var resStat = {};
    var currentDate = new Date();
    var getTotalTime = 0;
    var postTotalTime = 0;
    var totalCount = 0;
    var getCount = 0;
    var postCount = 0;
    for (var i = 0; i < session.length; i++) {
        totalCount++;
        const start = session[i].time.getTime();
        const end = currentDate.getTime();

        const diff = end - start;
        const seconds = Math.floor(diff / 1000);

        console.log("One Hour:"+seconds);
        if (seconds <= 3600) {
            if (session[i].method == "GET") {
                getTotalTime += session[i].duration;
                getCount++;
            }
            if (session[i].method == "POST") {
                postTotalTime += session[i].duration;
                postCount++
            }
        }

    }
    resStat["Total"] = totalCount;
    if (getCount > 0) {
        resStat["GET"] = getTotalTime / getCount;
    }
    if (postCount > 0) {
        resStat["POST"] = postTotalTime / postCount;
    }
    return resStat;
}

function lastMinuteAPIData() {
    var resStat = {};
    var currentDate = new Date();
    var getTotalTime = 0;
    var postTotalTime = 0;
    var totalCount = 0;
    var getCount = 0;
    var postCount = 0;
    for (var i = 0; i < session.length; i++) {
        totalCount++;
        const start = session[i].time.getTime();
        const end = currentDate.getTime();

        const diff = end - start;
        const seconds = Math.floor(diff / 1000);

        console.log("One Minute:"+seconds);

        if (seconds <= 60) {
            if (session[i].method == "GET") {
                getTotalTime += session[i].duration;
                getCount++;
            }
            if (session[i].method == "POST") {
                postTotalTime += session[i].duration;
                postCount++
            }
        }

    }
    resStat["Total"] = totalCount;
    if (getCount > 0) {
        resStat["GET"] = getTotalTime / getCount;
    }
    if (postCount > 0) {
        resStat["POST"] = postTotalTime / postCount;
    }
    return resStat;
}

app.listen(3000, function() {
    console.log("Listening on port 3000");
});